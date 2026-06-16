import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PhotoForm from '../../PhotoForm'

export default async function EditPhotoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: photo }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase.from('team_photos').select('id, title, description, image_urls, author_id').eq('id', id).single(),
  ])

  if (!photo) notFound()

  const canEdit = profile?.role === 'admin' || photo.author_id === user.id
  if (!canEdit) redirect(`/photos/${id}`)

  return <PhotoForm authorId={user.id} initial={photo} />
}
