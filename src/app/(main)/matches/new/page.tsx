import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MatchForm from '../MatchForm'

export default async function NewMatchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <MatchForm authorId={user.id} />
}
