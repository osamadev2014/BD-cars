'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getFinancePartners(all?: boolean) {
  const supabase = await createServerSupabaseClient()
  let q = (supabase as any).from('finance_partners').select('*').order('name')
  if (!all) q = q.eq('is_active', true)
  const { data } = await q
  return (data as any[]) || []
}

export async function getAllFinanceRequests(filters?: { status?: string }) {
  const supabase = await createServerSupabaseClient()
  let q = (supabase as any)
    .from('finance_requests')
    .select('*, partner:finance_partners(name, name_ar), profiles!customer_id(full_name, phone)')
    .order('created_at', { ascending: false })
  if (filters?.status) q = q.eq('status', filters.status)
  const { data } = await q
  return (data as any[]) || []
}

export async function getFinanceRequests() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await (supabase as any)
    .from('finance_requests')
    .select('*, partner:finance_partners(name, name_ar, logo_url), listing:vehicle_listings!listing_id(*, vehicle:vehicles(*, make:car_makes(*), model:car_models(*), images:vehicle_images(*)))')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
  return (data as any[]) || []
}

export async function createFinanceRequest(listingId: string, partnerId: string, vehiclePrice: number, downPayment: number) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }
  const requestedAmount = vehiclePrice - downPayment
  const { error } = await (supabase as any)
    .from('finance_requests')
    .insert({ listing_id: listingId, customer_id: user.id, partner_id: partnerId, vehicle_price: vehiclePrice, down_payment: downPayment, requested_amount: requestedAmount })
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/finance')
  return { success: true }
}

export async function updateFinanceRequestStatus(id: string, status: string, notes?: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any).from('finance_requests').update({ status, notes: notes || null }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/finance')
  return { success: true }
}

export async function upsertFinancePartner(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const id = formData.get('id')
  const payload: any = {
    name: formData.get('name'),
    name_ar: formData.get('name_ar'),
    description: formData.get('description') || null,
    description_ar: formData.get('description_ar') || null,
    is_active: formData.get('is_active') === 'true',
    revenue_model: formData.get('revenue_model') || 'per_lead',
    revenue_per_lead: formData.get('revenue_per_lead') ? parseFloat(formData.get('revenue_per_lead') as string) : null,
    revenue_percentage: formData.get('revenue_percentage') ? parseFloat(formData.get('revenue_percentage') as string) : null,
    revenue_per_approved: formData.get('revenue_per_approved') ? parseFloat(formData.get('revenue_per_approved') as string) : null,
  }
  if (!id) {
    payload.slug = (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const { error } = await (supabase as any).from('finance_partners').insert(payload)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await (supabase as any).from('finance_partners').update(payload).eq('id', id)
    if (error) return { success: false, error: error.message }
  }
  revalidatePath('/admin/finance')
  return { success: true }
}
