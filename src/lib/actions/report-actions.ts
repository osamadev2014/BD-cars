'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requirePermission } from '@/server/guards'

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export interface ReportFilters {
  dateFrom?: string
  dateTo?: string
  status?: string
  cityId?: string
}

function applyDateRange(q: any, field: string, filters: ReportFilters) {
  if (filters.dateFrom) q = q.gte(field, filters.dateFrom)
  if (filters.dateTo) q = q.lte(field, filters.dateTo)
  return q
}

export async function getListingReport(filters: ReportFilters = {}) {
  const guard = await requirePermission('view_reports')
  if (!guard.allowed) return []
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any)
      .from('vehicle_listings')
      .select('id, status, price, created_at, city_id')
    q = applyDateRange(q, 'created_at', filters)
    if (filters.status) q = q.eq('status', filters.status)
    const { data } = await q.order('created_at', { ascending: false })
    return data || []
  }, [])
}

export async function getListingReportSummary(filters: ReportFilters = {}) {
  const guard = await requirePermission('view_reports')
  if (!guard.allowed) return null
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any).from('vehicle_listings').select('status', { count: 'exact' })
    q = applyDateRange(q, 'created_at', filters)
    const { data } = await q
    const all = data || []
    return {
      total: all.length,
      active: all.filter((r: any) => r.status === 'active').length,
      pending: all.filter((r: any) => r.status === 'pending' || r.status === 'submitted').length,
      sold: all.filter((r: any) => r.status === 'sold').length,
      rejected: all.filter((r: any) => r.status === 'rejected').length,
    }
  }, null)
}

export async function getInspectionRevenueReport(filters: ReportFilters = {}) {
  const guard = await requirePermission('view_reports')
  if (!guard.allowed) return []
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any)
      .from('inspection_appointments')
      .select('id, status, service_price, created_at, city_id')
    q = applyDateRange(q, 'created_at', filters)
    if (filters.status) q = q.eq('status', filters.status)
    const { data } = await q.order('created_at', { ascending: false })
    return data || []
  }, [])
}

export async function getInspectionRevenueSummary(filters: ReportFilters = {}) {
  const guard = await requirePermission('view_reports')
  if (!guard.allowed) return null
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any)
      .from('inspection_appointments')
      .select('status, service_price')
    q = applyDateRange(q, 'created_at', filters)
    const { data } = await q
    const all = data || []
    return {
      total: all.length,
      completed: all.filter((r: any) => r.status === 'completed').length,
      revenue: all.filter((r: any) => r.status === 'completed').reduce((s: number, r: any) => s + (parseFloat(r.service_price) || 0), 0),
      cancelled: all.filter((r: any) => r.status === 'cancelled').length,
    }
  }, null)
}

export async function getFinanceReport(filters: ReportFilters = {}) {
  const guard = await requirePermission('view_reports')
  if (!guard.allowed) return []
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any)
      .from('finance_requests')
      .select('id, status, requested_amount, vehicle_price, created_at')
    q = applyDateRange(q, 'created_at', filters)
    if (filters.status) q = q.eq('status', filters.status)
    const { data } = await q.order('created_at', { ascending: false })
    return data || []
  }, [])
}

export async function getSparePartsReport(filters: ReportFilters = {}) {
  const guard = await requirePermission('view_reports')
  if (!guard.allowed) return []
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any)
      .from('spare_part_orders')
      .select('id, status, grand_total, created_at')
    q = applyDateRange(q, 'created_at', filters)
    if (filters.status) q = q.eq('status', filters.status)
    const { data } = await q.order('created_at', { ascending: false })
    return data || []
  }, [])
}

export async function getWalletReport(filters: ReportFilters = {}) {
  const guard = await requirePermission('view_reports')
  if (!guard.allowed) return []
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any)
      .from('wallet_transactions')
      .select('id, type, amount, status, created_at')
    q = applyDateRange(q, 'created_at', filters)
    if (filters.status) q = q.eq('status', filters.status)
    const { data } = await q.order('created_at', { ascending: false }).limit(500)
    return data || []
  }, [])
}

export async function getWalletSummary(filters: ReportFilters = {}) {
  const guard = await requirePermission('view_reports')
  if (!guard.allowed) return null
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any)
      .from('wallet_transactions')
      .select('type, amount')
    q = applyDateRange(q, 'created_at', filters)
    const { data } = await q
    const all = data || []
    return {
      total_deposits: all.filter((r: any) => r.type === 'deposit').reduce((s: number, r: any) => s + (parseFloat(r.amount) || 0), 0),
      total_spent: all.filter((r: any) => r.type !== 'deposit').reduce((s: number, r: any) => s + (parseFloat(r.amount) || 0), 0),
      count: all.length,
    }
  }, null)
}

export async function getPurchaseRequestsReport(filters: ReportFilters = {}) {
  const guard = await requirePermission('view_reports')
  if (!guard.allowed) return []
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any)
      .from('purchase_requests')
      .select('id, status, proposed_price, created_at')
    q = applyDateRange(q, 'created_at', filters)
    if (filters.status) q = q.eq('status', filters.status)
    const { data } = await q.order('created_at', { ascending: false })
    return data || []
  }, [])
}

export async function getListingsOverTime(filters: ReportFilters = {}) {
  const guard = await requirePermission('view_reports')
  if (!guard.allowed) return []
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any)
      .from('vehicle_listings')
      .select('created_at')
    q = applyDateRange(q, 'created_at', filters)
    const { data } = await q
    const days: Record<string, number> = {}
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      days[key] = 0
    }
    ;(data || []).forEach((r: any) => {
      const key = r.created_at?.slice(0, 10)
      if (key && key in days) days[key]++
    })
    return Object.entries(days).map(([date, count]) => ({ date, count }))
  }, [])
}

export async function getInspectionRevenueOverTime(filters: ReportFilters = {}) {
  const guard = await requirePermission('view_reports')
  if (!guard.allowed) return []
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let q = (supabase as any)
      .from('inspection_appointments')
      .select('created_at, service_price')
      .not('service_price', 'is', null)
    q = applyDateRange(q, 'created_at', filters)
    const { data } = await q
    const days: Record<string, number> = {}
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      days[key] = 0
    }
    ;(data || []).forEach((r: any) => {
      const key = r.created_at?.slice(0, 10)
      if (key && key in days) days[key] += parseFloat(r.service_price) || 0
    })
    return Object.entries(days).map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 }))
  }, [])
}

export async function exportReportCsv(type: string, filters: ReportFilters = {}) {
  const guard = await requirePermission('export_reports')
  if (!guard.allowed) return null

  let rows: any[] = []
  let headers: string[] = []

  switch (type) {
    case 'listings': {
      rows = await getListingReport(filters)
      headers = ['ID', 'Status', 'Price', 'Created At', 'City ID']
      break
    }
    case 'inspections': {
      rows = await getInspectionRevenueReport(filters)
      headers = ['ID', 'Status', 'Service Price', 'Created At', 'City ID']
      break
    }
    case 'finance': {
      rows = await getFinanceReport(filters)
      headers = ['ID', 'Status', 'Requested Amount', 'Vehicle Price', 'Created At']
      break
    }
    case 'parts': {
      rows = await getSparePartsReport(filters)
      headers = ['ID', 'Status', 'Grand Total', 'Created At']
      break
    }
    case 'wallet': {
      rows = await getWalletReport(filters)
      headers = ['ID', 'Type', 'Amount', 'Status', 'Created At']
      break
    }
    case 'purchase_requests': {
      rows = await getPurchaseRequestsReport(filters)
      headers = ['ID', 'Status', 'Proposed Price', 'Created At']
      break
    }
    default: return null
  }

  const csv = [headers.join(','), ...rows.map((r: any) =>
    headers.map((h) => {
      const key = h.toLowerCase().replace(/\s+/g, '_')
      const val = r[key] ?? r[h.toLowerCase()] ?? ''
      return typeof val === 'string' && (val.includes(',') || val.includes('"')) ? `"${val.replace(/"/g, '""')}"` : val
    }).join(','))
  ].join('\n')

  return csv
}
