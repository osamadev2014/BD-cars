import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success } from '@/lib/api-response'
import { handleApiError, notFound } from '@/lib/api-helpers'
import { getAuthUser } from '@/lib/api-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { slug } = await params
    const user = await getAuthUser(supabase, request)
    const fields = new URL(request.url).searchParams.get('fields')

    const detailSelect = `
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
        images:vehicle_images(*),
        features:vehicle_features(*)
      ),
      seller:profiles(id, full_name, avatar_url, phone, whatsapp_phone),
      city:cities(*)
    `

    const compactSelect = `
      id, slug, title, description, price, status,
      is_featured, featured_until, views_count, inquiry_count, favorite_count,
      created_at, updated_at,
      vehicle:vehicles(
        id, make_id, model_id, year, mileage, engine_capacity, cylinders,
        make:car_makes(id, name, name_ar),
        model:car_models(id, name, name_ar),
        body_type:body_types(id, name, name_ar),
        fuel_type:fuel_types(id, name, name_ar),
        transmission:transmission_types(id, name, name_ar),
        images:vehicle_images(id, url, is_primary, sort_order)
      ),
      seller:profiles(id, full_name, avatar_url, phone, whatsapp_phone),
      city:cities(id, name, name_ar)
    `

    const { data } = await (supabase as any)
      .from('vehicle_listings')
      .select(fields === 'compact' ? compactSelect : detailSelect)
      .eq('slug', slug)
      .single()

    if (!data) return notFound('Listing not found')

    if (user) {
      await (supabase as any)
        .from('vehicle_views')
        .insert({ listing_id: data.id, user_id: user.id })
        .catch(() => {})
    }

    return success(data)
  } catch (err) { return handleApiError(err) }
}
