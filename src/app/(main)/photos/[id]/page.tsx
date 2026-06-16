'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import DeleteButton from '@/components/DeleteButton'

type Photo = {
  id: string
  title: string
  description: string | null
  image_urls: string[]
  author_id: string | null
  created_at: string
  author: { nickname: string } | null
}

export default function PhotoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setCurrentUserId(user.id)

      const [{ data: profile }, { data: photo }] = await Promise.all([
        supabase.from('profiles').select('role').eq('id', user.id).single(),
        supabase
          .from('team_photos')
          .select('id, title, description, image_urls, author_id, created_at, author:profiles(nickname)')
          .eq('id', id)
          .single(),
      ])

      if (!photo) { router.push('/photos'); return }
      setPhoto(photo as unknown as Photo)
      setIsAdmin(profile?.role === 'admin')
    }
    load()
  }, [id])

  if (!photo) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p style={{ color: 'var(--footers-gray)' }}>불러오는 중...</p>
      </main>
    )
  }

  const canEdit = isAdmin || photo.author_id === currentUserId
  const images = photo.image_urls ?? []

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <Link href="/photos" className="text-sm mb-3 inline-block" style={{ color: 'var(--footers-gray)' }}>
            ← 목록으로
          </Link>
          <h1 className="text-2xl font-black leading-tight" style={{ color: 'var(--footers-dark)' }}>
            {photo.title}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--footers-gray)' }}>
            {photo.author?.nickname} · {new Date(photo.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-2 flex-shrink-0 mt-6">
            <Link
              href={`/photos/${id}/edit`}
              className="px-3 py-1.5 rounded-lg text-sm border font-medium hover:bg-gray-50"
              style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
            >
              수정
            </Link>
            <DeleteButton table="team_photos" id={id} redirectTo="/photos" imageUrls={images} />
          </div>
        )}
      </div>

      {/* 이미지 */}
      {images.length > 0 && (
        <div className="mb-6">
          <div className="rounded-2xl overflow-hidden bg-gray-100 mb-3" style={{ aspectRatio: '4/3' }}>
            <img src={images[imgIdx]} alt={photo.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((url, idx) => (
                <button
                  key={url}
                  onClick={() => setImgIdx(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${imgIdx === idx ? 'border-green-500' : 'border-transparent'}`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {photo.description && (
        <div className="footers-card p-5">
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--footers-dark)' }}>
            {photo.description}
          </p>
        </div>
      )}
    </main>
  )
}
