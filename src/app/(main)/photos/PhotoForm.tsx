'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/ImageUploader'
import { uploadImages, deleteImages } from '@/lib/storage'

type Initial = { id: string; title: string; description: string | null; image_urls: string[] }

export default function PhotoForm({ authorId, initial }: { authorId: string; initial?: Initial }) {
  const router = useRouter()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [removedUrls, setRemovedUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const existingUrls = initial?.image_urls ?? []

  const handleFilesChange = (files: File[], removed: string[]) => {
    setNewFiles(files)
    setRemovedUrls(removed)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const keptUrls = existingUrls.filter((u) => !removedUrls.includes(u))
    if (!title.trim()) { setError('제목을 입력해주세요.'); return }
    if (!initial && newFiles.length === 0) { setError('사진을 1장 이상 올려주세요.'); return }
    setError('')
    setLoading(true)

    const supabase = createClient()

    // 새 이미지 업로드
    const uploadedUrls = await uploadImages(supabase, newFiles, authorId)
    // 삭제된 이미지 제거
    if (removedUrls.length) await deleteImages(supabase, removedUrls)

    const imageUrls = [...keptUrls, ...uploadedUrls]

    if (initial) {
      const { error: err } = await supabase
        .from('team_photos')
        .update({ title: title.trim(), description: description.trim() || null, image_urls: imageUrls, updated_at: new Date().toISOString() })
        .eq('id', initial.id)
      if (err) { setError('수정 중 오류가 발생했어요.'); setLoading(false); return }
      router.push(`/photos/${initial.id}`)
    } else {
      const { data, error: err } = await supabase
        .from('team_photos')
        .insert({ title: title.trim(), description: description.trim() || null, image_urls: imageUrls, author_id: authorId })
        .select('id')
        .single()
      if (err) { setError('저장 중 오류가 발생했어요.'); setLoading(false); return }
      router.push(`/photos/${data.id}`)
    }
    router.refresh()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-black mb-6" style={{ color: 'var(--footers-dark)' }}>
        {initial ? '사진 수정' : '사진 올리기'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--footers-dark)' }}>사진</label>
          <ImageUploader existingUrls={existingUrls} onFilesChange={handleFilesChange} maxImages={10} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>제목</label>
          <input
            type="text"
            className="footers-input"
            placeholder="예: 2026년 1월 정기 경기"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--footers-dark)' }}>
            설명 <span className="font-normal text-xs" style={{ color: 'var(--footers-gray)' }}>(선택)</span>
          </label>
          <textarea
            className="footers-input resize-none"
            rows={4}
            placeholder="경기 후기나 사진에 대한 설명을 적어주세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            {loading ? '저장 중...' : (initial ? '수정 완료' : '사진 등록')}
          </button>
        </div>
      </form>
    </main>
  )
}
