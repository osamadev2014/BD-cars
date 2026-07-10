'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createVehicleRequest(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const makeId = formData.get('make_id') as string
  const modelId = formData.get('model_id') as string
  const makeName = formData.get('make_name') as string
  const modelName = formData.get('model_name') as string
  const yearFrom = formData.get('year_from') ? parseInt(formData.get('year_from') as string) : null
  const yearTo = formData.get('year_to') ? parseInt(formData.get('year_to') as string) : null
  const budgetMin = formData.get('budget_min') ? parseFloat(formData.get('budget_min') as string) : null
  const budgetMax = formData.get('budget_max') ? parseFloat(formData.get('budget_max') as string) : null
  const bodyTypeId = formData.get('body_type_id') as string
  const notes = formData.get('notes') as string

  const { error } = await (supabase as any)
    .from('vehicle_requests')
    .insert({
      user_id: user.id,
      make_id: makeId || null,
      model_id: modelId || null,
      make_name: makeName || null,
      model_name: modelName || null,
      year_from: yearFrom,
      year_to: yearTo,
      budget_min: budgetMin,
      budget_max: budgetMax,
      body_type_id: bodyTypeId || null,
      notes: notes || null,
    })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/requests')
  return { success: true }
}

export async function getMyVehicleRequests() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await (supabase as any)
    .from('vehicle_requests')
    .select('*, make:car_makes(*), model:car_models(*), body_type:body_types(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (data as any[]) || []
}

export async function getAllVehicleRequests() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('vehicle_requests')
    .select('*, make:car_makes(*), model:car_models(*), body_type:body_types(*), customer:profiles!user_id(id, full_name, phone)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (data as any[]) || []
}

export async function updateVehicleRequestStatus(id: string, status: string, adminNotes?: string) {
  const supabase = await createServerSupabaseClient()
  const updates: any = { status, updated_at: new Date().toISOString() }
  if (adminNotes !== undefined) updates.admin_notes = adminNotes

  const { error } = await (supabase as any)
    .from('vehicle_requests')
    .update(updates)
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/vehicle-requests')
  return { success: true }
}

export async function getBodyTypes() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('body_types')
    .select('*')
    .order('name')
  return (data as any[]) || []
}
