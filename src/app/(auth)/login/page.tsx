'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않아요.')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--futters-light)' }}>
      <Link href="/" className="font-black text-2xl mb-8" style={{ color: 'var(--futters-green)' }}>
        ⚽ Futters
      </Link>

      <div className="futters-card p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--futters-dark)' }}>
          로그인
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--futters-dark)' }}>이메일</label>
            <input
              type="email"
              className="futters-input"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--futters-dark)' }}>비밀번호</label>
            <input
              type="password"
              className="futters-input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>
          )}

          <button type="submit" className="futters-btn-primary mt-1" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--futters-gray)' }}>
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" className="font-semibold" style={{ color: 'var(--futters-green)' }}>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
