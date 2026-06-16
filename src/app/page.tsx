import Link from 'next/link'

const FEATURES = [
  { emoji: '📋', title: '경기 기록', desc: '팀별 경기 결과와 스코어를 손쉽게 기록하세요.' },
  { emoji: '👥', title: '팀 관리', desc: '팀원과 포지션을 체계적으로 관리할 수 있어요.' },
  { emoji: '📊', title: '통계 분석', desc: '골, 어시스트, 승률 등 다양한 통계를 확인하세요.' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-black text-xl tracking-tight" style={{ color: 'var(--futters-green)' }}>
            ⚽ Futters
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
              style={{ borderColor: '#D1D5DB', color: 'var(--futters-gray)' }}
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-white futters-gradient"
            >
              회원가입
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="futters-gradient py-24 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-10 bg-white" />
        <div className="relative max-w-xl mx-auto">
          <div className="text-7xl mb-6 float-animation inline-block">⚽</div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
            풋살 경기,<br />이제 제대로 기록하자
          </h1>
          <p className="text-base sm:text-lg opacity-85 mb-10">
            Futters로 팀 경기를 기록하고 통계를 분석하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white rounded-full font-bold text-base transition-transform hover:scale-105 shadow-md"
              style={{ color: 'var(--futters-green)' }}
            >
              무료로 시작하기
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border-2 border-white rounded-full font-bold text-base text-white hover:bg-white/10 transition-colors"
            >
              로그인
            </Link>
          </div>
        </div>
      </section>

      {/* 특징 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-black mb-10" style={{ color: 'var(--futters-dark)' }}>
            Futters로 할 수 있는 것들
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="futters-card p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--futters-dark)' }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--futters-gray)' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ background: 'var(--futters-light)' }}>
        <div className="max-w-sm mx-auto">
          <div className="text-4xl mb-3">⚽</div>
          <h2 className="text-xl font-black mb-2" style={{ color: 'var(--futters-dark)' }}>
            지금 팀을 만들어보세요
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--futters-gray)' }}>
            무료로 시작하고 팀원들과 함께 기록해보세요
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-3 rounded-full font-bold text-white futters-gradient transition-opacity hover:opacity-90 shadow-md"
          >
            무료 회원가입
          </Link>
        </div>
      </section>

      <footer className="py-6 text-center text-sm border-t border-gray-100" style={{ color: 'var(--futters-gray)' }}>
        © 2026 Futters — 풋살 경기 기록 서비스
      </footer>
    </div>
  )
}
