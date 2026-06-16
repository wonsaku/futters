import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MainHeader from '@/components/MainHeader'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, nickname, username, role, status')
    .eq('id', user.id)
    .single()

  if (!profile || profile.status !== 'approved') redirect('/pending')

  return (
    <div className="min-h-screen" style={{ background: 'var(--footers-light)' }}>
      <MainHeader profile={profile} />
      {children}
    </div>
  )
}
