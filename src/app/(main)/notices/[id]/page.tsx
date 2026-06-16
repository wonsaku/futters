import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: notice }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase
      .from('notices')
      .select('id, title, content, created_at, updated_at, author:profiles(nickname)')
      .eq('id', id)
      .single(),
  ])

  if (!notice) notFound()

  const isAdmin = profile?.role === 'admin'
  const author = notice.author as unknown as { nickname: string } | null

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* 상단 */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <Link href="/notices" className="text-sm mb-3 inline-block" style={{ color: 'var(--footers-gray)' }}>
            ← 목록으로
          </Link>
          <h1 className="text-2xl font-black leading-tight" style={{ color: 'var(--footers-dark)' }}>
            {notice.title}
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--footers-gray)' }}>
            {author?.nickname ?? '운영진'} ·{' '}
            {new Date(notice.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            {notice.updated_at !== notice.created_at && ' (수정됨)'}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2 flex-shrink-0 mt-6">
            <Link
              href={`/notices/${id}/edit`}
              className="px-3 py-1.5 rounded-lg text-sm border font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
            >
              수정
            </Link>
            <DeleteButton table="notices" id={id} redirectTo="/notices" />
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="footers-card p-6">
        {notice.content ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--footers-dark)' }}>
            {notice.content}
          </p>
        ) : (
          <p className="text-sm" style={{ color: 'var(--footers-gray)' }}>내용이 없어요.</p>
        )}
      </div>
    </main>
  )
}
