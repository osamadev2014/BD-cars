import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success, error } from '@/lib/api-response'
import { corsHeaders, handleApiError } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const supabase = (await createServerSupabaseClient()) as any

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('per_page') || '10') || 10))
    const offset = (page - 1) * perPage

    const { data, count } = await supabase
      .from('vehicle_listings')
      .select(`
        id, slug, title, price, is_featured, featured_until,
        vehicle:vehicles(
          id, year, mileage,
          make:car_makes(id, name, name_ar),
          model:car_models(id, name, name_ar),
          images:vehicle_images(id, url, is_primary, sort_order)
        ),
        city:cities(id, name, name_ar)
      `, { count: 'exact' })
      .eq('status', 'active')
      .eq('is_featured', true)
      .gte('featured_until', new Date().toISOString())
      .order('featured_until', { ascending: false })
      .range(offset, offset + perPage - 1)

    const origin = request.headers.get('origin')
    return success({
      listings: data || [],
      pagination: { page, perPage, total: count || 0, totalPages: Math.ceil((count || 0) / perPage) },
    }, 200)
  } catch (err) { return handleApiError(err) }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new Response(null, { headers: corsHeaders(origin) })
}
