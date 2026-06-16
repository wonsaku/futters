'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  isLoggedIn: boolean
  nickname: string | null
  role: string | null
}

const NAV = [
  { href: '/notices', label: '📢 공지사항' },
  { href: '/matches', label: '📋 경기 기록' },
  { href: '/photos', label: '📸 팀 사진' },
  { href: '/board', label: '💬 자유게시판' },
]

export default function HomeHeader({ isLoggedIn, nickname, role }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const logout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <span className="font-black text-xl tracking-tight flex-shrink-0" style={{ color: 'var(--footers-green)' }}>
          ⚽ Footers
        </span>

        {isLoggedIn ? (
          <div className="flex items-center gap-1 flex-1 justify-between">
            <nav className="flex items-center gap-1 overflow-x-auto">
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors hover:bg-green-50"
                  style={{ color: 'var(--footers-gray)' }}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 flex-shrink-0">
              {role === 'admin' ? (
                <Link
                  href="/admin/members"
                  className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium"
                >
                  운영진
                </Link>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                  일반
                </span>
              )}
              <span className="text-sm font-medium hidden sm:inline" style={{ color: 'var(--footers-dark)' }}>
                {nickname}
              </span>
              <button
                onClick={logout}
                className="text-xs px-3 py-1.5 rounded-lg border"
                style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
              style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-white footers-gradient"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
