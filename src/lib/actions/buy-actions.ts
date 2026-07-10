'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/actions/notification-actions'

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export async function createPurchaseRequest(
  listingId: string,
  message: string,
  proposedPrice?: number
) {
  const auth = await requireAuth()
  if (!auth.allowed) throw new Error('Authentication required')
  if (!auth.userId) throw new Error('User ID not found')

  const supabase = await createServerSupabaseClient()

  const { data: existing } = await (supabase as any)
    .from('purchase_requests')
    .select('id, status')
    .eq('listing_id', listingId)
    .eq('buyer_id', auth.userId)
    .in('status', ['pending', 'under_review', 'accepted'])
    .maybeSingle()

  if (existing) {
    throw new Error('You already have an active request for this listing')
  }

  const { data: listing } = await (supabase as any)
    .from('vehicle_listings')
    .select('seller_id')
    .eq('id', listingId)
    .single()

  const { data, error } = await (supabase as any)
    .from('purchase_requests')
    .insert({
      listing_id: listingId,
      buyer_id: auth.userId,
      status: 'pending',
      message,
      proposed_price: proposedPrice || 0,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  const supabase2 = await createServerSupabaseClient()
  const { data: cur } = await (supabase2 as any).from('vehicle_listings').select('inquiry_count').eq('id', listingId).single()
  await (supabase2 as any).from('vehicle_listings').update({ inquiry_count: (cur?.inquiry_count || 0) + 1 }).eq('id', listingId)

  if (listing) {
    await createNotification(
      listing.seller_id,
      'New Purchase Request',
      'Someone is interested in your listing.',
      'info',
      'listing',
      listingId,
      'طلب شراء جديد',
      'هناك شخص مهتم بإعلانك.',
    )
  }

  revalidatePath('/dashboard/requests')
  revalidatePath('/dashboard/sales')
  return { id: data.id }
}

export async function getUserPurchaseRequests(page = 1, pageSize = 20) {
  return safeDb(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) return { data: [], count: 0 }
    const supabase = await createServerSupabaseClient()

    const { data, count, error } = await (supabase as any)
      .from('purchase_requests')
      .select(`
        *,
        listing:vehicle_listings(
          id, slug, price, status,
          vehicle:vehicles(
            id, year, mileage,
            make:car_makes(name),
            model:car_models(name),
            images:vehicle_images(*)
          )
        )
      `, { count: 'exact' })
      .eq('buyer_id', auth.userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) throw new Error(error.message)
    return { data: data || [], count: count || 0 }
  }, { data: [], count: 0 })
}

export async function getIncomingPurchaseRequests(page = 1, pageSize = 20) {
  return safeDb(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) return { data: [], count: 0 }
    const supabase = await createServerSupabaseClient()

    const { data, count, error } = await (supabase as any)
      .from('purchase_requests')
      .select(`
        *,
        buyer:profiles(id, full_name, phone),
        listing:vehicle_listings!inner(
          id, slug, price,
          seller_id,
          vehicle:vehicles(
            id, year,
            make:car_makes(name),
            model:car_models(name),
            images:vehicle_images(*)
          )
        )
      `, { count: 'exact' })
      .eq('listing.seller_id', auth.userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) throw new Error(error.message)
    return { data: data || [], count: count || 0 }
  }, { data: [], count: 0 })
}

export async function updatePurchaseRequestStatus(
  requestId: string,
  status: string
) {
  const auth = await requireAuth()
  if (!auth.allowed) throw new Error('Authentication required')
  const supabase = await createServerSupabaseClient()

  const { data: request } = await (supabase as any)
    .from('purchase_requests')
    .select('listing_id')
    .eq('id', requestId)
    .single()
  if (!request) throw new Error('Request not found')

  const { data: listing } = await (supabase as any)
    .from('vehicle_listings')
    .select('seller_id')
    .eq('id', request.listing_id)
    .single()
  if (!listing || listing.seller_id !== auth.userId) {
    throw new Error('Not authorized')
  }

  const { error } = await (supabase as any)
    .from('purchase_requests')
    .update({ status })
    .eq('id', requestId)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/sales')
  revalidatePath('/dashboard/requests')
}

export async function createViewingAppointment(
  listingId: string,
  appointmentDate: string,
  location: string,
  notes?: string
) {
  const auth = await requireAuth()
  if (!auth.allowed) throw new Error('Authentication required')
  if (!auth.userId) throw new Error('User ID not found')

  const supabase = await createServerSupabaseClient()

  const { data: listing } = await (supabase as any)
    .from('vehicle_listings')
    .select('seller_id')
    .eq('id', listingId)
    .single()

  const { data, error } = await (supabase as any)
    .from('viewing_appointments')
    .insert({
      listing_id: listingId,
      requester_id: auth.userId,
      appointment_date: appointmentDate,
      location,
      notes: notes || '',
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  if (listing) {
    await createNotification(
      listing.seller_id,
      'New Viewing Request',
      'Someone wants to view your car.',
      'info',
      'listing',
      listingId,
      'طلب معاينة جديد',
      'شخص يريد معاينة سيارتك.',
    )
  }

  revalidatePath('/dashboard/viewings')
  return { id: data.id }
}

export async function getUserViewingAppointments(page = 1, pageSize = 20) {
  return safeDb(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) return { data: [], count: 0 }
    const supabase = await createServerSupabaseClient()

    const { data, count, error } = await (supabase as any)
      .from('viewing_appointments')
      .select(`
        *,
        listing:vehicle_listings(
          id, slug, price,
          vehicle:vehicles(
            id, year,
            make:car_makes(name),
            model:car_models(name),
            images:vehicle_images(*)
          )
        )
      `, { count: 'exact' })
      .eq('requester_id', auth.userId)
      .order('appointment_date', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) throw new Error(error.message)
    return { data: data || [], count: count || 0 }
  }, { data: [], count: 0 })
}

export async function getIncomingViewingAppointments(page = 1, pageSize = 20) {
  return safeDb(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) return { data: [], count: 0 }
    const supabase = await createServerSupabaseClient()

    const { data, count, error } = await (supabase as any)
      .from('viewing_appointments')
      .select(`
        *,
        requester:profiles(id, full_name, phone),
        listing:vehicle_listings!inner(
          id, slug, price,
          seller_id,
          vehicle:vehicles(
            id, year,
            make:car_makes(name),
            model:car_models(name),
            images:vehicle_images(*)
          )
        )
      `, { count: 'exact' })
      .eq('listing.seller_id', auth.userId)
      .order('appointment_date', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) throw new Error(error.message)
    return { data: data || [], count: count || 0 }
  }, { data: [], count: 0 })
}

export async function updateViewingAppointmentStatus(
  appointmentId: string,
  status: string
) {
  const auth = await requireAuth()
  if (!auth.allowed) throw new Error('Authentication required')
  const supabase = await createServerSupabaseClient()

  const { data: appointment } = await (supabase as any)
    .from('viewing_appointments')
    .select('listing_id')
    .eq('id', appointmentId)
    .single()
  if (!appointment) throw new Error('Appointment not found')

  const { data: listing } = await (supabase as any)
    .from('vehicle_listings')
    .select('seller_id')
    .eq('id', appointment.listing_id)
    .single()
  if (!listing || listing.seller_id !== auth.userId) {
    throw new Error('Not authorized')
  }

  const { error } = await (supabase as any)
    .from('viewing_appointments')
    .update({ status })
    .eq('id', appointmentId)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/viewings')
  revalidatePath('/dashboard/sales')
}
