import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MatchForm from '../../MatchForm'

export default async function EditMatchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: match }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase
      .from('matches')
      .select('id, match_date, opponent, our_score, opponent_score, location, notes, author_id')
      .eq('id', id)
      .single(),
  ])

  if (!match) notFound()

  const canEdit = profile?.role === 'admin' || match.author_id === user.id
  if (!canEdit) redirect(`/matches/${id}`)

  return <MatchForm authorId={user.id} initial={match} />
}
