import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function PhotosPage() {
  const supabase = await createClient()

  const { data: photos } = await supabase
    .from('team_photos')
    .select('id, title, description, image_urls, created_at, author:profiles(nickname)')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black" style={{ color: 'var(--footers-dark)' }}>📸 팀 사진</h1>
        <Link
          href="/photos/new"
          className="text-sm font-semibold px-4 py-2 rounded-xl text-white"
          style={{ background: 'var(--footers-green)' }}
        >
          + 사진 올리기
        </Link>
      </div>

      {!photos?.length ? (
        <div className="footers-card p-12 text-center">
          <div className="text-4xl mb-3">📷</div>
          <p className="text-sm" style={{ color: 'var(--footers-gray)' }}>아직 올라온 사진이 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {photos.map((photo) => {
            const thumb = photo.image_urls?.[0]
            const author = photo.author as unknown as { nickname: string } | null
            const date = new Date(photo.created_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
            return (
              <Link
                key={photo.id}
                href={`/photos/${photo.id}`}
                className="flex gap-4 py-4 group hover:bg-gray-50 rounded-2xl px-3 -mx-3 transition-colors"
              >
                {/* 썸네일 */}
                <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 relative">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">📷</div>
                  )}
                  {photo.image_urls.length > 1 && (
                    <span className="absolute top-1.5 right-1.5 text-xs px-1.5 py-0.5 rounded-md bg-black/50 text-white font-medium">
                      +{photo.image_urls.length - 1}
                    </span>
                  )}
                </div>

                {/* 텍스트 */}
                <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
                  <div>
                    <p className="font-semibold text-sm leading-snug mb-1 group-hover:underline" style={{ color: 'var(--footers-dark)' }}>
                      {photo.title}
                    </p>
                    {photo.description && (
                      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--footers-gray)' }}>
                        {photo.description}
                      </p>
                    )}
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--footers-gray)' }}>
                    {author?.nickname} · {date}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
