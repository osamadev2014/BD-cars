import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success } from '@/lib/api-response'
import { handleApiError, notFound } from '@/lib/api-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { slug } = await params
    const fields = new URL(request.url).searchParams.get('fields')

    const compactSelect = `
      id, slug, title, status, start_price, reserve_price, start_time, end_time, created_at,
      seller:profiles!seller_id(id, full_name, avatar_url),
      bids:auction_bids(count),
      watchers:auction_watchers(count)
    `

    const { data } = await (supabase as any)
      .from('auctions')
      .select(fields === 'compact' ? compactSelect : `
        *,
        seller:profiles!seller_id(id, full_name, avatar_url, phone),
        vehicles:auction_vehicles(
          listing:vehicle_listings(
            *,
            vehicle:vehicles(
              *,
              make:car_makes(*),
              model:car_models(*),
              trim:car_trims(*),
              body_type:body_types(*),
              fuel_type:fuel_types(*),
              transmission:transmission_types(*),
              drivetrain:drivetrain_types(*),
              color:car_colors(*),
              condition:vehicle_condition_types(*),
              images:vehicle_images(*)
            )
          )
        ),
        bids:auction_bids(*, bidder:profiles(id, full_name)),
        watchers:auction_watchers(count)
      `)
      .eq('slug', slug)
      .single()

    if (!data) return notFound('Auction not found')
    return success(data)
  } catch (err) { return handleApiError(err) }
}
