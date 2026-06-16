import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NoticeForm from '../NoticeForm'

export default async function NewNoticePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/notices')

  return <NoticeForm authorId={user.id} />
}
