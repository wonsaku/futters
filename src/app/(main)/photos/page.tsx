import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function PhotosPage() {
  const supabase = await createClient()

  const { data: photos } = await supabase
    .from('team_photos')
    .select('id, title, image_urls, created_at, author:profiles(nickname)')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo) => {
            const thumb = photo.image_urls?.[0]
            const author = photo.author as unknown as { nickname: string } | null
            return (
              <Link key={photo.id} href={`/photos/${photo.id}`} className="group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-2 relative">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📷</div>
                  )}
                  {photo.image_urls.length > 1 && (
                    <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-md bg-black/50 text-white">
                      +{photo.image_urls.length - 1}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--footers-dark)' }}>
                  {photo.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--footers-gray)' }}>
                  {author?.nickname} · {new Date(photo.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
