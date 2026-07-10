'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { isStripeConfigured, createPaymentIntent } from '@/lib/payments/stripe'
import { revalidatePath } from 'next/cache'

export async function createTopUpIntent(amount: number) {
  if (!isStripeConfigured()) return { success: false, error: 'PAYMENT_NOT_CONFIGURED' }
  if (amount < 10) return { success: false, error: 'MIN_AMOUNT' }

  const auth = await requireAuth()
  if (!auth.allowed || !auth.userId) return { success: false, error: 'Unauthorized' }

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const intent = await createPaymentIntent(amount, 'sar', {
      user_id: auth.userId,
      purpose: 'wallet_topup',
    })

    const { error: txError } = await (supabase as any)
      .from('payment_transactions')
      .insert({
        user_id: auth.userId,
        amount,
        total_amount: amount,
        currency: 'SAR',
        status: 'pending',
        reference_id: intent.id,
        entity_type: 'wallet_topup',
        description: `Wallet top-up of ${amount} SAR`,
      })

    if (txError) return { success: false, error: txError.message }

    return { success: true, clientSecret: intent.client_secret, intentId: intent.id }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function confirmWalletTopUp(paymentIntentId: string) {
  const auth = await requireAuth()
  if (!auth.allowed || !auth.userId) return { success: false, error: 'Unauthorized' }

  const supabase = await createServerSupabaseClient()

  const { data: tx } = await (supabase as any)
    .from('payment_transactions')
    .select('*')
    .eq('reference_id', paymentIntentId)
    .single()

  if (!tx) return { success: false, error: 'Transaction not found' }
  if (tx.status === 'completed') return { success: true }

  const { data: wallet } = await (supabase as any)
    .from('wallet_accounts')
    .select('*')
    .eq('user_id', auth.userId)
    .single()

  if (!wallet) return { success: false, error: 'Wallet not found' }

  const newBalance = (wallet.balance || 0) + tx.amount

  const { error: walletError } = await (supabase as any)
    .from('wallet_accounts')
    .update({ balance: newBalance })
    .eq('id', wallet.id)

  if (walletError) return { success: false, error: walletError.message }

  await (supabase as any).from('wallet_transactions').insert({
    wallet_id: wallet.id,
    transaction_type: 'credit',
    amount: tx.amount,
    balance_before: wallet.balance || 0,
    balance_after: newBalance,
    reference_type: 'wallet_topup',
    reference_id: paymentIntentId,
    description: `Wallet top-up via card`,
  })

  await (supabase as any)
    .from('payment_transactions')
    .update({ status: 'completed' })
    .eq('id', tx.id)

  await (supabase as any).from('payment_status_history').insert({
    transaction_id: tx.id,
    status: 'completed',
    notes: 'Payment confirmed via webhook',
  })

  revalidatePath('/dashboard/wallet')
  return { success: true, balance: newBalance }
}

export async function createSubscriptionIntent(planId: string) {
  if (!isStripeConfigured()) return { success: false, error: 'PAYMENT_NOT_CONFIGURED' }

  const auth = await requireAuth()
  if (!auth.allowed || !auth.userId) return { success: false, error: 'Unauthorized' }

  const supabase = await createServerSupabaseClient()

  const { data: plan } = await (supabase as any)
    .from('dealer_subscription_plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (!plan) return { success: false, error: 'Plan not found' }
  if (plan.price_monthly === 0) return { success: false, error: 'FREE_PLAN' }

  try {
    const intent = await createPaymentIntent(plan.price_monthly, 'sar', {
      user_id: auth.userId,
      purpose: 'subscription',
      plan_id: planId,
    })

    const { error: txError } = await (supabase as any)
      .from('payment_transactions')
      .insert({
        user_id: auth.userId,
        amount: plan.price_monthly,
        total_amount: plan.price_monthly,
        currency: 'SAR',
        status: 'pending',
        reference_id: intent.id,
        entity_type: 'subscription',
        entity_id: planId,
        description: `Subscription to ${plan.name}`,
      })

    if (txError) return { success: false, error: txError.message }

    return { success: true, clientSecret: intent.client_secret, intentId: intent.id }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
