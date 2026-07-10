'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAllCrmCustomers() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('profiles')
    .select('*, crm:crm_customers(*), listings_count:vehicle_listings(count), role:user_roles(role)')
    .order('created_at', { ascending: false })
    .limit(100)
  return (data as any[]) || []
}

export async function getCrmCustomerDetail(userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('*, crm:crm_customers(*), role:user_roles(role)')
    .eq('id', userId)
    .single()

  if (!profile) return null

  // Auto-create CRM record if not exists
  const { data: crm } = await (supabase as any)
    .from('crm_customers')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!crm) {
    const { data: newCrm } = await (supabase as any)
      .from('crm_customers')
      .insert({ user_id: userId })
      .select()
      .single()
    profile.crm = newCrm
  } else {
    profile.crm = crm
  }

  // Get timeline
  const { data: timeline } = await (supabase as any)
    .from('customer_timeline')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  profile.timeline = timeline || []

  // Get notes
  const { data: notes } = await (supabase as any)
    .from('customer_notes')
    .select('*, author:profiles!added_by(id, full_name)')
    .eq('customer_id', profile.crm?.id || '')
    .order('created_at', { ascending: false })
    .limit(50)

  profile.notes = notes || []

  // Get listings
  const { data: listings } = await (supabase as any)
    .from('vehicle_listings')
    .select('*, vehicle:vehicles(*, make:makes(*), model:models(*), images:vehicle_images(*))')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  profile.listings = listings || []

  // Get tickets
  const { data: tickets } = await (supabase as any)
    .from('support_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  profile.tickets = tickets || []

  return profile
}

export async function addCrmNote(customerId: string, content: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await (supabase as any)
    .from('customer_notes')
    .insert({ customer_id: customerId, added_by: user.id, content })

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/crm')
  return { success: true }
}

export async function updateCrmTags(userId: string, tags: string[]) {
  const supabase = await createServerSupabaseClient()
  const { data: crm } = await (supabase as any)
    .from('crm_customers')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!crm) return { success: false, error: 'CRM record not found' }

  const { error } = await (supabase as any)
    .from('crm_customers')
    .update({ tags })
    .eq('id', crm.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/crm')
  return { success: true }
}

export async function getAuditLog() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('customer_timeline')
    .select('*, user:profiles!user_id(id, full_name)')
    .order('created_at', { ascending: false })
    .limit(200)
  return (data as any[]) || []
}
