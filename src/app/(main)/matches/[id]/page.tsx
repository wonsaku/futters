import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'

const RESULT = {
  win:  { label: '승리 🎉', bg: '#DCFCE7', color: '#16A34A', border: '#86EFAC' },
  loss: { label: '패배 😢', bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5' },
  draw: { label: '무승부', bg: '#F3F4F6', color: '#6B7280', border: '#D1D5DB' },
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: match }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase
      .from('matches')
      .select('id, match_date, opponent, our_score, opponent_score, location, notes, author_id, created_at, author:profiles(nickname)')
      .eq('id', id)
      .single(),
  ])

  if (!match) notFound()

  const isAdmin = profile?.role === 'admin'
  const canEdit = isAdmin || match.author_id === user.id
  const result = match.our_score > match.opponent_score ? 'win' : match.our_score < match.opponent_score ? 'loss' : 'draw'
  const r = RESULT[result]
  const author = match.author as unknown as { nickname: string } | null

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <Link href="/matches" className="text-sm mb-3 inline-block" style={{ color: 'var(--footers-gray)' }}>
            ← 목록으로
          </Link>
          <h1 className="text-2xl font-black" style={{ color: 'var(--footers-dark)' }}>
            vs {match.opponent}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--footers-gray)' }}>
            {new Date(match.match_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            {match.location && ` · ${match.location}`}
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-2 flex-shrink-0 mt-6">
            <Link
              href={`/matches/${id}/edit`}
              className="px-3 py-1.5 rounded-lg text-sm border font-medium hover:bg-gray-50"
              style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
            >
              수정
            </Link>
            <DeleteButton table="matches" id={id} redirectTo="/matches" />
          </div>
        )}
      </div>

      {/* 결과 카드 */}
      <div
        className="rounded-2xl p-8 text-center mb-6 border"
        style={{ background: r.bg, borderColor: r.border }}
      >
        <p className="text-sm font-semibold mb-3" style={{ color: r.color }}>{r.label}</p>
        <div className="flex items-center justify-center gap-6">
          <div>
            <p className="text-xs mb-1 font-medium" style={{ color: r.color }}>우리팀</p>
            <p className="text-5xl font-black" style={{ color: r.color }}>{match.our_score}</p>
          </div>
          <p className="text-3xl font-black" style={{ color: r.color }}>:</p>
          <div>
            <p className="text-xs mb-1 font-medium" style={{ color: r.color }}>{match.opponent}</p>
            <p className="text-5xl font-black" style={{ color: r.color }}>{match.opponent_score}</p>
          </div>
        </div>
      </div>

      {match.notes && (
        <div className="footers-card p-5">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--footers-gray)' }}>메모</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--footers-dark)' }}>
            {match.notes}
          </p>
        </div>
      )}

      <p className="text-xs mt-4 text-center" style={{ color: 'var(--footers-gray)' }}>
        기록자: {author?.nickname}
      </p>
    </main>
  )
}
