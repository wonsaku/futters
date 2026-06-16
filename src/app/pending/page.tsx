'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function PendingPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: 'var(--footers-light)' }}>
      <Link href="/" className="font-black text-2xl mb-10" style={{ color: 'var(--footers-green)' }}>
        ⚽ Footers
      </Link>

      <div className="footers-card p-10 max-w-sm w-full">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--footers-dark)' }}>
          승인 대기 중이에요
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--footers-gray)' }}>
          운영진이 가입 신청을 검토 중이에요.<br />
          승인이 완료되면 로그인할 수 있어요.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 mb-6">
          운영진에게 문의하면 더 빨리 승인받을 수 있어요 ⚽
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2.5 rounded-xl text-sm font-medium border transition-colors"
          style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
