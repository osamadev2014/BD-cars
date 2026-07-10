'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function getMyInvoices(page = 1, perPage = 20) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { invoices: [], total: 0 }

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, count } = await (supabase as any)
    .from('invoices')
    .select('*, invoice_items(*)', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  return { invoices: (data as any[]) || [], total: count || 0 }
}
