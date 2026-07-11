'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'
import { getSetting } from '@/lib/settings/settings-service'

const DEFAULT_PAGE_SIZE = 20

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    console.error('[safeDb] Error:', e)
    return fallback
  }
}

export async function getVehiclesForComparison(ids: string[]) {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('vehicle_listings')
    .select('*, vehicle:vehicles(*, make:makes(*), model:models(*), body_type:body_types(*), transmission:transmissions(*), fuel_type:fuel_types(*), cylinders:cylinder_types(*), color:colors(*), images:vehicle_images(*))')
    .in('id', ids)
    .in('status', ['active', 'published'])
  return (data as any[]) || []
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
          id,year,mileage,description,owner_id,created_at,updated_at,
          make:car_makes(id,name,name_ar,slug),
          model:car_models(id,name,name_ar,slug),
          trim:car_trims(id,name,name_ar),
          body_type:body_types(id,name,name_ar,slug),
          fuel_type:fuel_types(id,name,name_ar,slug),
          transmission:transmission_types(id,name,name_ar,slug),
          drivetrain:drivetrain_types(id,name,name_ar,slug),
          color:car_colors(id,name,name_ar),
          condition:vehicle_condition_types(id,name,name_ar),
          images:vehicle_images(id,url,is_primary,sort_order),
          city:cities(id,name,name_ar,slug)
        )
      `, { count: 'exact' })

    query = query.in('status', ['active', 'published'])

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
    query = query.order('is_featured', { ascending: false })
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

  const make = formData.get('make') as string
  const model = formData.get('model') as string
  const year = parseInt(formData.get('year') as string)
  const mileage = formData.get('mileage') ? parseInt(formData.get('mileage') as string) : null
  const bodyType = formData.get('bodyType') as string
  const transmission = formData.get('transmission') as string
  const fuelType = formData.get('fuelType') as string
  const color = formData.get('color') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const negotiable = formData.get('negotiable') === 'on'
  const imageUrls = formData.getAll('imageUrls') as string[]

  const requireApproval = await getSetting<boolean>('require_listing_approval', false)
  const initialStatus = requireApproval ? 'pending' : 'active'

  const { data: vehicle, error: vehicleError } = await (supabase as any)
    .from('vehicles')
    .insert({
      make_id: make,
      model_id: model,
      year,
      mileage,
      body_type_id: bodyType || null,
      transmission_id: transmission || null,
      fuel_type_id: fuelType || null,
      color_id: color || null,
      description,
      owner_id: auth.userId,
    })
    .select()
    .single()
  if (vehicleError) throw new Error(vehicleError.message)

  if (imageUrls.length > 0) {
    const rows = imageUrls.map((url, i) => ({
      vehicle_id: vehicle.id,
      url,
      is_primary: i === 0,
      sort_order: i,
    }))
    const { error: imgError } = await (supabase as any)
      .from('vehicle_images')
      .insert(rows)
    if (imgError) throw new Error(imgError.message)
  }

  const { data: listing, error: listingError } = await (supabase as any)
    .from('vehicle_listings')
    .insert({
      vehicle_id: vehicle.id,
      seller_id: auth.userId,
      price,
      is_negotiable: negotiable,
      status: initialStatus,
    })
    .select()
    .single()
  if (listingError) throw new Error(listingError.message)

  await (supabase as any).from('listing_status_history').insert({
    listing_id: listing.id,
    status: initialStatus,
    changed_by: auth.userId,
    notes: requireApproval ? 'Pending admin approval' : 'Auto-approved',
  })

  if (requireApproval) {
    const { error: reqError } = await (supabase as any)
      .from('listing_approval_requests')
      .insert({
        listing_id: listing.id,
        requested_by: auth.userId,
        status: 'pending',
      })
    if (reqError) throw new Error(reqError.message)
  }

  revalidatePath('/')
  revalidatePath('/listings')
  revalidatePath('/admin/approvals')
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
    const { data: cur } = await (supabase as any).from('vehicle_listings').select('favorite_count').eq('id', listingId).single()
    await (supabase as any).from('vehicle_listings').update({ favorite_count: Math.max(0, (cur?.favorite_count || 1) - 1) }).eq('id', listingId)
    return { favorited: false }
  }

  await (supabase as any).from('favorites').insert({
    user_id: auth.userId,
    listing_id: listingId,
  })
  const { data: cur } = await (supabase as any).from('vehicle_listings').select('favorite_count').eq('id', listingId).single()
  await (supabase as any).from('vehicle_listings').update({ favorite_count: (cur?.favorite_count || 0) + 1 }).eq('id', listingId)
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
    await (supabase as any).from('vehicle_views').insert({
      listing_id: listingId,
      viewer_ip: 'server',
    })
    const { data: cur } = await (supabase as any).from('vehicle_listings').select('views_count').eq('id', listingId).single()
    await (supabase as any).from('vehicle_listings').update({ views_count: (cur?.views_count || 0) + 1 }).eq('id', listingId)
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

export async function featureListing(listingId: string, days: number = 7) {
  const supabase = await createServerSupabaseClient()
  const featuredUntil = new Date(Date.now() + days * 86400000).toISOString()
  const { error } = await (supabase as any)
    .from('vehicle_listings')
    .update({ is_featured: true, featured_until: featuredUntil })
    .eq('id', listingId)
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]/dashboard/listings')
  revalidatePath('/[locale]/listings')
  return { success: true }
}

export async function unfeatureListing(listingId: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any)
    .from('vehicle_listings')
    .update({ is_featured: false, featured_until: null })
    .eq('id', listingId)
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]/dashboard/listings')
  revalidatePath('/[locale]/listings')
  return { success: true }
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
