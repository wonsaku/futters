import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import HomeHeader from '@/components/HomeHeader'
import SoccerBall from '@/components/SoccerBall'
import { Camera, ClipboardList, Megaphone, MessageCircle, Lock, Inbox, type LucideIcon } from 'lucide-react'

const FEATURES: { Icon: LucideIcon; title: string; desc: string; href: string }[] = [
  { Icon: Camera, title: '팀 사진', desc: '경기 현장의 소중한 순간들을 팀원들과 함께 공유하세요.', href: '/photos' },
  { Icon: ClipboardList, title: '경기 기록', desc: '팀별 경기 결과와 스코어를 손쉽게 기록하세요.', href: '/matches' },
  { Icon: Megaphone, title: '공지사항', desc: '경기 일정, 장소, 준비물 등 팀 소식을 빠르게 전달해요.', href: '/notices' },
  { Icon: MessageCircle, title: '자유게시판', desc: '팀원들과 자유롭게 이야기를 나눠보세요.', href: '/board' },
]

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { nickname: string; role: string; status: string } | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('nickname, role, status')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const isLoggedIn = !!(user && profile?.status === 'approved')

  const { data: notices } = await supabase
    .from('notices')
    .select('id, title, created_at, author:profiles(nickname)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen flex flex-col">

      <HomeHeader
        isLoggedIn={isLoggedIn}
        nickname={profile?.nickname ?? null}
        role={profile?.role ?? null}
      />

      {/* 히어로 */}
      <section className="footers-gradient py-16 sm:py-24 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-10 bg-white" />
        <div className="relative max-w-xl mx-auto">
          <div className="mb-6 float-animation inline-block">
            <SoccerBall size={80} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
            풋살 경기,<br />이제 제대로 기록하자
          </h1>
          <p className="text-base sm:text-lg opacity-85 mb-10">
            Footers로 팀 경기도 기록하고 추억을 남기세요
          </p>

          {isLoggedIn ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {FEATURES.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="px-6 py-2.5 bg-white/20 hover:bg-white/30 border border-white/40 rounded-full font-semibold text-sm text-white transition-colors flex items-center gap-1.5"
                >
                  <f.Icon size={14} /> {f.title}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-8 py-3 border-2 border-white rounded-full font-bold text-base text-white hover:bg-white/10 transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </section>

      {/* 특징 */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-black mb-10" style={{ color: 'var(--footers-dark)' }}>
            Footers는 다음의 기능을 제공해요
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURES.map((f) => {
              const card = (
                <div className="footers-card p-6 text-center hover:shadow-md transition-shadow h-full">
                  <div className="mb-3 flex justify-center" style={{ color: 'var(--footers-green)' }}>
                    <f.Icon size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: 'var(--footers-dark)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--footers-gray)' }}>{f.desc}</p>
                </div>
              )
              return isLoggedIn ? (
                <Link key={f.title} href={f.href} className="block">
                  {card}
                </Link>
              ) : (
                <div key={f.title}>{card}</div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 최근 공지사항 */}
      <section className="py-16 px-4" style={{ background: 'var(--footers-light)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black flex items-center gap-2" style={{ color: 'var(--footers-dark)' }}>
              <Megaphone size={22} style={{ color: 'var(--footers-green)' }} /> 최근 공지사항
            </h2>
            {isLoggedIn && (
              <Link href="/notices" className="text-sm font-medium" style={{ color: 'var(--footers-green)' }}>
                전체 보기 →
              </Link>
            )}
          </div>

          {!isLoggedIn ? (
            <div className="footers-card p-10 text-center">
              <div className="mb-3 flex justify-center" style={{ color: 'var(--footers-green)' }}>
                <Lock size={40} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--footers-dark)' }}>로그인 후 확인할 수 있어요</p>
              <p className="text-xs mb-5" style={{ color: 'var(--footers-gray)' }}>공지사항은 팀원만 열람할 수 있어요</p>
              <Link
                href="/login"
                className="inline-block px-6 py-2 rounded-full text-sm font-semibold text-white"
                style={{ background: 'var(--footers-green)' }}
              >
                로그인하기
              </Link>
            </div>
          ) : !notices?.length ? (
            <div className="footers-card p-12 text-center">
              <div className="mb-3 flex justify-center" style={{ color: 'var(--footers-green)' }}>
                <Inbox size={40} strokeWidth={1.5} />
              </div>
              <p className="text-sm" style={{ color: 'var(--footers-gray)' }}>아직 공지사항이 없어요</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {notices.map((notice) => {
                const date = new Date(notice.created_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
                return (
                  <Link
                    key={notice.id}
                    href={`/notices/${notice.id}`}
                    className="footers-card px-5 py-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-semibold flex-shrink-0 w-20 text-center px-3 py-1 rounded-full"
                        style={{ background: 'var(--footers-warm)', color: 'var(--footers-green)' }}>
                        {date}
                      </span>
                      <p className="font-medium text-sm truncate group-hover:underline" style={{ color: 'var(--footers-dark)' }}>
                        {notice.title}
                      </p>
                    </div>
                    <span className="text-gray-300 flex-shrink-0">›</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <footer className="py-6 text-center text-sm border-t border-gray-100" style={{ color: 'var(--footers-gray)' }}>
        © 2026 Footers — 풋살 경기 기록 서비스
      </footer>
    </div>
  )
}
