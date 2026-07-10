'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMyWholesaleRequests() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: dealer } = await (supabase as any)
    .from('dealers')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!dealer) return []

  const { data } = await (supabase as any)
    .from('wholesale_requests')
    .select('*, items:wholesale_request_items(*), offers:wholesale_offers(count), _contracts:wholesale_contracts(count)')
    .eq('dealer_id', dealer.id)
    .order('created_at', { ascending: false })

  return (data as any[]) || []
}

export async function getAllWholesaleRequests() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('wholesale_requests')
    .select('*, dealer:dealers(*, owner:profiles!owner_id(id, full_name)), items:wholesale_request_items(*, make:car_makes(*)), offers:wholesale_offers(count)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (data as any[]) || []
}

export async function getWholesaleRequest(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('wholesale_requests')
    .select('*, dealer:dealers(*, owner:profiles!owner_id(id, full_name)), items:wholesale_request_items(*, make:car_makes(*), model:car_models(*)), offers:wholesale_offers(*, offerer:profiles!offerer_id(id, full_name, phone)), contracts:wholesale_contracts(*)')
    .eq('id', id)
    .single()

  return data || null
}

export async function createWholesaleRequest(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: dealer } = await (supabase as any)
    .from('dealers')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!dealer) return { success: false, error: 'Dealer account required' }

  const title = formData.get('title') as string
  if (!title) return { success: false, error: 'Title required' }

  const { data: request, error } = await (supabase as any)
    .from('wholesale_requests')
    .insert({
      dealer_id: dealer.id,
      requester_id: user.id,
      title,
      description: formData.get('description') || null,
      budget_min: formData.get('budget_min') ? parseFloat(formData.get('budget_min') as string) : null,
      budget_max: formData.get('budget_max') ? parseFloat(formData.get('budget_max') as string) : null,
      notes: formData.get('notes') || null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/wholesale')
  return { success: true, id: request.id }
}

export async function createWholesaleOffer(requestId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const totalPrice = parseFloat(formData.get('total_price') as string)
  if (!totalPrice) return { success: false, error: 'Total price required' }

  const { error } = await (supabase as any)
    .from('wholesale_offers')
    .insert({
      request_id: requestId,
      offerer_id: user.id,
      total_price: totalPrice,
      notes: formData.get('notes') || null,
      validity_days: parseInt(formData.get('validity_days') as string) || 7,
    })

  if (error) return { success: false, error: error.message }
  revalidatePath(`/dashboard/wholesale/${requestId}`)
  return { success: true }
}

export async function updateWholesaleStatus(requestId: string, status: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any)
    .from('wholesale_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', requestId)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/wholesale')
  return { success: true }
}
