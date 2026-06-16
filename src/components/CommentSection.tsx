'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageCircle } from 'lucide-react'

type Comment = {
  id: string
  body: string
  created_at: string
  author_id: string
  author: { nickname: string } | null
}

type Props = {
  contentType: 'notice' | 'photo' | 'match' | 'post'
  contentId: string
}

export default function CommentSection({ contentType, contentId }: Props) {
  const supabase = createClient()
  const [comments, setComments] = useState<Comment[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState('')

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUserId(user.id)
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setIsAdmin(profile?.role === 'admin')
    }
    const { data } = await supabase
      .from('comments')
      .select('id, body, created_at, author_id, author:profiles(nickname)')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .order('created_at', { ascending: true })
    setComments(
      (data ?? []).map((c) => ({
        ...c,
        author: Array.isArray(c.author) ? (c.author[0] ?? null) : c.author,
      }))
    )
  }, [contentType, contentId])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim() || !currentUserId) return
    setSubmitting(true)
    await supabase.from('comments').insert({
      content_type: contentType,
      content_id: contentId,
      body: body.trim(),
      author_id: currentUserId,
    })
    setBody('')
    setSubmitting(false)
    load()
  }

  const handleEdit = async (id: string) => {
    if (!editBody.trim()) return
    await supabase
      .from('comments')
      .update({ body: editBody.trim(), updated_at: new Date().toISOString() })
      .eq('id', id)
    setEditingId(null)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('댓글을 삭제할까요?')) return
    await supabase.from('comments').delete().eq('id', id)
    load()
  }

  return (
    <div className="mt-8">
      <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--footers-dark)' }}>
        <MessageCircle size={16} style={{ color: 'var(--footers-green)' }} />
        댓글
        {comments.length > 0 && (
          <span className="text-sm font-normal" style={{ color: 'var(--footers-gray)' }}>
            {comments.length}개
          </span>
        )}
      </h2>

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-2 mb-5">
        {comments.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: 'var(--footers-gray)' }}>
            첫 번째 댓글을 남겨보세요!
          </p>
        ) : (
          comments.map((comment) => {
            const canEdit = comment.author_id === currentUserId
            const canDelete = comment.author_id === currentUserId || isAdmin
            const isEditing = editingId === comment.id
            return (
              <div key={comment.id} className="footers-card px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-semibold flex-shrink-0" style={{ color: 'var(--footers-dark)' }}>
                      {comment.author?.nickname ?? '익명'}
                    </span>
                    <span className="text-xs truncate" style={{ color: 'var(--footers-gray)' }}>
                      {new Date(comment.created_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                      {' · '}
                      {new Date(comment.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {!isEditing && (canEdit || canDelete) && (
                    <div className="flex gap-1 flex-shrink-0">
                      {canEdit && (
                        <button
                          onClick={() => { setEditingId(comment.id); setEditBody(comment.body) }}
                          className="text-xs px-2 py-0.5 rounded border"
                          style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
                        >
                          수정
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-xs px-2 py-0.5 rounded border border-red-200 text-red-500"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="footers-input resize-none text-sm"
                      rows={3}
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs px-3 py-1.5 rounded-lg border"
                        style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleEdit(comment.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white"
                        style={{ background: 'var(--footers-green)' }}
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--footers-dark)' }}>
                    {comment.body}
                  </p>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* 댓글 입력 폼 */}
      {currentUserId && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            className="footers-input resize-none"
            rows={3}
            placeholder="댓글을 입력하세요"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !body.trim()}
              className="text-sm px-4 py-2 rounded-xl font-semibold text-white disabled:opacity-40 transition-opacity"
              style={{ background: 'var(--footers-green)' }}
            >
              {submitting ? '등록 중...' : '댓글 등록'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
