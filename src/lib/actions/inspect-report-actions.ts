'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export async function createInspectionReport(appointmentId: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()

    const { data: appointment } = await (supabase as any)
      .from('inspection_appointments')
      .select('*, center:inspection_centers(*)')
      .eq('id', appointmentId)
      .single()

    if (!appointment) return { success: false, error: 'appointment_not_found' }
    if (appointment.status !== 'confirmed' && appointment.status !== 'in_progress') return { success: false, error: 'invalid_status' }

    const { data: report, error } = await (supabase as any)
      .from('inspection_reports')
      .insert({
        appointment_id: appointmentId,
        listing_id: appointment.listing_id,
        vehicle_id: appointment.vehicle_id,
        inspector_id: auth.userId,
        status: 'in_progress',
        share_token: crypto.randomUUID().replace(/-/g, '').slice(0, 12),
      })
      .select()
      .single()

    if (error) return { success: false, error: error.message }

    await (supabase as any)
      .from('inspection_appointments')
      .update({ status: 'in_progress' })
      .eq('id', appointmentId)

    const sections = [
      { name: 'Exterior', name_ar: 'الهيكل الخارجي', slug: 'exterior', sort_order: 1 },
      { name: 'Interior', name_ar: 'المقصورة الداخلية', slug: 'interior', sort_order: 2 },
      { name: 'Engine', name_ar: 'المحرك', slug: 'engine', sort_order: 3 },
      { name: 'Transmission', name_ar: 'ناقل الحركة', slug: 'transmission', sort_order: 4 },
      { name: 'Suspension', name_ar: 'التعليق', slug: 'suspension', sort_order: 5 },
      { name: 'Brakes', name_ar: 'الفرامل', slug: 'brakes', sort_order: 6 },
      { name: 'Electrical', name_ar: 'النظام الكهربائي', slug: 'electrical', sort_order: 7 },
      { name: 'AC & Heating', name_ar: 'التكييف والتدفئة', slug: 'ac_heating', sort_order: 8 },
      { name: 'Tires & Wheels', name_ar: 'الإطارات والعجلات', slug: 'tires_wheels', sort_order: 9 },
      { name: 'Underbody', name_ar: 'أسفل السيارة', slug: 'underbody', sort_order: 10 },
      { name: 'Test Drive', name_ar: 'تجربة القيادة', slug: 'test_drive', sort_order: 11 },
    ]

    const sectionRecords = sections.map(s => ({ ...s, report_id: report.id, max_score: 10 }))
    await (supabase as any).from('inspection_report_sections').insert(sectionRecords)

    revalidatePath('/dashboard/inspections')
    return { success: true, data: report }
  }, { success: false, error: 'service_unavailable' })
}

export async function getInspectionReport(reportId: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('inspection_reports')
      .select(`
        *,
        appointment:inspection_appointments(*, center:inspection_centers(*), branch:inspection_center_branches(*), service:inspection_services(*)),
        vehicle:vehicles(*, make:car_makes(*), model:car_models(*), body_type:body_types(*), fuel_type:fuel_types(*), color:car_colors(*), images:vehicle_images(*)),
        sections:inspection_report_sections(
          *,
          items:inspection_report_items(*)
        ),
        defects:inspection_defects(*)
      `)
      .eq('id', reportId)
      .single()
    return data || null
  }, null)
}

export async function getInspectionReportByShareToken(token: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('inspection_reports')
      .select(`
        *,
        appointment:inspection_appointments(*, center:inspection_centers(*), service:inspection_services(*)),
        vehicle:vehicles(*, make:car_makes(*), model:car_models(*), body_type:body_types(*), fuel_type:fuel_types(*), transmission:transmission_types(*), drivetrain:drivetrain_types(*), color:car_colors(*), images:vehicle_images(*)),
        sections:inspection_report_sections(
          *,
          items:inspection_report_items(order by sort_order)
        ),
        defects:inspection_defects(*)
      `)
      .eq('share_token', token)
      .eq('is_public', true)
      .single()
    return data || null
  }, null)
}

export async function updateSectionScore(sectionId: string, score: number) {
  try {
    const supabase = await createServerSupabaseClient()
    await (supabase as any).from('inspection_report_sections').update({ score }).eq('id', sectionId)
    return { success: true } as const
  } catch {
    return { success: false } as const
  }
}

export async function addReportItem(sectionId: string, formData: FormData) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await (supabase as any).from('inspection_report_items').insert({
      section_id: sectionId,
      name: formData.get('name'),
      name_ar: formData.get('name_ar') || formData.get('name'),
      status: formData.get('status') || 'good',
      score: formData.get('score') ? parseInt(formData.get('score') as string) : null,
      notes: formData.get('notes') || null,
      notes_ar: formData.get('notes_ar') || null,
      severity: formData.get('severity') || null,
      estimated_repair_cost: formData.get('estimated_repair_cost') ? parseFloat(formData.get('estimated_repair_cost') as string) : null,
    }).select().single()
    if (error) return { success: false, error: error.message }
    return { success: true, data }
  }, { success: false, data: null } as const)
}

export async function addReportDefect(reportId: string, formData: FormData) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await (supabase as any).from('inspection_defects').insert({
      report_id: reportId,
      item_id: formData.get('item_id') || null,
      name: formData.get('name'),
      name_ar: formData.get('name_ar') || formData.get('name'),
      severity: formData.get('severity') || 'minor',
      description: formData.get('description') || null,
      description_ar: formData.get('description_ar') || null,
      estimated_repair_cost: formData.get('estimated_repair_cost') ? parseFloat(formData.get('estimated_repair_cost') as string) : null,
    }).select().single()
    if (error) return { success: false, error: error.message }
    return { success: true, data }
  }, { success: false, data: null })
}

export async function submitReportForApproval(reportId: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data: sections } = await (supabase as any)
      .from('inspection_report_sections')
      .select('score, max_score')
      .eq('report_id', reportId)

    const totalScore = sections?.reduce((sum: number, s: any) => sum + (s.score || 0), 0) || 0
    const totalMax = sections?.reduce((sum: number, s: any) => sum + s.max_score, 0) || 1
    const overallScore = Math.round((totalScore / totalMax) * 100)

    await (supabase as any)
      .from('inspection_reports')
      .update({ status: 'pending_approval', score: overallScore })
      .eq('id', reportId)

    await (supabase as any)
      .from('inspection_status_history')
      .insert({ report_id: reportId, status: 'pending_approval' })

    revalidatePath('/admin/inspections')
    return { success: true }
  }, { success: false })
}

export async function approveReport(reportId: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()

    const { data: report } = await (supabase as any)
      .from('inspection_reports')
      .select('appointment_id')
      .eq('id', reportId)
      .single()

    await (supabase as any)
      .from('inspection_reports')
      .update({ status: 'approved', admin_approved: true, approved_by: auth.userId, approved_at: new Date().toISOString(), is_public: true })
      .eq('id', reportId)

    await (supabase as any)
      .from('inspection_report_approval_history')
      .insert({ report_id: reportId, action: 'approved', performed_by: auth.userId })

    if (report?.appointment_id) {
      await (supabase as any)
        .from('inspection_appointments')
        .update({ status: 'completed' })
        .eq('id', report.appointment_id)
    }

    revalidatePath('/admin/inspections')
    return { success: true }
  }, { success: false })
}

export async function rejectReport(reportId: string, notes?: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    await (supabase as any)
      .from('inspection_reports')
      .update({ status: 'rejected' })
      .eq('id', reportId)

    await (supabase as any)
      .from('inspection_report_approval_history')
      .insert({ report_id: reportId, action: 'rejected', performed_by: auth.userId, notes: notes || null })

    revalidatePath('/admin/inspections')
    return { success: true }
  }, { success: false })
}

export async function getAllAppointments(status?: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any)
      .from('inspection_appointments')
      .select('*, center:inspection_centers(*), branch:inspection_center_branches(*), service:inspection_services(*), customer:profiles!customer_id(id, full_name, phone), report:inspection_reports(*)')
      .order('appointment_date', { ascending: false })
      .limit(100)
    if (status) q = q.eq('status', status)
    const { data } = await q
    return data || []
  }, [])
}

export async function getAllInspectionCenters() {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('inspection_centers')
      .select('*, city:cities(*), branches:inspection_center_branches(count), pricing:inspection_service_pricing(*)')
      .order('name')
    return data || []
  }, [])
}

export async function upsertInspectionCenter(formData: FormData) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const id = formData.get('id')
    const payload: any = {
      name: formData.get('name'),
      name_ar: formData.get('name_ar') || formData.get('name'),
      description: formData.get('description') || null,
      description_ar: formData.get('description_ar') || null,
      phone: formData.get('phone') || null,
      email: formData.get('email') || null,
      city_id: formData.get('city_id') || null,
      address: formData.get('address') || null,
      address_ar: formData.get('address_ar') || null,
      is_active: formData.get('is_active') === 'true',
      revenue_share_percentage: formData.get('revenue_share_percentage') ? parseFloat(formData.get('revenue_share_percentage') as string) : 80,
    }

    if (id && id !== 'new') {
      await (supabase as any).from('inspection_centers').update(payload).eq('id', id)
    } else {
      payload.slug = (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
      await (supabase as any).from('inspection_centers').insert(payload)
    }

    revalidatePath('/admin/inspections')
    return { success: true }
  }, { success: false })
}

export async function getInspectorAppointments() {
  const auth = await requireAuth()
  if (!auth.allowed) return []

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data: centers } = await (supabase as any)
      .from('inspection_center_users')
      .select('center_id')
      .eq('user_id', auth.userId)
    const centerIds = centers?.map((c: any) => c.center_id) || []

    if (centerIds.length === 0) return []

    const { data } = await (supabase as any)
      .from('inspection_appointments')
      .select('*, center:inspection_centers(*), branch:inspection_center_branches(*), service:inspection_services(*), customer:profiles!customer_id(id, full_name, phone), report:inspection_reports(*)')
      .in('center_id', centerIds)
      .order('appointment_date', { ascending: false })
      .limit(50)

    return data || []
  }, [])
}
