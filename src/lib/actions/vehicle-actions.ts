'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

const DEFAULT_PAGE_SIZE = 20

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export async function getVehicles(params: {
  search?: string
  makeId?: string
  modelId?: string
  minYear?: number
  maxYear?: number
  minPrice?: number
  maxPrice?: number
  bodyTypeId?: string
  fuelTypeId?: string
  transmissionId?: string
  conditionId?: string
  cityId?: string
  sortBy?: string
  page?: number
  pageSize?: number
}) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { search, makeId, modelId, minYear, maxYear, minPrice, maxPrice, bodyTypeId, fuelTypeId, transmissionId, conditionId, cityId, sortBy = 'created_at_desc', page = 1, pageSize = DEFAULT_PAGE_SIZE } = params

    let query = (supabase as any)
      .from('vehicle_listings')
      .select(`
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
        ),
        seller:profiles(id, full_name, avatar_url, phone),
        city:cities(*)
      `, { count: 'exact' })

    query = query.eq('status', 'active')

    if (search) query = query.ilike('vehicle.make.name', `%${search}%`)
    if (makeId) query = query.eq('vehicle.make_id', makeId)
    if (modelId) query = query.eq('vehicle.model_id', modelId)
    if (minYear) query = query.gte('vehicle.year', minYear)
    if (maxYear) query = query.lte('vehicle.year', maxYear)
    if (minPrice) query = query.gte('price', minPrice)
    if (maxPrice) query = query.lte('price', maxPrice)
    if (bodyTypeId) query = query.eq('vehicle.body_type_id', bodyTypeId)
    if (fuelTypeId) query = query.eq('vehicle.fuel_type_id', fuelTypeId)
    if (transmissionId) query = query.eq('vehicle.transmission_id', transmissionId)
    if (conditionId) query = query.eq('vehicle.condition_type_id', conditionId)
    if (cityId) query = query.eq('city_id', cityId)

    const [sortCol, sortDir] = sortBy.split('_')
    query = query.order(sortCol || 'created_at', { ascending: sortDir === 'asc' })

    const from = (page - 1) * pageSize
    query = query.range(from, from + pageSize - 1)

    const { data, count, error } = await query
    if (error) throw new Error(error.message)
    return { data: data || [], count: count || 0, page, pageSize }
  }, { data: [], count: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE })
}

export async function getVehicleDetail(slug: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await (supabase as any)
      .from('vehicle_listings')
      .select(`
        *,
        vehicle:vehicles(
          *,
          make:car_makes(*),
          model:car_models(*),
          trim:car_trims(*),
          generation:car_generations(*),
          body_type:body_types(*),
          fuel_type:fuel_types(*),
          transmission:transmission_types(*),
          drivetrain:drivetrain_types(*),
          color:car_colors(*),
          interior_color:car_colors(*),
          condition:vehicle_condition_types(*),
          images:vehicle_images(*),
          features:vehicle_features(*)
        ),
        seller:profiles(id, full_name, avatar_url, phone, created_at),
        city:cities(*),
        district:districts(*),
        dealer:dealers(
          *,
          branches:dealer_branches(*),
          subscription:dealer_subscriptions(*)
        )
      `)
      .eq('slug', slug)
      .single()
    if (error) throw new Error(error.message)
    return data
  }, null)
}

export async function createVehicleListing(formData: FormData) {
  const auth = await requireAuth()
  if (!auth.allowed) throw new Error(auth.error || 'Authentication required')
  const supabase = await createServerSupabaseClient()

  const vehicleData = JSON.parse(formData.get('vehicle') as string)
  const listingData = JSON.parse(formData.get('listing') as string)
  const images = formData.getAll('images') as File[]

  const { data: vehicle, error: vehicleError } = await (supabase as any)
    .from('vehicles')
    .insert({
      ...vehicleData,
      owner_id: auth.userId,
    })
    .select()
    .single()
  if (vehicleError) throw new Error(vehicleError.message)

  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const ext = images[i].name.split('.').pop()
      const path = `vehicles/${vehicle.id}/${i}.${ext}`
      const { error: uploadError } = await (supabase as any).storage
        .from('vehicles')
        .upload(path, images[i])
      if (uploadError) throw new Error(uploadError.message)

      await (supabase as any).from('vehicle_images').insert({
        vehicle_id: vehicle.id,
        url: path,
        is_primary: i === 0,
        sort_order: i,
      })
    }
  }

  const { data: listing, error: listingError } = await (supabase as any)
    .from('vehicle_listings')
    .insert({
      vehicle_id: vehicle.id,
      seller_id: auth.userId,
      ...listingData,
    })
    .select()
    .single()
  if (listingError) throw new Error(listingError.message)

  revalidatePath('/')
  revalidatePath('/listings')
  return listing
}

export async function toggleFavorite(listingId: string) {
  const auth = await requireAuth()
  if (!auth.allowed) throw new Error(auth.error || 'Authentication required')
  const supabase = await createServerSupabaseClient()

  const { data: existing } = await (supabase as any)
    .from('favorites')
    .select('id')
    .eq('user_id', auth.userId)
    .eq('listing_id', listingId)
    .single()

  if (existing) {
    await (supabase as any).from('favorites').delete().eq('id', existing.id)
    return { favorited: false }
  }

  await (supabase as any).from('favorites').insert({
    user_id: auth.userId,
    listing_id: listingId,
  })
  revalidatePath('/favorites')
  return { favorited: true }
}

export async function getFavorites(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  return safeDb(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) throw new Error(auth.error || 'Authentication required')
    const supabase = await createServerSupabaseClient()

    const { data, count, error } = await (supabase as any)
      .from('favorites')
      .select(`
        *,
        listing:vehicle_listings(
          *,
          vehicle:vehicles(
            *,
            make:car_makes(*),
            model:car_models(*),
            images:vehicle_images(*)
          )
        )
      `, { count: 'exact' })
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)
    if (error) throw new Error(error.message)
    return { data: data || [], count: count || 0 }
  }, { data: [], count: 0 })
}

export async function recordView(listingId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    await (supabase as any).from('listing_views').insert({
      listing_id: listingId,
      viewer_ip: 'server',
    })
  } catch {
    // silently ignore
  }
}

export async function getMakes(search?: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let query = (supabase as any).from('car_makes').select('*').order('name')
    if (search) query = query.ilike('name', `%${search}%`)
    const { data } = await query.limit(50)
    return data || []
  }, [])
}

export async function getModels(makeId: string, search?: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let query = (supabase as any).from('car_models').select('*').eq('make_id', makeId).order('name')
    if (search) query = query.ilike('name', `%${search}%`)
    const { data } = await query.limit(100)
    return data || []
  }, [])
}
