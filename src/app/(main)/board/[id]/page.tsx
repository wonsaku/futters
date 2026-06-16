import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
import CommentSection from '@/components/CommentSection'

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: post }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase
      .from('posts')
      .select('id, title, content, created_at, updated_at, author_id, author:profiles(nickname)')
      .eq('id', id)
      .single(),
  ])

  if (!post) notFound()

  const isAdmin = profile?.role === 'admin'
  const isOwner = post.author_id === user.id
  const author = post.author as unknown as { nickname: string } | null

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/board" className="text-sm mb-2 inline-block" style={{ color: 'var(--footers-gray)' }}>
          ← 목록으로
        </Link>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-black leading-tight" style={{ color: 'var(--footers-dark)' }}>
            {post.title}
          </h1>
          {(isOwner || isAdmin) && (
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={`/board/${id}/edit`}
                className="px-3 py-1.5 rounded-lg text-sm border font-medium transition-colors hover:bg-gray-50"
                style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
              >
                수정
              </Link>
              <DeleteButton table="posts" id={id} redirectTo="/board" />
            </div>
          )}
        </div>
        <p className="text-sm mt-2" style={{ color: 'var(--footers-gray)' }}>
          {author?.nickname ?? '익명'} ·{' '}
          {new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          {post.updated_at !== post.created_at && ' (수정됨)'}
        </p>
      </div>

      <div className="footers-card p-6">
        {post.content ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--footers-dark)' }}>
            {post.content}
          </p>
        ) : (
          <p className="text-sm" style={{ color: 'var(--footers-gray)' }}>내용이 없어요.</p>
        )}
      </div>

      <CommentSection contentType="post" contentId={id} />
    </main>
  )
}
