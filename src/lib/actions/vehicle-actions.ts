'use server'

import { createServerSupabaseClient, createPublicClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { fetchSupabase } from '@/lib/supabase/fetch-client'
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
    const { search, makeId, modelId, minYear, maxYear, minPrice, maxPrice, bodyTypeId, fuelTypeId, transmissionId, conditionId, cityId, sortBy = 'created_at_desc', page = 1, pageSize = DEFAULT_PAGE_SIZE } = params

    const filters: Record<string, string> = {
      select: `
        id,slug,title,title_ar,price,status,is_featured,created_at,description,description_ar,seller_type,has_inspection,updated_at,views_count,favorite_count,
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
      `,
      status: 'in.(active,published)',
    }
    if (search) filters['vehicle.make.name'] = `ilike.*${search}*`
    if (makeId) filters['vehicle.make_id'] = `eq.${makeId}`
    if (modelId) filters['vehicle.model_id'] = `eq.${modelId}`
    if (minYear) filters['vehicle.year'] = `gte.${minYear}`
    if (maxYear) filters['vehicle.year'] = `lte.${maxYear}`
    if (minPrice) filters['price'] = `gte.${minPrice}`
    if (maxPrice) filters['price'] = `lte.${maxPrice}`
    if (bodyTypeId) filters['vehicle.body_type_id'] = `eq.${bodyTypeId}`
    if (fuelTypeId) filters['vehicle.fuel_type_id'] = `eq.${fuelTypeId}`
    if (transmissionId) filters['vehicle.transmission_id'] = `eq.${transmissionId}`
    if (conditionId) filters['vehicle.condition_type_id'] = `eq.${conditionId}`
    if (cityId) filters['vehicle.city_id'] = `eq.${cityId}`

    const [sortCol, sortDir] = sortBy.split('_')
    const order = `is_featured.desc,${sortCol || 'created_at'}.${sortDir === 'asc' ? 'asc' : 'desc'}`

    const from = (page - 1) * pageSize
    const { data, error } = await fetchSupabase<any[]>('vehicle_listings', {
      ...filters,
      order,
      limit: pageSize,
      offset: from,
    })
    if (error) throw new Error(error)
    return { data: data || [], count: (data || []).length, page, pageSize }
  }, { data: [], count: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE })
}

export async function getVehicleDetail(slug: string) {
  return safeDb(async () => {
    const { data, error } = await fetchSupabase<any[]>('vehicle_listings', {
      select: `
        *,
        vehicle:vehicles(
          id,year,mileage,description,owner_id,created_at,updated_at,
          make:car_makes(id,name,name_ar,slug),
          model:car_models(id,name,name_ar,slug),
          trim:car_trims(id,name,name_ar),
          generation:car_generations(id,name,name_ar),
          body_type:body_types(id,name,name_ar,slug),
          fuel_type:fuel_types(id,name,name_ar,slug),
          transmission:transmission_types(id,name,name_ar,slug),
          drivetrain:drivetrain_types(id,name,name_ar,slug),
          color:car_colors(id,name,name_ar),
          interior_color:car_colors(id,name,name_ar),
          condition:vehicle_condition_types(id,name,name_ar),
          images:vehicle_images(id,url,is_primary,sort_order),
          features:vehicle_features(id,name,name_ar),
          city:cities(id,name,name_ar,slug),
          district:districts(id,name,name_ar,slug)
        ),
        dealer:dealers(
          id,name,name_ar,slug,logo_url,description,description_ar,phone,email,website,is_approved,owner_id,
          branches:dealer_branches(id,name,address,phone),
          subscription:dealer_subscriptions(id,plan_id,status,start_date,end_date)
        )
      `,
      slug: `eq.${slug}`,
      limit: 1,
    })
    if (error) throw new Error(error)
    return (data && data.length > 0) ? data[0] : null
  }, null)
}

function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)
}

export async function createVehicleListing(formData: FormData) {
  try {
  const auth = await requireAuth()
  if (!auth.allowed) throw new Error(auth.error || 'Authentication required')
  const supabase = await createServerSupabaseClient()

  let make = formData.get('make') as string
  // Resolve make UUID if an integer ID or non-UUID value was passed (old system)
  if (make && !isValidUUID(make)) {
    const { data: makeRow1 } = await (supabase as any)
      .from('car_makes')
      .select('id')
      .or(`slug.eq.${make.toLowerCase()},code.eq.${make}`)
      .maybeSingle()
    if (makeRow1) {
      make = makeRow1.id
    } else if (/^\d+$/.test(make)) {
      const { data: makeRow2 } = await (supabase as any)
        .from('car_makes')
        .select('id')
        .filter('id', 'eq', make)
        .maybeSingle()
      if (makeRow2) make = makeRow2.id
    }
  }

  const modelName = formData.get('model') as string
  const year = parseInt(formData.get('year') as string)
  const mileage = formData.get('mileage') ? parseInt(formData.get('mileage') as string) : null
  const bodyType = formData.get('bodyType') as string
  const transmission = formData.get('transmission') as string
  const fuelType = formData.get('fuelType') as string
  const color = formData.get('color') as string
  const condition = formData.get('condition') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const negotiable = formData.get('negotiable') === 'on'
  const imageUrls = formData.getAll('imageUrls') as string[]
  const features = formData.getAll('features') as string[]
  const paymentOptions = formData.getAll('paymentOptions') as string[]
  const category = formData.get('category') as string

  // Determine listing status based on dealer verification
  let initialStatus = 'active'
  let needsApproval = false

  const { data: orgMembers } = await (supabase as any)
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', auth.userId)
    .eq('role', 'owner')

  if (orgMembers && orgMembers.length > 0) {
    const { data: org } = await (supabase as any)
      .from('organizations')
      .select('org_type, verification_status')
      .eq('id', orgMembers[0].organization_id)
      .single()

    if (org && org.org_type === 'car_dealer') {
      if (org.verification_status !== 'verified') {
        initialStatus = 'pending'
        needsApproval = true
      }
    }
  }

  // Resolve model: look up existing or create new
  let modelId: string | null = null
  if (modelName && make) {
    const { data: existing } = await (supabase as any)
      .from('car_models')
      .select('id')
      .eq('make_id', make)
      .ilike('name', modelName)
      .maybeSingle()
    if (existing) {
      modelId = existing.id
    } else {
      // Use service role to bypass RLS for car_models insert
      const adminClient = createServiceRoleClient()
      const slug = modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const { data: newModel, error: modelError } = await (adminClient as any)
        .from('car_models')
        .insert({ make_id: make, name: modelName, name_ar: modelName, slug })
        .select('id')
        .single()
      if (modelError) throw new Error(modelError.message)
      modelId = newModel.id
    }
  }

  // Resolve text values to UUIDs for lookup fields
  const lookupTextToUuid = async (table: string, nameColumn: string, value: string): Promise<string | null> => {
    if (!value) return null
    if (isValidUUID(value)) return value
    const { data } = await (supabase as any).from(table).select('id').or(`${nameColumn}.ilike.${value},name_ar.ilike.${value}`).maybeSingle()
    return data?.id || null
  }

  const resolvedBodyType = await lookupTextToUuid('body_types', 'name', bodyType)
  const resolvedTransmission = await lookupTextToUuid('transmission_types', 'name', transmission)
  const resolvedFuelType = await lookupTextToUuid('fuel_types', 'name', fuelType)
  const resolvedColor = await lookupTextToUuid('car_colors', 'name', color)

  const { data: vehicle, error: vehicleError } = await (supabase as any)
    .from('vehicles')
    .insert({
      make_id: make,
      model_id: modelId,
      year,
      mileage,
      body_type_id: resolvedBodyType,
      transmission_id: resolvedTransmission,
      fuel_type_id: resolvedFuelType,
      color_id: resolvedColor,
      description,
      category: category || null,
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
      status: initialStatus,
    })
    .select()
    .single()
  if (listingError) throw new Error(listingError.message)

  await (supabase as any).from('listing_status_history').insert({
    listing_id: listing.id,
    status: initialStatus,
    changed_by: auth.userId,
    notes: needsApproval ? 'Pending admin approval' : 'Auto-approved',
  })

  if (needsApproval) {
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
  } catch (err: any) {
    console.error('[createVehicleListing] Error:', err)
    throw new Error(err?.message || err?.toString() || 'Unknown error')
  }
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
      ip_address: 'server',
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
