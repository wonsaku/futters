import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ paymentKey: string; orderId: string; amount: string }>
}) {
  const { paymentKey, orderId, amount } = await searchParams

  let success = false
  let errorMsg = ''

  try {
    const secretKey = process.env.TOSS_SECRET_KEY
    if (!secretKey) throw new Error('결제 설정이 완료되지 않았어요.')

    const encoded = Buffer.from(`${secretKey}:`).toString('base64')

    const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': orderId,
      },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
      cache: 'no-store',
    })

    if (res.ok) {
      success = true
    } else {
      const data = await res.json()
      errorMsg = data.message ?? '결제 승인에 실패했어요.'
    }
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : '알 수 없는 오류가 발생했어요.'
  }

  if (!success) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="footers-card p-10">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-black mb-2" style={{ color: 'var(--footers-dark)' }}>결제 승인 실패</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--footers-gray)' }}>{errorMsg}</p>
          <Link href="/donate" className="footers-btn-primary inline-block">다시 시도하기</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="footers-card p-10">
        <div className="flex justify-center mb-4" style={{ color: 'var(--footers-green)' }}>
          <CheckCircle size={56} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--footers-dark)' }}>후원 완료!</h1>
        <p className="text-sm mb-1" style={{ color: 'var(--footers-gray)' }}>
          <span className="font-semibold" style={{ color: 'var(--footers-green)' }}>
            {Number(amount).toLocaleString('ko-KR')}원
          </span>
          을 후원해주셨어요
        </p>
        <p className="text-sm mb-8" style={{ color: 'var(--footers-gray)' }}>
          Footers 팀원 모두가 감사드려요 ⚽
        </p>
        <Link
          href="/"
          className="footers-btn-primary inline-block"
        >
          메인으로 돌아가기
        </Link>
      </div>
    </main>
  )
}
