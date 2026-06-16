'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 해요.')
      return
    }

    setLoading(true)

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (signupError) {
      setError('회원가입 중 오류가 발생했어요. 다시 시도해주세요.')
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, nickname: nickname.trim() })
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: 'var(--futters-light)' }}>
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--futters-dark)' }}>이메일을 확인해주세요</h2>
        <p className="text-sm" style={{ color: 'var(--futters-gray)' }}>
          {email}로 인증 메일을 보냈어요.<br />링크를 클릭하면 로그인됩니다.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--futters-light)' }}>
      <Link href="/" className="font-black text-2xl mb-8" style={{ color: 'var(--futters-green)' }}>
        ⚽ Futters
      </Link>

      <div className="futters-card p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--futters-dark)' }}>
          회원가입
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--futters-dark)' }}>닉네임</label>
            <input
              type="text"
              className="futters-input"
              placeholder="팀에서 불릴 이름"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              maxLength={20}
            />
          </div>
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
              placeholder="6자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>
          )}

          <button type="submit" className="futters-btn-primary mt-1" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--futters-gray)' }}>
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-semibold" style={{ color: 'var(--futters-green)' }}>
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
