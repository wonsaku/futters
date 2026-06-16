'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const supabase = createClient()
  const [nickname, setNickname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.')
      return
    }
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      setError('아이디는 영문 소문자, 숫자, 밑줄(_)만 사용 가능하며 3~20자여야 해요.')
      return
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 해요.')
      return
    }

    setLoading(true)

    // 내부적으로 username@footers.local 형식의 이메일로 처리
    const internalEmail = `${username}@footers.local`

    const { error: signupError } = await supabase.auth.signUp({
      email: internalEmail,
      password,
      options: {
        data: {
          nickname: nickname.trim(),
          username: username,
        },
      },
    })

    if (signupError) {
      if (signupError.message.includes('already registered')) {
        setError('이미 사용 중인 아이디에요.')
      } else {
        setError('가입 신청 중 오류가 발생했어요. 다시 시도해주세요.')
      }
      setLoading(false)
      return
    }

    await supabase.auth.signOut()
    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: 'var(--footers-light)' }}>
        <div className="footers-card p-10 max-w-sm w-full">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--footers-dark)' }}>
            가입 신청 완료!
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--footers-gray)' }}>
            운영진의 승인을 기다리고 있어요.<br />
            승인이 완료되면 로그인할 수 있어요.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 mb-6">
            신청 아이디: <strong>{username}</strong>
          </div>
          <Link href="/login" className="footers-btn-primary block text-center">
            로그인 페이지로
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--footers-light)' }}>
      <Link href="/" className="font-black text-2xl mb-8" style={{ color: 'var(--footers-green)' }}>
        ⚽ Footers
      </Link>

      <div className="footers-card p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold mb-2 text-center" style={{ color: 'var(--footers-dark)' }}>
          회원가입 신청
        </h1>
        <p className="text-center text-xs mb-6" style={{ color: 'var(--footers-gray)' }}>
          운영진 승인 후 서비스를 이용할 수 있어요
        </p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>닉네임</label>
            <input
              type="text"
              className="footers-input"
              placeholder="팀에서 불릴 이름"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              maxLength={20}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>
              아이디
              <span className="ml-1 font-normal text-xs" style={{ color: 'var(--footers-gray)' }}>
                (영문 소문자·숫자·_ 3~20자)
              </span>
            </label>
            <input
              type="text"
              className="footers-input"
              placeholder="예: hong_gildong"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              maxLength={20}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>비밀번호</label>
            <input
              type="password"
              className="footers-input"
              placeholder="6자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>
          )}

          <button type="submit" className="footers-btn-primary mt-1" disabled={loading}>
            {loading ? '신청 중...' : '가입 신청하기'}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--footers-gray)' }}>
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-semibold" style={{ color: 'var(--footers-green)' }}>
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
