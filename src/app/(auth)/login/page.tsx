'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const internalEmail = `${username.trim().toLowerCase()}@footers.local`

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: internalEmail,
      password,
    })

    if (loginError || !data.user) {
      setError('아이디 또는 비밀번호가 올바르지 않아요.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', data.user.id)
      .single()

    if (!profile) {
      setError('계정 정보를 찾을 수 없어요.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (profile.status === 'pending') {
      await supabase.auth.signOut()
      router.push('/pending')
      return
    }

    if (profile.status === 'rejected') {
      await supabase.auth.signOut()
      setError('가입 신청이 거절되었어요. 운영진에게 문의해주세요.')
      setLoading(false)
      return
    }

    // 승인됨
    if (profile.role === 'admin') {
      router.push('/admin/members')
    } else {
      router.push('/notices')
    }
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--footers-light)' }}>
      <Link href="/" className="font-black text-2xl mb-8" style={{ color: 'var(--footers-green)' }}>
        ⚽ Footers
      </Link>

      <div className="footers-card p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--footers-dark)' }}>
          로그인
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>아이디</label>
            <input
              type="text"
              className="footers-input"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>비밀번호</label>
            <input
              type="password"
              className="footers-input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>
          )}

          <button type="submit" className="footers-btn-primary mt-1" disabled={loading}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--footers-gray)' }}>
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" className="font-semibold" style={{ color: 'var(--footers-green)' }}>
            가입 신청
          </Link>
        </p>
      </div>
    </div>
  )
}
