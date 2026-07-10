'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export async function createPartRequest(formData: FormData) {
  const user = await requireAuth()
  if (!user.allowed) return { success: false, error: user.error! }

  const supabase = await createServerSupabaseClient()
  const { data, error } = await (supabase as any).from('spare_part_requests').insert({
        customer_id: user.userId!,
    make: formData.get('make') || null,
    model: formData.get('model') || null,
    year: formData.get('year') ? parseInt(formData.get('year') as string) : null,
    trim: formData.get('trim') || null,
    part_name: formData.get('part_name'),
    category_id: formData.get('category_id') || null,
    part_number: formData.get('part_number') || null,
    oem_number: formData.get('oem_number') || null,
    description: formData.get('description') || null,
    urgency: formData.get('urgency') || 'normal',
    city_id: formData.get('city_id') || null,
    budget_min: formData.get('budget_min') ? parseFloat(formData.get('budget_min') as string) : null,
    budget_max: formData.get('budget_max') ? parseFloat(formData.get('budget_max') as string) : null,
  }).select().single()

  if (error) return { success: false, error: error.message }
  revalidatePath('/part-requests')
  return { success: true, data }
}

export async function getMyPartRequests() {
  const user = await requireAuth()
  if (!user.allowed) return []

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('spare_part_requests')
      .select('*')
      .eq('customer_id', user.userId!)
      .order('created_at', { ascending: false })
    return data || []
  }, [])
}

export async function getPartRequestDetail(id: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('spare_part_requests')
      .select('*, spare_part_quotes(*, spare_part_suppliers(name, name_ar))')
      .eq('id', id)
      .single()
    return data || null
  }, null)
}

export async function getAllPartRequests(filters?: { status?: string }) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let query = (supabase as any)
      .from('spare_part_requests')
      .select('*, profiles!customer_id(full_name, phone)')
      .order('created_at', { ascending: false })
    if (filters?.status) query = query.eq('status', filters.status)
    const { data } = await query
    return data || []
  }, [])
}

export async function createPartQuote(formData: FormData) {
  const user = await requireAuth()
  if (!user.allowed) return { success: false, error: user.error! }

  const supabase = await createServerSupabaseClient()
  const price = parseFloat(formData.get('price') as string)
  const deliveryFee = parseFloat(formData.get('delivery_fee') as string) || 0
  const { data, error } = await (supabase as any).from('spare_part_quotes').insert({
    request_id: formData.get('request_id'),
    supplier_id: formData.get('supplier_id') || null,
    quoted_by: user.userId!,
    price,
    delivery_fee: deliveryFee,
    total_price: price + deliveryFee,
    availability: formData.get('availability') || null,
    estimated_delivery_days: formData.get('estimated_delivery_days') ? parseInt(formData.get('estimated_delivery_days') as string) : null,
    warranty_months: formData.get('warranty_months') ? parseInt(formData.get('warranty_months') as string) : null,
    notes: formData.get('notes') || null,
    valid_until: formData.get('valid_until') || null,
  }).select().single()

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/spare-parts')
  revalidatePath('/dashboard/part-requests')
  return { success: true, data }
}

export async function updatePartQuoteStatus(quoteId: string, status: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any).from('spare_part_quotes').update({ status }).eq('id', quoteId)
  if (error) return { success: false, error: error.message }

  if (status === 'accepted') {
    const user = await requireAuth()
    if (!user.allowed) return { success: false, error: 'Unauthorized' }
    const { data: quote } = await (supabase as any).from('spare_part_quotes').select('*').eq('id', quoteId).single()
    if (quote) {
      await (supabase as any).from('spare_part_orders').insert({
        request_id: quote.request_id,
        quote_id: quote.id,
    customer_id: user.userId!,
        supplier_id: quote.supplier_id,
        total_amount: quote.total_price - (quote.delivery_fee || 0),
        delivery_fee: quote.delivery_fee,
        vat_amount: 0,
        grand_total: quote.total_price,
      })
    }
  }
  revalidatePath('/dashboard/part-requests')
  revalidatePath('/dashboard/part-orders')
  revalidatePath('/admin/spare-parts')
  return { success: true }
}

export async function getMyPartOrders() {
  const user = await requireAuth()
  if (!user.allowed) return []

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('spare_part_orders')
      .select('*')
      .eq('customer_id', user.userId!)
      .order('created_at', { ascending: false })
    return data || []
  }, [])
}

export async function getPartOrderDetail(id: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('spare_part_orders')
      .select('*, spare_part_order_items(*), spare_part_suppliers(name, name_ar)')
      .eq('id', id)
      .single()
    return data || null
  }, null)
}

export async function getAllPartOrders(filters?: { status?: string }) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let query = (supabase as any)
      .from('spare_part_orders')
      .select('*, profiles!customer_id(full_name, phone)')
      .order('created_at', { ascending: false })
    if (filters?.status) query = query.eq('status', filters.status)
    const { data } = await query
    return data || []
  }, [])
}

export async function updatePartOrderStatus(orderId: string, status: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any).from('spare_part_orders').update({ status }).eq('id', orderId)
  if (error) return { success: false, error: error.message }

  await (supabase as any).from('spare_part_status_history').insert({
    order_id: orderId,
    status,
    changed_by: (await requireAuth()).userId,
  })

  revalidatePath('/admin/spare-parts')
  revalidatePath('/dashboard/part-orders')
  return { success: true }
}

export async function getPartSuppliers() {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('spare_part_suppliers')
      .select('*')
      .order('name')
    return data || []
  }, [])
}

export async function upsertPartSupplier(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const id = formData.get('id')
  const payload: any = {
    name: formData.get('name'),
    name_ar: formData.get('name_ar') || null,
    description: formData.get('description') || null,
    description_ar: formData.get('description_ar') || null,
    phone: formData.get('phone') || null,
    email: formData.get('email') || null,
    city_id: formData.get('city_id') || null,
    is_active: formData.get('is_active') === 'true',
  }
  if (!id) {
    payload.slug = (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const { error } = await (supabase as any).from('spare_part_suppliers').insert(payload)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await (supabase as any).from('spare_part_suppliers').update(payload).eq('id', id)
    if (error) return { success: false, error: error.message }
  }
  revalidatePath('/admin/spare-parts')
  return { success: true }
}

export async function getCities() {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('cities')
      .select('id, name, name_ar')
      .order('name')
    return data || []
  }, [])
}
