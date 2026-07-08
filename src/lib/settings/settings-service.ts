import { cache } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { createAuditLog } from '@/lib/audit/audit-service'
import type { SettingCategory } from '@/types'

interface SettingRecord {
  id: string
  category: string
  key: string
  value: unknown
  type: string
  label: string
  description: string | null
  is_public: boolean
  is_dangerous: boolean
}

let settingsCache: Record<string, unknown> | null = null
let settingsFullCache: SettingRecord[] | null = null

export const getSettings = cache(async (): Promise<Record<string, unknown>> => {
  if (settingsCache) return settingsCache

  try {
    const supabase = (await createServerSupabaseClient()) as any
    const { data } = await supabase.from('app_settings').select('key, value')

    if (!data) return {}

    const settings: Record<string, unknown> = {}
    for (const row of data) {
      settings[row.key] = row.value
    }

    settingsCache = settings
    return settings
  } catch {
    return {}
  }
})

export const getSetting = cache(
  async <T = unknown>(key: string, defaultValue?: T): Promise<T | undefined> => {
    const settings = await getSettings()
    return (settings[key] as T) ?? defaultValue
  }
)

export async function getSettingsByCategory(
  category: SettingCategory
): Promise<SettingRecord[]> {
  const supabase = (await createServerSupabaseClient()) as any
  const { data } = await supabase
    .from('app_settings')
    .select('*')
    .eq('category', category)
    .order('key', { ascending: true })

  return (data as SettingRecord[]) || []
}

export async function updateSetting(
  key: string,
  value: unknown,
  userId?: string,
  ipAddress?: string
): Promise<boolean> {
  try {
    const adminClient = getAdminClient() as any

    const { data: existing } = await adminClient
      .from('app_settings')
      .select('*')
      .eq('key', key)
      .single()

    if (!existing) {
      return false
    }

    if (existing.is_dangerous) {
      if (!userId) return false
    }

    await adminClient
      .from('app_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)

    await adminClient.from('settings_history').insert({
      setting_id: existing.id,
      old_value: existing.value,
      new_value: value,
      changed_by: userId || null,
    })

    await createAuditLog({
      userId,
      action: 'settings_change',
      entityType: 'setting',
      entityId: existing.id,
      oldValues: { [key]: existing.value },
      newValues: { [key]: value },
      metadata: { setting_key: key, category: existing.category },
      ipAddress,
    })

    settingsCache = null
    settingsFullCache = null

    return true
  } catch (error) {
    console.error('Failed to update setting:', error)
    return false
  }
}

export async function getAllSettings(): Promise<SettingRecord[]> {
  if (settingsFullCache) return settingsFullCache

  const supabase = (await createServerSupabaseClient()) as any
  const { data } = await supabase
    .from('app_settings')
    .select('*')
    .order('category', { ascending: true })
    .order('key', { ascending: true })

  settingsFullCache = (data as SettingRecord[]) || []
  return settingsFullCache
}

export function clearSettingsCache() {
  settingsCache = null
  settingsFullCache = null
}

export async function isFeatureEnabled(
  featureKey: string
): Promise<boolean> {
  return (await getSetting<boolean>(`feature_${featureKey}`, false)) ?? false
}

export async function getVatPercentage(): Promise<number> {
  return (await getSetting<number>('vat_percentage', 15)) ?? 15
}
