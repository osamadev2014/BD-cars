import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success } from '@/lib/api-response'
import { parsePagination, handleApiError } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const condition = searchParams.get('condition')
    const partType = searchParams.get('part_type')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sort_by') || 'created_at_desc'
    const { page, perPage, offset } = parsePagination(searchParams)

    let query = (supabase as any)
      .from('spare_parts')
      .select('*, part_categories!category_id(id, name, name_ar, slug), part_brands!brand_id(id, name, name_ar, slug), spare_part_images(url, is_primary)', { count: 'exact' })
      .eq('is_active', true)
      .eq('is_approved', true)

    if (category) query = query.eq('category_id', category)
    if (brand) query = query.eq('brand_id', brand)
    if (condition) query = query.eq('condition', condition)
    if (partType) query = query.eq('part_type', partType)
    if (search) {
      query = query.or(`title.ilike.%${search}%,title_ar.ilike.%${search}%,part_number.ilike.%${search}%`)
    }

    const [sortCol, sortDir] = sortBy.split('_')
    const { data, count } = await query
      .order(sortCol || 'created_at', { ascending: sortDir === 'asc' })
      .range(offset, offset + perPage - 1)

    return success({
      parts: data || [],
      pagination: { page, perPage, total: count || 0, totalPages: Math.ceil((count || 0) / perPage) },
    })
  } catch (err) { return handleApiError(err) }
}
