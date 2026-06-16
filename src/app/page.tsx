import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import HomeHeader from '@/components/HomeHeader'
import SoccerBall from '@/components/SoccerBall'
import { Camera, ClipboardList, Megaphone, MessageCircle, Lock, Inbox, Heart, type LucideIcon } from 'lucide-react'

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

      {/* ── 히어로 (축구장 잔디) ── */}
      <section className="relative overflow-hidden" style={{ background: '#14532D', minHeight: '480px' }}>

        {/* 잔디 줄무늬 */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 60px, transparent 60px, transparent 120px)',
        }} />

        {/* 필드 라인 SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {/* 외곽선 */}
          <rect x="40" y="30" width="720" height="420" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" rx="2"/>
          {/* 센터라인 */}
          <line x1="400" y1="30" x2="400" y2="450" stroke="rgba(255,255,255,0.15)" strokeWidth="2"/>
          {/* 센터서클 */}
          <circle cx="400" cy="240" r="70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2"/>
          {/* 센터 점 */}
          <circle cx="400" cy="240" r="4" fill="rgba(255,255,255,0.2)"/>
          {/* 왼쪽 페널티 박스 */}
          <rect x="40" y="140" width="120" height="200" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
          {/* 오른쪽 페널티 박스 */}
          <rect x="640" y="140" width="120" height="200" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
          {/* 왼쪽 골박스 */}
          <rect x="40" y="190" width="55" height="100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
          {/* 오른쪽 골박스 */}
          <rect x="705" y="190" width="55" height="100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
          {/* 코너 아크 */}
          <path d="M40,30 Q60,30 60,50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
          <path d="M760,30 Q740,30 740,50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
          <path d="M40,450 Q60,450 60,430" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
          <path d="M760,450 Q740,450 740,430" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
        </svg>

        {/* 콘텐츠 */}
        <div className="relative z-10 max-w-xl mx-auto px-4 py-20 text-center text-white">
          <div className="mb-6 float-animation inline-block drop-shadow-2xl">
            <SoccerBall size={88} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight tracking-tight drop-shadow-md">
            풋살 경기,<br />이제 제대로 기록하자
          </h1>
          <p className="text-base sm:text-lg mb-10 drop-shadow" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Footers로 팀 경기도 기록하고 추억을 남기세요
          </p>

          {isLoggedIn ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {FEATURES.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all flex items-center gap-1.5 hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}
                >
                  <f.Icon size={14} /> {f.title}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-block px-8 py-3 rounded-full font-bold text-base transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.6)', color: 'white', backdropFilter: 'blur(4px)' }}
            >
              로그인
            </Link>
          )}
        </div>

        {/* 하단 잔디 경계 */}
        <div className="absolute bottom-0 left-0 right-0 h-12" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.2))',
        }}/>
      </section>

      {/* ── 특징 ── */}
      <section className="py-14 sm:py-18 px-4" style={{ background: '#F0FDF4' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ background: '#DCFCE7', color: 'var(--footers-green)' }}>
              FEATURES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--footers-dark)' }}>
              Footers는 다음의 기능을 제공해요
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURES.map((f) => {
              const card = (
                <div className="group bg-white rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1 border border-green-100 h-full">
                  <div className="mb-3 flex justify-center transition-transform group-hover:scale-110" style={{ color: 'var(--footers-green)' }}>
                    <f.Icon size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: 'var(--footers-dark)' }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--footers-gray)' }}>{f.desc}</p>
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

      {/* ── 최근 공지사항 ── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2" style={{ color: 'var(--footers-dark)' }}>
              <Megaphone size={22} style={{ color: 'var(--footers-green)' }} /> 최근 공지사항
            </h2>
            {isLoggedIn && (
              <Link href="/notices" className="text-sm font-semibold" style={{ color: 'var(--footers-green)' }}>
                전체 보기 →
              </Link>
            )}
          </div>

          {!isLoggedIn ? (
            <div className="rounded-2xl p-10 text-center border border-green-100" style={{ background: '#F0FDF4' }}>
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
                    className="footers-card px-5 py-4 flex items-center justify-between gap-4 hover:shadow-md transition-all hover:-translate-y-px group"
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

      {/* ── 후원하기 (잔디 느낌) ── */}
      <section className="py-14 px-4 relative overflow-hidden" style={{ background: '#14532D' }}>
        {/* 잔디 줄무늬 */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 40px, transparent 40px, transparent 80px)',
        }} />
        {/* 필드 라인 장식 */}
        <svg className="absolute right-0 top-0 h-full opacity-10" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="300" cy="100" r="80" fill="none" stroke="white" strokeWidth="2"/>
          <circle cx="300" cy="100" r="5" fill="white"/>
        </svg>
        <div className="relative z-10 max-w-xl mx-auto text-center text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Heart size={28} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3">팀을 후원해주세요</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.75)' }}>
            여러분의 후원이 Footers 팀의 경기 장비와 운영을 지원해요
          </p>
          {isLoggedIn ? (
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'white', color: 'var(--footers-dark)' }}
            >
              <Heart size={15} />
              후원하기
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'white', color: 'var(--footers-dark)' }}
            >
              로그인 후 후원하기
            </Link>
          )}
        </div>
      </section>

      <footer className="py-6 text-center text-sm border-t border-gray-100" style={{ color: 'var(--footers-gray)' }}>
        © 2026 Footers — 풋살 경기 기록 서비스
      </footer>
    </div>
  )
}
