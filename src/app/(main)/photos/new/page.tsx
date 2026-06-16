import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PhotoForm from '../PhotoForm'

export default async function NewPhotoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <PhotoForm authorId={user.id} />
}
