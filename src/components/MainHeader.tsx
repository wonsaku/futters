'use client'

import { useState } from 'react'
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
  const [open, setOpen] = useState(false)

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const RoleBadge = () =>
    profile.role === 'admin' ? (
      <Link href="/admin/members" className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
        운영진
      </Link>
    ) : (
      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">일반</span>
    )

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link href="/" className="font-black text-lg flex-shrink-0 tracking-tight" style={{ color: 'var(--footers-green)' }}>
          ⚽ Footers
        </Link>

        {/* 데스크탑 nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 overflow-x-auto">
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

        {/* 데스크탑 우측 */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0 ml-auto">
          <RoleBadge />
          <span className="text-sm font-medium" style={{ color: 'var(--footers-dark)' }}>
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

        {/* 모바일 우측 */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <RoleBadge />
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg"
            style={{ color: 'var(--footers-gray)' }}
            aria-label="메뉴"
          >
            {open ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {NAV.map(({ href, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
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
          <div className="border-t border-gray-100 mt-2 pt-2 flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--footers-dark)' }}>
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
      )}
    </header>
  )
}
