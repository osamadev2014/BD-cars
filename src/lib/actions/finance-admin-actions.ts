'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCoupons() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  return (data as any[]) || []
}

export async function createCoupon(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any).from('coupons').insert({
    code: (formData.get('code') as string).toUpperCase(),
    description: formData.get('description') || null,
    discount_type: formData.get('discount_type'),
    discount_value: parseFloat(formData.get('discount_value') as string),
    min_order_amount: formData.get('min_order_amount') ? parseFloat(formData.get('min_order_amount') as string) : null,
    max_uses: formData.get('max_uses') ? parseInt(formData.get('max_uses') as string) : null,
    max_uses_per_user: formData.get('max_uses_per_user') ? parseInt(formData.get('max_uses_per_user') as string) : 1,
    starts_at: formData.get('starts_at') || null,
    expires_at: formData.get('expires_at') || null,
    is_active: formData.get('is_active') === 'true',
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function toggleCoupon(id: string, isActive: boolean) {
  const supabase = await createServerSupabaseClient()
  await (supabase as any).from('coupons').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function updateCoupon(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any).from('coupons').update({
    code: (formData.get('code') as string).toUpperCase(),
    description: formData.get('description') || null,
    discount_type: formData.get('discount_type'),
    discount_value: parseFloat(formData.get('discount_value') as string),
    min_order_amount: formData.get('min_order_amount') ? parseFloat(formData.get('min_order_amount') as string) : null,
    max_uses: formData.get('max_uses') ? parseInt(formData.get('max_uses') as string) : null,
    max_uses_per_user: formData.get('max_uses_per_user') ? parseInt(formData.get('max_uses_per_user') as string) : 1,
    starts_at: formData.get('starts_at') || null,
    expires_at: formData.get('expires_at') || null,
    is_active: formData.get('is_active') === 'true',
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function deleteCoupon(id: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any).from('coupons').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function getCommissionRules() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('commission_rules')
    .select('*')
    .order('priority', { ascending: true })
    .limit(100)
  return (data as any[]) || []
}

export async function createCommissionRule(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any).from('commission_rules').insert({
    rule_type: formData.get('rule_type'),
    name: formData.get('name'),
    description: formData.get('description') || null,
    percentage: formData.get('percentage') ? parseFloat(formData.get('percentage') as string) : null,
    fixed_amount: formData.get('fixed_amount') ? parseFloat(formData.get('fixed_amount') as string) : null,
    min_amount: formData.get('min_amount') ? parseFloat(formData.get('min_amount') as string) : null,
    max_amount: formData.get('max_amount') ? parseFloat(formData.get('max_amount') as string) : null,
    applies_to: formData.get('applies_to') || 'both',
    category: formData.get('category') || null,
    priority: parseInt(formData.get('priority') as string) || 0,
    is_active: formData.get('is_active') === 'true',
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/commission')
  return { success: true }
}

export async function toggleCommissionRule(id: string, isActive: boolean) {
  const supabase = await createServerSupabaseClient()
  await (supabase as any).from('commission_rules').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/admin/commission')
  return { success: true }
}

export async function getPaymentProviders() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('payment_providers')
    .select('*')
    .order('name')
  return (data as any[]) || []
}

export async function togglePaymentProvider(id: string, isActive: boolean) {
  const supabase = await createServerSupabaseClient()
  await (supabase as any).from('payment_providers').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/admin/payments')
  return { success: true }
}
