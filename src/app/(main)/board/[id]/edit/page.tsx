import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PostForm from '../../PostForm'

export default async function EditPostPage({
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
      .select('id, title, content, author_id')
      .eq('id', id)
      .single(),
  ])

  if (!post) notFound()

  const canEdit = profile?.role === 'admin' || post.author_id === user.id
  if (!canEdit) redirect(`/board/${id}`)

  return <PostForm authorId={user.id} initial={post} />
}
