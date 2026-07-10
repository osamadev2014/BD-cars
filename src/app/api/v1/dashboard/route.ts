import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success } from '@/lib/api-response'
import { getAuthUser, handleApiError, requireUser } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getAuthUser(supabase, request)
    const blocked = requireUser(user)
    if (blocked) return blocked

    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section') || 'summary'

    const data: Record<string, unknown> = {}

    if (section === 'summary' || section === 'all') {
      const [listings, favorites, messages, auctions] = await Promise.all([
        (supabase as any).from('vehicle_listings').select('id', { count: 'exact' }).eq('user_id', user!.id),
        (supabase as any).from('favorites').select('id', { count: 'exact' }).eq('user_id', user!.id),
        (supabase as any).from('conversations').select('id', { count: 'exact' }).or(`buyer_id.eq.${user!.id},seller_id.eq.${user!.id}`),
        (supabase as any).from('auctions').select('id', { count: 'exact' }).eq('seller_id', user!.id),
      ])
      data.summary = {
        listings_count: listings.count || 0,
        favorites_count: favorites.count || 0,
        messages_count: messages.count || 0,
        auctions_count: auctions.count || 0,
      }
    }

    if (section === 'listings' || section === 'all') {
      const { data: listings } = await (supabase as any)
        .from('vehicle_listings')
        .select('*, vehicle:vehicles(*, make:car_makes(*), model:car_models(*), images:vehicle_images(*))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50)
      data.listings = listings || []
    }

    if (section === 'favorites' || section === 'all') {
      const { data: favorites } = await (supabase as any)
        .from('favorites')
        .select('*, listing:vehicle_listings(*, vehicle:vehicles(*, make:car_makes(*), model:car_models(*), images:vehicle_images(*)))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50)
      data.favorites = favorites || []
    }

    if (section === 'requests' || section === 'all') {
      const [purchaseRequests, viewingRequests] = await Promise.all([
        (supabase as any).from('purchase_requests').select('*').eq('buyer_id', user!.id).order('created_at', { ascending: false }).limit(50),
        (supabase as any).from('viewing_appointments').select('*').eq('buyer_id', user!.id).order('created_at', { ascending: false }).limit(50),
      ])
      data.purchase_requests = purchaseRequests.data || []
      data.viewing_requests = viewingRequests.data || []
    }

    return success(data)
  } catch (err) { return handleApiError(err) }
}
