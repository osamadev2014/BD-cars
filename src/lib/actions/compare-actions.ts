'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

export async function saveComparison(name: string, listingIds: string[]) {
  const { userId } = await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { data, error } = await (supabase as any)
    .from('vehicle_comparisons')
    .insert({
      user_id: userId,
      name,
      listings: listingIds,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/[locale]/dashboard/comparisons')
  return data
}

export async function getMyComparisons() {
  const { userId } = await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { data } = await (supabase as any)
    .from('vehicle_comparisons')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  return (data as any[]) || []
}

export async function deleteComparison(id: string) {
  const { userId } = await requireAuth()
  const supabase = await createServerSupabaseClient()

  await (supabase as any)
    .from('vehicle_comparisons')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  revalidatePath('/[locale]/dashboard/comparisons')
}
