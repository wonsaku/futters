'use client'

import { useRef, useState } from 'react'

type Props = {
  existingUrls?: string[]
  onFilesChange: (newFiles: File[], removedUrls: string[]) => void
  maxImages?: number
}

export default function ImageUploader({ existingUrls = [], onFilesChange, maxImages = 10 }: Props) {
  const [kept, setKept] = useState<string[]>(existingUrls)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const total = kept.length + newFiles.length
  const canAdd = total < maxImages

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, maxImages - total)
    const previews = files.map((f) => URL.createObjectURL(f))
    const updatedFiles = [...newFiles, ...files]
    const updatedPreviews = [...newPreviews, ...previews]
    setNewFiles(updatedFiles)
    setNewPreviews(updatedPreviews)
    onFilesChange(updatedFiles, existingUrls.filter((u) => !kept.includes(u)))
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeKept = (url: string) => {
    const updated = kept.filter((u) => u !== url)
    setKept(updated)
    onFilesChange(newFiles, existingUrls.filter((u) => !updated.includes(u)))
  }

  const removeNew = (idx: number) => {
    URL.revokeObjectURL(newPreviews[idx])
    const updatedFiles = newFiles.filter((_, i) => i !== idx)
    const updatedPreviews = newPreviews.filter((_, i) => i !== idx)
    setNewFiles(updatedFiles)
    setNewPreviews(updatedPreviews)
    onFilesChange(updatedFiles, existingUrls.filter((u) => !kept.includes(u)))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-2">
        {kept.map((url) => (
          <div key={url} className="relative w-24 h-24 flex-shrink-0">
            <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => removeKept(url)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow"
            >
              ×
            </button>
          </div>
        ))}
        {newPreviews.map((preview, idx) => (
          <div key={preview} className="relative w-24 h-24 flex-shrink-0">
            <img src={preview} alt="" className="w-full h-full object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => removeNew(idx)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow"
            >
              ×
            </button>
          </div>
        ))}
        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 flex-shrink-0 transition-colors hover:border-green-400"
            style={{ borderColor: '#D1D5DB', color: 'var(--footers-gray)' }}
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-xs">사진 추가</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAdd} />
      <p className="text-xs mt-1" style={{ color: 'var(--footers-gray)' }}>
        {total}/{maxImages}장 · JPG, PNG, WebP
      </p>
    </div>
  )
}
