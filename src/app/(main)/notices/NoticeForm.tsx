'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Initial = { id: string; title: string; content: string | null }

export default function NoticeForm({ authorId, initial }: { authorId: string; initial?: Initial }) {
  const router = useRouter()
  const supabase = createClient()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('제목을 입력해주세요.'); return }
    setError('')
    setLoading(true)

    if (initial) {
      const { error: err } = await supabase
        .from('notices')
        .update({ title: title.trim(), content: content.trim(), updated_at: new Date().toISOString() })
        .eq('id', initial.id)
      if (err) { setError('수정 중 오류가 발생했어요.'); setLoading(false); return }
      router.push(`/notices/${initial.id}`)
    } else {
      const { data, error: err } = await supabase
        .from('notices')
        .insert({ title: title.trim(), content: content.trim(), author_id: authorId })
        .select('id')
        .single()
      if (err) { setError('저장 중 오류가 발생했어요.'); setLoading(false); return }
      router.push(`/notices/${data.id}`)
    }
    router.refresh()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-black mb-6" style={{ color: 'var(--footers-dark)' }}>
        {initial ? '공지 수정' : '공지 작성'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>제목</label>
          <input
            type="text"
            className="footers-input"
            placeholder="공지 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>내용</label>
          <textarea
            className="footers-input resize-none"
            rows={10}
            placeholder="공지 내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
            {loading ? '저장 중...' : (initial ? '수정 완료' : '공지 등록')}
          </button>
        </div>
      </form>
    </main>
  )
}
