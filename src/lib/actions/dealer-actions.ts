'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export async function getDealers(citySlug?: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let query = (supabase as any)
      .from('dealers')
      .select('*, cities!city_id(name, name_ar, slug)')
      .eq('is_active', true)
      .eq('is_approved', true)
    if (citySlug) {
      query = query.eq('cities.slug', citySlug)
    }
    const { data } = await query.order('created_at', { ascending: false })
    return data || []
  }, [])
}

export async function getDealerBySlug(slug: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('dealers')
      .select('*, cities!city_id(*), dealer_branches(*, cities!city_id(name, name_ar, slug))')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    return data || null
  }, null)
}

export async function getDealerListings(dealerId: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('vehicle_listings')
      .select('*, vehicles(*, make:car_makes(*), model:car_models(*)), primary_image:vehicle_images!inner(*)')
      .eq('dealer_id', dealerId)
      .in('status', ['published', 'published_with_trusted_badge', 'reserved'])
      .order('created_at', { ascending: false })
    return data || []
  }, [])
}

export async function createDealer(input: {
  name: string
  name_ar?: string
  phone?: string
  email?: string
  city_id?: string
  address?: string
  description?: string
}) {
  const user = await requireAuth()
  if (!user.allowed) return { success: false, error: user.error! }

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()

    const existing = await (supabase as any)
      .from('dealers')
      .select('id')
      .eq('owner_id', user.userId)
      .maybeSingle()
    if (existing.data) return { success: false, error: 'You already have a dealer profile' }

    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now()

    const { data, error } = await (supabase as any)
      .from('dealers')
      .insert({ owner_id: user.userId, ...input, slug })
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    revalidatePath('/dealers')
    return { success: true, data }
  }, { success: false, error: 'Failed to create dealer profile' })
}
