'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function getWallet() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  let { data: wallet } = await (supabase as any)
    .from('wallet_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!wallet) {
    const { data: newWallet } = await (supabase as any)
      .from('wallet_accounts')
      .insert({ user_id: user.id, balance: 0, currency: 'SAR' })
      .select()
      .single()
    wallet = newWallet
  }

  return wallet as any
}

export async function getWalletTransactions(page = 1, perPage = 20) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { transactions: [], total: 0 }

  const wallet = await getWallet()
  if (!wallet) return { transactions: [], total: 0 }

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, count } = await (supabase as any)
    .from('wallet_transactions')
    .select('*', { count: 'exact' })
    .eq('wallet_id', wallet.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  return { transactions: (data as any[]) || [], total: count || 0 }
}

export async function topUpWallet(amount: number) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const admin = getAdminClient() as any

  const { data: wallet } = await admin
    .from('wallet_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!wallet) return { success: false, error: 'Wallet not found' }

  const newBalance = (wallet.balance || 0) + amount

  const { error: walletErr } = await admin
    .from('wallet_accounts')
    .update({ balance: newBalance })
    .eq('id', wallet.id)

  if (walletErr) return { success: false, error: walletErr.message }

  const { error: txErr } = await admin
    .from('wallet_transactions')
    .insert({
      wallet_id: wallet.id,
      transaction_type: 'credit',
      amount,
      balance_before: wallet.balance,
      balance_after: newBalance,
      reference_type: 'wallet_topup',
      description: 'Wallet top-up',
    })

  if (txErr) return { success: false, error: txErr.message }

  return { success: true, balance: newBalance }
}
