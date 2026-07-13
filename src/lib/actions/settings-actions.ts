'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requirePermission } from '@/server/guards'
import { updateSetting, clearSettingsCache } from '@/lib/settings/settings-service'

export async function getAppSettings() {
  const supabase = (await createServerSupabaseClient()) as any
  const { data } = await supabase
    .from('app_settings')
    .select('*')
    .order('category', { ascending: true })
    .order('key', { ascending: true })
  return (data || []) as Array<{
    id: string
    category: string
    key: string
    value: unknown
    type: string
    label: string
    description: string | null
    is_public: boolean
    is_dangerous: boolean
  }>
}

export async function updateAppSetting(key: string, value: string) {
  const guard = await requirePermission('edit_settings')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const success = await updateSetting(key, value, guard.userId)
  if (!success) throw new Error('Failed to update setting')
  clearSettingsCache()
}

export async function getAdminMetrics() {
  const guard = await requirePermission('view_dashboard')
  if (!guard.allowed) return null

  const supabase = (await createServerSupabaseClient()) as any

  const [
    { count: totalListings },
    { count: pendingListings },
    { count: totalUsers },
    { count: totalDealers },
  ] = await Promise.all([
    (supabase.from('vehicle_listings').select('*', { count: 'exact', head: true })),
    (supabase.from('listing_approval_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')),
    (supabase.from('profiles').select('*', { count: 'exact', head: true })),
    (supabase.from('dealers').select('*', { count: 'exact', head: true })),
  ])

  return {
    totalListings: totalListings || 0,
    pendingListings: pendingListings || 0,
    totalUsers: totalUsers || 0,
    totalDealers: totalDealers || 0,
  }
}
