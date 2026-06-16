'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Initial = {
  id: string
  match_date: string
  opponent: string
  location: string | null
  our_score: number
  opponent_score: number
  notes: string | null
}

export default function MatchForm({ authorId, initial }: { authorId: string; initial?: Initial }) {
  const router = useRouter()
  const supabase = createClient()
  const [date, setDate] = useState(initial?.match_date ?? new Date().toISOString().slice(0, 10))
  const [opponent, setOpponent] = useState(initial?.opponent ?? '')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [ourScore, setOurScore] = useState(String(initial?.our_score ?? 0))
  const [opponentScore, setOpponentScore] = useState(String(initial?.opponent_score ?? 0))
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!opponent.trim()) { setError('상대팀 이름을 입력해주세요.'); return }
    setError('')
    setLoading(true)

    const payload = {
      match_date: date,
      opponent: opponent.trim(),
      location: location.trim() || null,
      our_score: Number(ourScore),
      opponent_score: Number(opponentScore),
      notes: notes.trim() || null,
      updated_at: new Date().toISOString(),
    }

    if (initial) {
      const { error: err } = await supabase.from('matches').update(payload).eq('id', initial.id)
      if (err) { setError('수정 중 오류가 발생했어요.'); setLoading(false); return }
      router.push(`/matches/${initial.id}`)
    } else {
      const { data, error: err } = await supabase
        .from('matches')
        .insert({ ...payload, author_id: authorId })
        .select('id')
        .single()
      if (err) { setError('저장 중 오류가 발생했어요.'); setLoading(false); return }
      router.push(`/matches/${data.id}`)
    }
    router.refresh()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-black mb-6" style={{ color: 'var(--footers-dark)' }}>
        {initial ? '경기 기록 수정' : '경기 기록'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>경기 날짜</label>
            <input
              type="date"
              className="footers-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>상대팀</label>
            <input
              type="text"
              className="footers-input"
              placeholder="예: FC 한강"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>
            경기 장소 <span className="font-normal text-xs" style={{ color: 'var(--footers-gray)' }}>(선택)</span>
          </label>
          <input
            type="text"
            className="footers-input"
            placeholder="예: 마포 풋살장"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* 스코어 */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--footers-dark)' }}>스코어</label>
          <div className="footers-card p-4 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-xs mb-2 font-medium" style={{ color: 'var(--footers-gray)' }}>우리팀</p>
              <input
                type="number"
                min={0}
                max={99}
                className="w-16 text-center text-2xl font-black border-2 rounded-xl py-2 outline-none focus:border-green-400"
                style={{ borderColor: '#E5E7EB', color: 'var(--footers-dark)' }}
                value={ourScore}
                onChange={(e) => setOurScore(e.target.value)}
              />
            </div>
            <span className="text-2xl font-black" style={{ color: 'var(--footers-gray)' }}>:</span>
            <div className="text-center">
              <p className="text-xs mb-2 font-medium" style={{ color: 'var(--footers-gray)' }}>상대팀</p>
              <input
                type="number"
                min={0}
                max={99}
                className="w-16 text-center text-2xl font-black border-2 rounded-xl py-2 outline-none focus:border-green-400"
                style={{ borderColor: '#E5E7EB', color: 'var(--footers-dark)' }}
                value={opponentScore}
                onChange={(e) => setOpponentScore(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>
            메모 <span className="font-normal text-xs" style={{ color: 'var(--footers-gray)' }}>(선택)</span>
          </label>
          <textarea
            className="footers-input resize-none"
            rows={4}
            placeholder="경기 후기, 특이사항 등을 기록해보세요"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
            style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
          >
            취소
          </button>
          <button type="submit" className="flex-1 footers-btn-primary" disabled={loading}>
            {loading ? '저장 중...' : (initial ? '수정 완료' : '기록 등록')}
          </button>
        </div>
      </form>
    </main>
  )
}
