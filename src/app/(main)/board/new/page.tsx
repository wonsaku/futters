import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PostForm from '../PostForm'

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <PostForm authorId={user.id} />
}
