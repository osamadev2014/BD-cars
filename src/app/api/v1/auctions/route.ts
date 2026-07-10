import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success } from '@/lib/api-response'
import { parsePagination, handleApiError } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const { page, perPage, offset } = parsePagination(searchParams)
    const sortBy = searchParams.get('sort_by') || 'end_time_asc'
    const dealerId = searchParams.get('dealer_id')

    let query = (supabase as any)
      .from('auctions')
      .select(`
        *,
        seller:profiles!seller_id(id, full_name, avatar_url),
        vehicles:auction_vehicles(
          listing:vehicle_listings(
            id, slug, title, price,
            vehicle:vehicles(
              id, make_id, model_id,
              make:car_makes(id, name, name_ar),
              model:car_models(id, name, name_ar),
              images:vehicle_images(id, url, is_primary)
            )
          )
        ),
        bids:auction_bids(count),
        watchers:auction_watchers(count)
      `, { count: 'exact' })

    if (status === 'active') {
      query = query.eq('status', 'active').lte('start_time', new Date().toISOString())
    } else if (status !== 'all') {
      query = query.eq('status', status)
    }
    if (dealerId) query = query.eq('seller_id', dealerId)

    switch (sortBy) {
      case 'end_time_asc': query = query.order('end_time', { ascending: true }); break
      case 'end_time_desc': query = query.order('end_time', { ascending: false }); break
      case 'price_asc': query = query.order('start_price', { ascending: true }); break
      case 'price_desc': query = query.order('start_price', { ascending: false }); break
      default: query = query.order('end_time', { ascending: true })
    }

    const { data, count } = await query.range(offset, offset + perPage - 1)

    return success({
      auctions: data || [],
      pagination: { page, perPage, total: count || 0, totalPages: Math.ceil((count || 0) / perPage) },
    })
  } catch (err) { return handleApiError(err) }
}
