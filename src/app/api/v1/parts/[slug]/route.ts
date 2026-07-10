import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success } from '@/lib/api-response'
import { handleApiError, notFound } from '@/lib/api-helpers'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { slug } = await params

    const { data } = await (supabase as any)
      .from('spare_parts')
      .select('*, part_categories!category_id(*), part_brands!brand_id(*), spare_part_images(url, is_primary), supplier:suppliers!supplier_id(id, name, name_ar)')
      .eq('slug', slug)
      .single()

    if (!data) return notFound('Part not found')
    return success(data)
  } catch (err) { return handleApiError(err) }
}
