'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export async function getInspectionServices() {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('inspection_services')
      .select('*')
      .eq('is_active', true)
      .order('name')
    return data || []
  }, [])
}

export async function getInspectionCenters(cityId?: string, serviceId?: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()

    let query = (supabase as any)
      .from('inspection_centers')
      .select(`
        *,
        city:cities(*),
        branches:inspection_center_branches(*, city:cities(*))
      `)
      .eq('is_active', true)

    if (cityId) query = query.eq('city_id', cityId)
    query = query.order('name')

    const { data } = await query
    return data || []
  }, [])
}

export async function getInspectionCenterBySlug(slug: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('inspection_centers')
      .select(`
        *,
        city:cities(*),
        branches:inspection_center_branches(*, city:cities(*)),
        pricing:inspection_service_pricing(*, service:inspection_services(*))
      `)
      .eq('slug', slug)
      .single()
    return data || null
  }, null)
}

export async function bookInspection(params: {
  serviceId: string
  centerId: string
  branchId?: string
  appointmentDate: string
  notes?: string
  listingId?: string
  vehicleId?: string
}) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()

    const { data: pricing } = await (supabase as any)
      .from('inspection_service_pricing')
      .select('price, service:inspection_services(*)')
      .eq('service_id', params.serviceId)
      .eq('center_id', params.centerId)
      .eq('is_active', true)
      .single()

    const price = pricing?.price || pricing?.service?.default_price || 0

    const { data: appointment, error } = await (supabase as any)
      .from('inspection_appointments')
      .insert({
        service_id: params.serviceId,
        center_id: params.centerId,
        branch_id: params.branchId || null,
        customer_id: auth.userId,
        appointment_date: params.appointmentDate,
        notes: params.notes || null,
        listing_id: params.listingId || null,
        vehicle_id: params.vehicleId || null,
        price,
        status: 'pending',
      })
      .select()
      .single()

    if (error) return { success: false, error: 'booking_failed' }

    revalidatePath('/dashboard/inspections')
    return { success: true, data: appointment }
  }, { success: false, error: 'service_unavailable' })
}

export async function getUserInspections() {
  const auth = await requireAuth()
  if (!auth.allowed) return []

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('inspection_appointments')
      .select(`
        *,
        center:inspection_centers(name, name_ar, logo_url),
        branch:inspection_center_branches(name, name_ar),
        service:inspection_services(name, name_ar),
        listing:vehicle_listings(
          *,
          vehicle:vehicles(*, make:car_makes(*), model:car_models(*))
        ),
        report:inspection_reports(*)
      `)
      .eq('customer_id', auth.userId)
      .order('appointment_date', { ascending: false })

    return data || []
  }, [])
}

export async function cancelInspection(appointmentId: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { error } = await (supabase as any)
      .from('inspection_appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)
      .eq('customer_id', auth.userId)

    if (error) return { success: false, error: 'cancel_failed' }
    revalidatePath('/dashboard/inspections')
    return { success: true }
  }, { success: false, error: 'service_unavailable' })
}
