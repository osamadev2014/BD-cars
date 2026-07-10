'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'
import { getVehicles } from './vehicle-actions'

type FilterParams = Record<string, string | undefined>

export async function saveSearch(name: string, filters: FilterParams, notify = false) {
  const { userId } = await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { data, error } = await (supabase as any)
    .from('saved_searches')
    .insert({
      user_id: userId,
      name,
      filters,
      notify,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/[locale]/dashboard/saved-searches')
  return data
}

export async function deleteSavedSearch(id: string) {
  const { userId } = await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { error } = await (supabase as any)
    .from('saved_searches')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/[locale]/dashboard/saved-searches')
}

export async function toggleSearchNotify(id: string, notify: boolean) {
  const { userId } = await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { error } = await (supabase as any)
    .from('saved_searches')
    .update({ notify, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/[locale]/dashboard/saved-searches')
}

export async function updateSearchName(id: string, name: string) {
  const { userId } = await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { error } = await (supabase as any)
    .from('saved_searches')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/[locale]/dashboard/saved-searches')
}

export async function getSavedSearches() {
  const { userId } = await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { data, error } = await (supabase as any)
    .from('saved_searches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  const enriched = await Promise.all(
    (data as any[]).map(async (search: any) => {
      try {
        const filters = search.filters as FilterParams
        const result = await getVehicles({
          search: filters.q,
          makeId: filters.make,
          modelId: filters.model,
          minYear: filters.min_year ? Number(filters.min_year) : undefined,
          maxYear: filters.max_year ? Number(filters.max_year) : undefined,
          minPrice: filters.min_price ? Number(filters.min_price) : undefined,
          maxPrice: filters.max_price ? Number(filters.max_price) : undefined,
          bodyTypeId: filters.body_type,
          fuelTypeId: filters.fuel_type,
          transmissionId: filters.transmission,
          conditionId: filters.condition,
          cityId: filters.city,
          sortBy: 'created_at_desc',
          pageSize: 1,
        })
        return { ...search, matchCount: result.count ?? 0 }
      } catch {
        return { ...search, matchCount: 0 }
      }
    })
  )

  return enriched
}
