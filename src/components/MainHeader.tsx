'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  nickname: string
  username: string | null
  role: 'admin' | 'member'
}

const NAV = [
  { href: '/notices', label: '📢 공지사항' },
  { href: '/matches', label: '📋 경기 기록' },
  { href: '/photos', label: '📸 팀 사진' },
  { href: '/board', label: '💬 자유게시판' },
]

export default function MainHeader({ profile }: { profile: Profile }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="font-black text-lg flex-shrink-0 tracking-tight" style={{ color: 'var(--footers-green)' }}>
          ⚽ Footers
        </Link>

        <nav className="flex items-center gap-1 flex-1 overflow-x-auto">
          {NAV.map(({ href, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className="text-sm px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors"
                style={{
                  background: active ? 'var(--footers-warm)' : 'transparent',
                  color: active ? 'var(--footers-green)' : 'var(--footers-gray)',
                  fontWeight: active ? 700 : 500,
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 flex-shrink-0">
          {profile.role === 'admin' ? (
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
            {profile.nickname}
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
    </header>
  )
}
