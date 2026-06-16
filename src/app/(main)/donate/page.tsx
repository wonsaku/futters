'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import { createClient } from '@/lib/supabase/client'
import { Heart } from 'lucide-react'

const PRESETS = [5000, 10000, 30000, 50000]

function formatKRW(n: number) {
  return n.toLocaleString('ko-KR') + '원'
}

export default function DonatePage() {
  const router = useRouter()
  const supabase = createClient()
  const [selected, setSelected] = useState(10000)
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const finalAmount = custom ? Number(custom.replace(/[^0-9]/g, '')) : selected

  const handleDonate = async () => {
    if (!finalAmount || finalAmount < 1000) {
      setError('최소 후원 금액은 1,000원이에요.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
      if (!clientKey) {
        setError('결제 설정이 완료되지 않았어요. 관리자에게 문의하세요.')
        setLoading(false)
        return
      }

      const tossPayments = await loadTossPayments(clientKey)
      const payment = tossPayments.payment({ customerKey: user.id })

      const orderId = `donation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      await payment.requestPayment({
        method: 'CARD',
        amount: { value: finalAmount, currency: 'KRW' },
        orderId,
        orderName: 'Footers 팀 후원',
        successUrl: `${window.location.origin}/donate/success`,
        failUrl: `${window.location.origin}/donate/fail`,
      })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg !== 'User closed the payment' && msg !== '사용자가 결제를 취소했습니다.') {
        setError(`오류: ${msg}`)
      }
      setLoading(false)
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'var(--footers-warm)' }}>
          <Heart size={32} style={{ color: 'var(--footers-green)' }} />
        </div>
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--footers-dark)' }}>팀 후원하기</h1>
        <p className="text-sm" style={{ color: 'var(--footers-gray)' }}>
          Footers 풋살팀의 장비 구입과 경기 운영을 응원해주세요 ⚽
        </p>
      </div>

      {/* 금액 선택 */}
      <div className="footers-card p-6 mb-4">
        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--footers-dark)' }}>후원 금액 선택</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {PRESETS.map((amount) => (
            <button
              key={amount}
              onClick={() => { setSelected(amount); setCustom('') }}
              className="py-3 rounded-xl text-sm font-semibold border-2 transition-all"
              style={{
                borderColor: selected === amount && !custom ? 'var(--footers-green)' : '#E5E7EB',
                background: selected === amount && !custom ? 'var(--footers-warm)' : 'white',
                color: selected === amount && !custom ? 'var(--footers-green)' : 'var(--footers-dark)',
              }}
            >
              {formatKRW(amount)}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            className="footers-input pr-8"
            placeholder="직접 입력"
            value={custom}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, '')
              setCustom(raw ? Number(raw).toLocaleString('ko-KR') : '')
            }}
            onFocus={() => setSelected(0)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--footers-gray)' }}>원</span>
        </div>
      </div>

      {/* 최종 금액 표시 */}
      {finalAmount >= 1000 && (
        <div className="footers-card p-4 mb-4 flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--footers-gray)' }}>결제 금액</span>
          <span className="text-lg font-black" style={{ color: 'var(--footers-green)' }}>
            {formatKRW(finalAmount)}
          </span>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200 mb-4">{error}</p>
      )}

      <button
        onClick={handleDonate}
        disabled={loading || !finalAmount || finalAmount < 1000}
        className="w-full footers-btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Heart size={16} />
        {loading ? '결제창 열는 중...' : `${finalAmount >= 1000 ? formatKRW(finalAmount) + ' ' : ''}후원하기`}
      </button>

      <p className="text-xs text-center mt-4" style={{ color: 'var(--footers-gray)' }}>
        토스페이먼츠를 통해 안전하게 결제됩니다
      </p>
    </main>
  )
}
