'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

export async function rateDealer(dealerId: string, rating: number, review?: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }
  if (rating < 1 || rating > 5) return { success: false, error: 'invalid_rating' }

  try {
    const supabase = await createServerSupabaseClient()

    const { data: existing } = await (supabase as any)
      .from('dealer_ratings')
      .select('id')
      .eq('dealer_id', dealerId)
      .eq('user_id', auth.userId)
      .single()

    if (existing) {
      const { error } = await (supabase as any)
        .from('dealer_ratings')
        .update({ rating, review: review || null })
        .eq('id', existing.id)
      if (error) return { success: false, error: error.message }
    } else {
      const { error } = await (supabase as any)
        .from('dealer_ratings')
        .insert({ dealer_id: dealerId, user_id: auth.userId, rating, review: review || null })
      if (error) return { success: false, error: error.message }
    }

    revalidatePath(`/dealers/${dealerId}`)
    return { success: true }
  } catch {
    return { success: false, error: 'service_unavailable' }
  }
}

export async function getDealerRatings(dealerId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('dealer_ratings')
      .select('*, user:profiles(id, full_name, avatar_url)')
      .eq('dealer_id', dealerId)
      .order('created_at', { ascending: false })
      .limit(20)
    return (data as any[]) || []
  } catch {
    return []
  }
}

export async function getMyDealerRating(dealerId: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return null

  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('dealer_ratings')
      .select('*')
      .eq('dealer_id', dealerId)
      .eq('user_id', auth.userId)
      .single()
    return data || null
  } catch {
    return null
  }
}

export async function createListingReview(listingId: string, rating: number, review?: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }
  if (rating < 1 || rating > 5) return { success: false, error: 'invalid_rating' }

  try {
    const supabase = await createServerSupabaseClient()

    const { data: existing } = await (supabase as any)
      .from('listing_reviews')
      .select('id')
      .eq('listing_id', listingId)
      .eq('user_id', auth.userId)
      .single()

    if (existing) {
      const { error } = await (supabase as any)
        .from('listing_reviews')
        .update({ rating, review: review || null, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
      if (error) return { success: false, error: error.message }
    } else {
      const { error } = await (supabase as any)
        .from('listing_reviews')
        .insert({ listing_id: listingId, user_id: auth.userId, rating, review: review || null })
      if (error) return { success: false, error: error.message }
    }

    revalidatePath(`/listings/${listingId}`)
    return { success: true }
  } catch {
    return { success: false, error: 'service_unavailable' }
  }
}

export async function getListingReviews(listingId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('listing_reviews')
      .select('*, user:profiles(id, full_name, avatar_url)')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })
      .limit(20)
    return (data as any[]) || []
  } catch {
    return []
  }
}

export async function getMyListingReview(listingId: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return null

  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('listing_reviews')
      .select('*')
      .eq('listing_id', listingId)
      .eq('user_id', auth.userId)
      .single()
    return data || null
  } catch {
    return null
  }
}
