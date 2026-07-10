'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export async function getCities() {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any).from('cities').select('id, name, name_ar').order('name')
    return data || []
  }, [])
}

export async function getBodyTypes() {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any).from('body_types').select('*').order('name')
    return data || []
  }, [])
}

export async function getFuelTypes() {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any).from('fuel_types').select('*').order('name')
    return data || []
  }, [])
}

export async function getTransmissions() {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any).from('transmission_types').select('*').order('name')
    return data || []
  }, [])
}

export async function getConditionTypes() {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any).from('vehicle_condition_types').select('*').order('name')
    return data || []
  }, [])
}

export type LookupItem = { id: string; name: string; name_ar: string }
export type BodyType = LookupItem
export type FuelType = LookupItem
export type Transmission = LookupItem
export type ConditionType = LookupItem
export type City = LookupItem
