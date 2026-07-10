'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

export interface CouponValidation {
  valid: boolean
  coupon?: {
    id: string
    code: string
    discount_type: 'percentage' | 'fixed'
    discount_value: number
    description: string | null
  }
  discount_amount?: number
  error?: string
}

export async function validateCoupon(code: string, orderAmount: number): Promise<CouponValidation> {
  const supabase = await createServerSupabaseClient()

  const { data: coupon, error } = await (supabase as any)
    .from('coupons')
    .select('*')
    .ilike('code', code.trim())
    .maybeSingle()

  if (error || !coupon) {
    return { valid: false, error: 'Invalid coupon code' }
  }

  if (!coupon.is_active) {
    return { valid: false, error: 'This coupon is no longer active' }
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, error: 'This coupon has expired' }
  }

  if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
    return { valid: false, error: 'This coupon is not yet valid' }
  }

  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return { valid: false, error: 'This coupon has reached its usage limit' }
  }

  if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
    return { valid: false, error: `Minimum order amount of ${coupon.min_order_amount} SAR required` }
  }

  const discountAmount = coupon.discount_type === 'percentage'
    ? Math.round(orderAmount * (coupon.discount_value / 100) * 100) / 100
    : Math.min(coupon.discount_value, orderAmount)

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      description: coupon.description,
    },
    discount_amount: discountAmount,
  }
}

export async function redeemCoupon(code: string, orderAmount: number) {
  const { userId } = await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { data: coupon, error } = await (supabase as any)
    .from('coupons')
    .select('*')
    .ilike('code', code.trim())
    .maybeSingle()

  if (error || !coupon) {
    return { success: false, error: 'Invalid coupon code' }
  }

  if (!coupon.is_active) {
    return { success: false, error: 'This coupon is no longer active' }
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { success: false, error: 'This coupon has expired' }
  }

  if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
    return { success: false, error: 'This coupon is not yet valid' }
  }

  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return { success: false, error: 'This coupon has reached its usage limit' }
  }

  if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
    return { success: false, error: `Minimum order amount of ${coupon.min_order_amount} SAR required` }
  }

  const { count: userRedemptions } = await (supabase as any)
    .from('coupon_redemptions')
    .select('*', { count: 'exact', head: true })
    .eq('coupon_id', coupon.id)
    .eq('user_id', userId)

  if (userRedemptions && coupon.max_uses_per_user && userRedemptions >= coupon.max_uses_per_user) {
    return { success: false, error: 'You have already used this coupon the maximum number of times' }
  }

  const discountAmount = coupon.discount_type === 'percentage'
    ? Math.round(orderAmount * (coupon.discount_value / 100) * 100) / 100
    : Math.min(coupon.discount_value, orderAmount)

  const adminClient = getAdminClient()

  const { error: redemptionError } = await (adminClient as any)
    .from('coupon_redemptions')
    .insert({
      coupon_id: coupon.id,
      user_id: userId,
      discount_amount: discountAmount,
    })

  if (redemptionError) {
    return { success: false, error: 'Failed to apply coupon' }
  }

  await (adminClient as any)
    .from('coupons')
    .update({ used_count: (coupon.used_count || 0) + 1 })
    .eq('id', coupon.id)

  revalidatePath('/[locale]/dashboard/coupons')
  return { success: true, discount_amount: discountAmount }
}

export async function getMyRedemptions() {
  const { userId } = await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { data } = await (supabase as any)
    .from('coupon_redemptions')
    .select('*, coupon:coupons!inner(code, discount_type, discount_value, description)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  return (data as any[]) || []
}
