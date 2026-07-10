import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createStorageService } from '@/lib/storage/storage-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'vehicles'
    const folder = (formData.get('folder') as string) || 'listings'
    const createThumbnail = formData.get('thumbnail') !== 'false'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const storage = createStorageService(bucket)
    const result = await storage.uploadFromFile(file, user.id, folder, {
      createThumbnail,
      compress: true,
      maxWidth: 1600,
      maxHeight: 1600,
    })

    return NextResponse.json({
      url: result.url,
      path: result.path,
      thumbnailUrl: result.thumbnailUrl,
      thumbnailPath: result.thumbnailPath,
      width: result.width,
      height: result.height,
      size: result.size,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
