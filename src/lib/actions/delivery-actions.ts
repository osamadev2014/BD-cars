'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getDeliveryAddresses() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await (supabase as any)
    .from('delivery_addresses')
    .select('*, city:cities(name, name_ar)')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  return (data as any[]) || []
}

export async function createDeliveryAddress(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const label = formData.get('label') as string
  const cityId = formData.get('city_id') as string
  const address = formData.get('address') as string
  const addressAr = formData.get('address_ar') as string
  const phone = formData.get('phone') as string
  const isDefault = formData.get('is_default') === 'true'

  if (!cityId || !address) return { success: false, error: 'City and address are required' }

  if (isDefault) {
    await (supabase as any)
      .from('delivery_addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { error } = await (supabase as any)
    .from('delivery_addresses')
    .insert({
      user_id: user.id,
      label,
      city_id: cityId,
      address,
      address_ar: addressAr || null,
      phone: phone || null,
      is_default: isDefault,
    })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/delivery')
  return { success: true }
}

export async function updateDeliveryAddress(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const updates: Record<string, unknown> = {}
  const label = formData.get('label')
  const address = formData.get('address')
  const addressAr = formData.get('address_ar')
  const phone = formData.get('phone')
  const isDefault = formData.get('is_default')

  if (label) updates.label = label
  if (address) updates.address = address
  if (addressAr) updates.address_ar = addressAr
  if (phone) updates.phone = phone
  if (isDefault === 'true') {
    await (supabase as any)
      .from('delivery_addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
    updates.is_default = true
  }

  const { error } = await (supabase as any)
    .from('delivery_addresses')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/delivery')
  return { success: true }
}

export async function deleteDeliveryAddress(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await (supabase as any)
    .from('delivery_addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/delivery')
  return { success: true }
}

export async function getMyDeliveryOrders() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await (supabase as any)
    .from('delivery_orders')
    .select('*, provider:delivery_providers(name, name_ar), method:delivery_methods(name, name_ar), pickup_address:delivery_addresses!pickup_address_id(*), delivery_address:delivery_addresses!delivery_address_id(*, city:cities(name, name_ar))')
    .order('created_at', { ascending: false })
    .limit(50)

  return (data as any[]) || []
}

export async function getDeliveryOrder(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await (supabase as any)
    .from('delivery_orders')
    .select('*, provider:delivery_providers(*), method:delivery_methods(*), pickup_address:delivery_addresses!pickup_address_id(*), delivery_address:delivery_addresses!delivery_address_id(*, city:cities(*)), tracking_events:delivery_tracking_events(*)')
    .eq('id', id)
    .single()

  return data || null
}

export async function getCities() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('cities')
    .select('*')
    .order('name')
  return (data as any[]) || []
}
