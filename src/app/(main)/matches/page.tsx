import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const RESULT = {
  win:  { label: '승', bg: '#DCFCE7', color: '#16A34A' },
  loss: { label: '패', bg: '#FEE2E2', color: '#DC2626' },
  draw: { label: '무', bg: '#F3F4F6', color: '#6B7280' },
}

export default async function MatchesPage() {
  const supabase = await createClient()

  const { data: matches } = await supabase
    .from('matches')
    .select('id, match_date, opponent, our_score, opponent_score, location, author:profiles(nickname)')
    .order('match_date', { ascending: false })

  const stats = matches?.reduce(
    (acc, m) => {
      if (m.our_score > m.opponent_score) acc.win++
      else if (m.our_score < m.opponent_score) acc.loss++
      else acc.draw++
      return acc
    },
    { win: 0, loss: 0, draw: 0 }
  ) ?? { win: 0, loss: 0, draw: 0 }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black" style={{ color: 'var(--footers-dark)' }}>📋 경기 기록</h1>
        <Link
          href="/matches/new"
          className="text-sm font-semibold px-4 py-2 rounded-xl text-white"
          style={{ background: 'var(--footers-green)' }}
        >
          + 경기 등록
        </Link>
      </div>

      {/* 전체 전적 */}
      {matches && matches.length > 0 && (
        <div className="footers-card p-5 mb-6 flex items-center justify-around text-center">
          <div>
            <p className="text-2xl font-black" style={{ color: '#16A34A' }}>{stats.win}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: 'var(--footers-gray)' }}>승</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div>
            <p className="text-2xl font-black" style={{ color: '#6B7280' }}>{stats.draw}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: 'var(--footers-gray)' }}>무</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div>
            <p className="text-2xl font-black" style={{ color: '#DC2626' }}>{stats.loss}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: 'var(--footers-gray)' }}>패</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div>
            <p className="text-2xl font-black" style={{ color: 'var(--footers-dark)' }}>{matches.length}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: 'var(--footers-gray)' }}>전체</p>
          </div>
        </div>
      )}

      {!matches?.length ? (
        <div className="footers-card p-12 text-center">
          <div className="text-4xl mb-3">⚽</div>
          <p className="text-sm" style={{ color: 'var(--footers-gray)' }}>아직 등록된 경기가 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => {
            const result = match.our_score > match.opponent_score ? 'win' : match.our_score < match.opponent_score ? 'loss' : 'draw'
            const r = RESULT[result]
            return (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="footers-card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: r.bg, color: r.color }}
                >
                  {r.label}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base" style={{ color: 'var(--footers-dark)' }}>
                      {match.our_score} : {match.opponent_score}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--footers-gray)' }}>
                      vs {match.opponent}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--footers-gray)' }}>
                    {new Date(match.match_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {match.location && ` · ${match.location}`}
                  </p>
                </div>
                <span className="text-gray-300 flex-shrink-0">›</span>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
