import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NoticeForm from '../../NoticeForm'

export default async function EditNoticePage({
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
    supabase.from('notices').select('id, title, content').eq('id', id).single(),
  ])

  if (profile?.role !== 'admin') redirect(`/notices/${id}`)
  if (!notice) notFound()

  return <NoticeForm authorId={user.id} initial={notice} />
}
