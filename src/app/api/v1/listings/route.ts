import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success, error } from '@/lib/api-response'
import { parsePagination, parseSort, handleApiError } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search')
    const makeId = searchParams.get('make_id')
    const modelId = searchParams.get('model_id')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const minYear = searchParams.get('min_year')
    const maxYear = searchParams.get('max_year')
    const bodyTypeId = searchParams.get('body_type_id')
    const fuelTypeId = searchParams.get('fuel_type_id')
    const transmissionId = searchParams.get('transmission_id')
    const conditionId = searchParams.get('condition_id')
    const cityId = searchParams.get('city_id')
    const dealerId = searchParams.get('dealer_id')
    const status = searchParams.get('status') || 'active'
    const featured = searchParams.get('featured')
    const { page, perPage, offset } = parsePagination(searchParams)
    const sort = parseSort(searchParams, ['created_at', 'price', 'views_count'], 'created_at', 'desc')
    const fields = searchParams.get('fields')

    const defaultSelect = `
      id, slug, title, price, status, created_at, updated_at,
      is_featured, featured_until, views_count, inquiry_count, favorite_count,
      vehicle:vehicles(
        id, make_id, model_id, year, mileage,
        make:car_makes(id, name, name_ar),
        model:car_models(id, name, name_ar),
        images:vehicle_images(id, url, is_primary, sort_order)
      ),
      city:cities(id, name, name_ar)
    `

    const fullSelect = `
      *,
      vehicle:vehicles(
        *,
        make:car_makes(*),
        model:car_models(*),
        images:vehicle_images(*),
        body_type:body_types(*),
        fuel_type:fuel_types(*),
        transmission:transmission_types(*)
      ),
      seller:profiles(id, full_name, avatar_url, phone),
      city:cities(*)
    `

    let query = (supabase as any)
      .from('vehicle_listings')
      .select(fields === 'full' ? fullSelect : defaultSelect, { count: 'exact' })

    if (status === 'active') query = query.in('status', ['active', 'published'])
    else if (status && status !== 'all') query = query.eq('status', status)

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (makeId) query = query.eq('vehicle.make_id', makeId)
    if (modelId) query = query.eq('vehicle.model_id', modelId)
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))
    if (minYear) query = query.gte('vehicle.year', parseInt(minYear))
    if (maxYear) query = query.lte('vehicle.year', parseInt(maxYear))
    if (bodyTypeId) query = query.eq('vehicle.body_type_id', bodyTypeId)
    if (fuelTypeId) query = query.eq('vehicle.fuel_type_id', fuelTypeId)
    if (transmissionId) query = query.eq('vehicle.transmission_id', transmissionId)
    if (conditionId) query = query.eq('vehicle.condition_type_id', conditionId)
    if (cityId) query = query.eq('city_id', cityId)
    if (dealerId) query = query.eq('seller_id', dealerId)
    if (featured === 'true') {
      query = query.not('is_featured', 'is', false)
      query = query.gte('featured_until', new Date().toISOString())
    }

    query = query.order(sort.field, { ascending: sort.dir === 'asc' })

    const { data, count } = await query.range(offset, offset + perPage - 1)

    return success({
      listings: data || [],
      pagination: { page, perPage, total: count || 0, totalPages: Math.ceil((count || 0) / perPage) },
    })
  } catch (err) { return handleApiError(err) }
}
