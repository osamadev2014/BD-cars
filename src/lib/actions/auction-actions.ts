'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

const DEFAULT_PAGE_SIZE = 20

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export async function getAuctions(params: {
  status?: string
  auctionType?: string
  sortBy?: string
  page?: number
  pageSize?: number
}) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { status = 'active', auctionType, sortBy = 'start_time_asc', page = 1, pageSize = DEFAULT_PAGE_SIZE } = params

    let query = (supabase as any)
      .from('auctions')
      .select(`
        *,
        seller:profiles!seller_id(id, full_name, avatar_url),
        vehicles:auction_vehicles(
          listing:vehicle_listings(
            *,
            vehicle:vehicles(
              *,
              make:car_makes(*),
              model:car_models(*),
              body_type:body_types(*),
              fuel_type:fuel_types(*),
              transmission:transmission_types(*),
              drivetrain:drivetrain_types(*),
              color:car_colors(*),
              images:vehicle_images(*)
            )
          )
        ),
        bids:auction_bids(count),
        watchers:auction_watchers(count)
      `, { count: 'exact' })

    query = query.eq('status', status)
    if (auctionType) query = query.eq('auction_type', auctionType)

    const now = new Date().toISOString()
    query = query.lte('start_time', now)

    switch (sortBy) {
      case 'end_time_asc': query = query.order('end_time', { ascending: true }); break
      case 'end_time_desc': query = query.order('end_time', { ascending: false }); break
      case 'price_asc': query = query.order('start_price', { ascending: true }); break
      case 'price_desc': query = query.order('start_price', { ascending: false }); break
      case 'bids_desc': query = query.order('start_price', { ascending: false }); break
      default: query = query.order('start_time', { ascending: true })
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, count } = await query

    const now_ts = new Date().getTime()

    const enriched = (data || []).map((a: any) => {
      const end = new Date(a.end_time).getTime()
      const remaining = Math.max(0, end - now_ts)
      const highestBid = (a.bids || [])[0]?.amount || a.start_price
      const bidCount = a.bids?.length || 0
      const watcherCount = a.watchers?.length || 0
      const mainListing = (a.vehicles || [])[0]?.listing
      return {
        ...a,
        remaining_ms: remaining,
        remaining_hours: Math.floor(remaining / 3600000),
        remaining_minutes: Math.floor((remaining % 3600000) / 60000),
        highest_bid: highestBid,
        bid_count: bidCount,
        watcher_count: watcherCount,
        main_vehicle: mainListing,
        is_ending_soon: remaining < 3600000,
      }
    })

    return { data: enriched, count: count || 0 }
  }, { data: [], count: 0 })
}

export async function getAuctionBySlug(slug: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()

    const { data } = await (supabase as any)
      .from('auctions')
      .select(`
        *,
        seller:profiles!seller_id(id, full_name, avatar_url, phone),
        vehicles:auction_vehicles(
          listing:vehicle_listings(
            *,
            vehicle:vehicles(
              *,
              make:car_makes(*),
              model:car_models(*),
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
        bids:auction_bids(
          *,
          bidder:profiles(id, full_name)
        ),
        rules:auction_rules(*),
        watchers:auction_watchers(count)
      `)
      .eq('slug', slug)
      .single()

    if (!data) return null

    const now_ts = new Date().getTime()
    const end = new Date(data.end_time).getTime()
    const remaining = Math.max(0, end - now_ts)
    const sortedBids = (data.bids || []).sort((a: any, b: any) => b.amount - a.amount)
    const highestBid = sortedBids[0]?.amount || data.start_price
    const watcherCount = data.watchers?.length || 0

    return {
      ...data,
      remaining_ms: remaining,
      remaining_hours: Math.floor(remaining / 3600000),
      remaining_minutes: Math.floor((remaining % 3600000) / 60000),
      remaining_seconds: Math.floor((remaining % 60000) / 1000),
      highest_bid: highestBid,
      sorted_bids: sortedBids,
      bid_count: sortedBids.length,
      watcher_count: watcherCount,
      is_ending_soon: remaining < 3600000,
    }
  }, null)
}

export async function placeBid(auctionId: string, amount: number) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()

    const { data: auction } = await (supabase as any)
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single()

    if (!auction) return { success: false, error: 'not_found' }
    if (auction.status !== 'active') return { success: false, error: 'auction_not_active' }
    if (auction.seller_id === auth.userId) return { success: false, error: 'self_bid' }

    const now = new Date()
    const end = new Date(auction.end_time)
    if (now > end) return { success: false, error: 'auction_ended' }

    const minBid = auction.highest_bid
      ? auction.highest_bid + auction.bid_increment
      : auction.start_price

    if (amount < minBid) return { success: false, error: 'bid_too_low' }

    if (auction.buy_now_price && amount >= auction.buy_now_price) {
      amount = auction.buy_now_price
    }

    await (supabase as any)
      .from('auction_bids')
      .update({ is_winning: false })
      .eq('auction_id', auctionId)

    const { data: bid, error } = await (supabase as any)
      .from('auction_bids')
      .insert({
        auction_id: auctionId,
        bidder_id: auth.userId,
        amount,
        is_winning: true,
      })
      .select()
      .single()

    if (error) return { success: false, error: 'bid_failed' }

    await (supabase as any)
      .from('auctions')
      .update({ highest_bid: amount })
      .eq('id', auctionId)

    if (auction.buy_now_price && amount >= auction.buy_now_price) {
      await (supabase as any)
        .from('auctions')
        .update({ status: 'ended', winner_id: auth.userId, winning_bid: amount })
        .eq('id', auctionId)
    }

    revalidatePath('/auctions')
    return { success: true, data: bid }
  }, { success: false, error: 'service_unavailable' })
}

export async function toggleWatchAuction(auctionId: string): Promise<{ success: boolean; watching?: boolean; error?: string }> {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }

  try {
    const supabase = await createServerSupabaseClient()

    const { data: existing } = await (supabase as any)
      .from('auction_watchers')
      .select('id')
      .eq('auction_id', auctionId)
      .eq('user_id', auth.userId)
      .single()

    if (existing) {
      await (supabase as any)
        .from('auction_watchers')
        .delete()
        .eq('id', existing.id)
      revalidatePath('/auctions')
      return { success: true, watching: false }
    }

    await (supabase as any)
      .from('auction_watchers')
      .insert({ auction_id: auctionId, user_id: auth.userId })

    revalidatePath('/auctions')
    return { success: true, watching: true }
  } catch {
    return { success: false, error: 'service_unavailable' }
  }
}

export async function getUserAuctions() {
  const auth = await requireAuth()
  if (!auth.allowed) return { data: [], count: 0 }

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()

    const { data: selling, count: sellingCount } = await (supabase as any)
      .from('auctions')
      .select('*', { count: 'exact' })
      .eq('seller_id', auth.userId)
      .order('created_at', { ascending: false })

    const { data: bidding } = await (supabase as any)
      .from('auction_bids')
      .select(`
        auction:auctions!inner(
          *,
          vehicles:auction_vehicles(
            listing:vehicle_listings(
              *,
              vehicle:vehicles(*, make:car_makes(*), model:car_models(*))
            )
          )
        )
      `)
      .eq('bidder_id', auth.userId)
      .order('created_at', { ascending: false } as any)

    const biddingAuctions = (bidding || [])
      .map((b: any) => b.auction)
      .filter(Boolean)
      .filter((a: any, i: number, arr: any[]) => arr.findIndex((x: any) => x.id === a.id) === i)

    return {
      selling: selling || [],
      selling_count: sellingCount || 0,
      bidding: biddingAuctions || [],
      bidding_count: biddingAuctions?.length || 0,
    }
  }, { selling: [], selling_count: 0, bidding: [], bidding_count: 0 })
}

export async function getAuctionStatuses() {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('auctions')
      .select('status, count')
      .is('seller_id', null)
    return data || []
  }, [])
}
