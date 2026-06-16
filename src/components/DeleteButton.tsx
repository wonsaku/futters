'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { deleteImages } from '@/lib/storage'

type Props = {
  table: string
  id: string
  redirectTo: string
  imageUrls?: string[]
}

export default function DeleteButton({ table, id, redirectTo, imageUrls }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('정말 삭제할까요?')) return
    setLoading(true)
    const supabase = createClient()
    if (imageUrls?.length) await deleteImages(supabase, imageUrls)
    await supabase.from(table).delete().eq('id', id)
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 rounded-lg text-sm bg-red-50 text-red-600 border border-red-200 disabled:opacity-50 transition-colors hover:bg-red-100"
    >
      {loading ? '삭제 중...' : '삭제'}
    </button>
  )
}
