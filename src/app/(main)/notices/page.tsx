import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function NoticesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: notices }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user!.id).single(),
    supabase
      .from('notices')
      .select('id, title, created_at, author:profiles(nickname)')
      .order('created_at', { ascending: false }),
  ])

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black" style={{ color: 'var(--footers-dark)' }}>📢 공지사항</h1>
        {profile?.role === 'admin' && (
          <Link
            href="/notices/new"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white"
            style={{ background: 'var(--footers-green)' }}
          >
            + 공지 작성
          </Link>
        )}
      </div>

      {!notices?.length ? (
        <div className="footers-card p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm" style={{ color: 'var(--footers-gray)' }}>아직 공지사항이 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notices.map((notice) => {
            const author = notice.author as unknown as { nickname: string } | null
            return (
              <Link
                key={notice.id}
                href={`/notices/${notice.id}`}
                className="footers-card p-5 flex items-center justify-between gap-4 hover:shadow-md transition-shadow group"
              >
                <div>
                  <p className="font-semibold text-sm group-hover:underline" style={{ color: 'var(--footers-dark)' }}>
                    {notice.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--footers-gray)' }}>
                    {author?.nickname ?? '운영진'} · {new Date(notice.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
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
