import { SupabaseClient } from '@supabase/supabase-js'

const BUCKET = 'team-photos'

export async function uploadImages(supabase: SupabaseClient, files: File[], folder: string): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      urls.push(data.publicUrl)
    }
  }
  return urls
}

export async function deleteImages(supabase: SupabaseClient, urls: string[]): Promise<void> {
  const marker = `/object/public/${BUCKET}/`
  const paths = urls.map((url) => {
    const idx = url.indexOf(marker)
    return idx >= 0 ? decodeURIComponent(url.slice(idx + marker.length)) : ''
  }).filter(Boolean)
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths)
}
