import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success } from '@/lib/api-response'
import { parsePagination, handleApiError } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const { page, perPage, offset } = parsePagination(searchParams)

    let query = (supabase as any)
      .from('car_makes')
      .select('*, models:car_models(count)', { count: 'exact' })
      .order('name')

    if (search) query = query.ilike('name', `%${search}%`)

    const { data, count } = await query.range(offset, offset + perPage - 1)

    return success({
      makes: data || [],
      pagination: { page, perPage, total: count || 0, totalPages: Math.ceil((count || 0) / perPage) },
    })
  } catch (err) { return handleApiError(err) }
}
