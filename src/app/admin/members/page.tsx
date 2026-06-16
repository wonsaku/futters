'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import SoccerBall from '@/components/SoccerBall'
import { Users, ClipboardList, PartyPopper } from 'lucide-react'

type Member = {
  id: string
  nickname: string
  username: string | null
  role: 'admin' | 'member'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

type Tab = 'pending' | 'approved' | 'rejected'

export default function AdminMembersPage() {
  const supabase = createClient()
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [tab, setTab] = useState<Tab>('pending')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('id, nickname, username, role, status, created_at')
      .order('created_at', { ascending: false })
    setMembers(data ?? [])
    setLoading(false)
  }

  const updateMember = async (id: string, updates: Partial<Pick<Member, 'status' | 'role'>>) => {
    setActionLoading(id + JSON.stringify(updates))
    await supabase.from('profiles').update(updates).eq('id', id)
    await fetchMembers()
    setActionLoading(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filtered = members.filter((m) => m.status === tab)
  const pendingCount = members.filter((m) => m.status === 'pending').length

  const tabLabel: Record<Tab, string> = {
    pending: '대기 중',
    approved: '승인됨',
    rejected: '거절됨',
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen" style={{ background: 'var(--footers-light)' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-lg flex items-center gap-1.5" style={{ color: 'var(--footers-green)' }}>
            <SoccerBall size={18} /> Footers
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">운영진</span>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded-lg border transition-colors"
              style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--footers-dark)' }}>회원 관리</h1>
          <p className="text-sm" style={{ color: 'var(--footers-gray)' }}>
            가입 신청을 승인하거나 거절하고, 역할을 변경할 수 있어요
          </p>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          {(['pending', 'approved', 'rejected'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={
                tab === t
                  ? { background: 'var(--footers-green)', color: 'white' }
                  : { background: 'white', border: '1px solid #E5E7EB', color: 'var(--footers-gray)' }
              }
            >
              {tabLabel[t]}
              {t === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold bg-red-500 text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 목록 */}
        {loading ? (
          <div className="text-center py-16 text-sm" style={{ color: 'var(--footers-gray)' }}>불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div className="footers-card p-12 text-center">
            <div className="mb-3 flex justify-center" style={{ color: 'var(--footers-green)' }}>
              {tab === 'pending' ? <PartyPopper size={40} strokeWidth={1.5} /> : tab === 'approved' ? <Users size={40} strokeWidth={1.5} /> : <ClipboardList size={40} strokeWidth={1.5} />}
            </div>
            <p className="text-sm" style={{ color: 'var(--footers-gray)' }}>
              {tab === 'pending' ? '대기 중인 신청이 없어요' : tab === 'approved' ? '승인된 회원이 없어요' : '거절된 신청이 없어요'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((member) => (
              <div key={member.id} className="footers-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* 아바타 */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'var(--footers-green)' }}
                  >
                    {member.nickname[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: 'var(--footers-dark)' }}>
                        {member.nickname}
                      </span>
                      {member.username && (
                        <span className="text-xs" style={{ color: 'var(--footers-gray)' }}>
                          @{member.username}
                        </span>
                      )}
                      {member.role === 'admin' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                          운영진
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--footers-gray)' }}>
                      신청일: {formatDate(member.created_at)}
                    </p>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-shrink-0">
                  {tab === 'pending' && (
                    <>
                      <button
                        onClick={() => updateMember(member.id, { status: 'approved' })}
                        disabled={!!actionLoading}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                        style={{ background: 'var(--footers-green)' }}
                      >
                        승인
                      </button>
                      <button
                        onClick={() => updateMember(member.id, { status: 'rejected' })}
                        disabled={!!actionLoading}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white disabled:opacity-50"
                      >
                        거절
                      </button>
                    </>
                  )}

                  {tab === 'approved' && (
                    <>
                      <button
                        onClick={() =>
                          updateMember(member.id, { role: member.role === 'admin' ? 'member' : 'admin' })
                        }
                        disabled={!!actionLoading}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-50"
                        style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
                      >
                        {member.role === 'admin' ? '일반으로 변경' : '운영진으로 변경'}
                      </button>
                      <button
                        onClick={() => updateMember(member.id, { status: 'rejected' })}
                        disabled={!!actionLoading}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-200 disabled:opacity-50"
                      >
                        차단
                      </button>
                    </>
                  )}

                  {tab === 'rejected' && (
                    <button
                      onClick={() => updateMember(member.id, { status: 'approved' })}
                      disabled={!!actionLoading}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                      style={{ background: 'var(--footers-green)' }}
                    >
                      재승인
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
