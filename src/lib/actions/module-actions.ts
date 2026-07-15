'use server'

import { requireAuth } from '@/server/guards'
import { getAdminClient } from '@/lib/supabase/admin'

export interface ModuleData {
  columns: string[]
  rows: Record<string, any>[]
  total: number
}

export async function getDealerInventory(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: listings, count } = await admin
    .from('vehicle_listings')
    .select(`
      id, title, price, status, created_at, updated_at,
      vehicles!inner(make, model, year, trim)
    `, { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = (listings || []).map((l: any) => ({
    id: l.id,
    vehicle: `${l.vehicles?.make || ''} ${l.vehicles?.model || ''} ${l.vehicles?.year || ''}`.trim(),
    price: l.price ? `${Number(l.price).toLocaleString()} SAR` : '—',
    status: l.status,
    created_at: l.created_at,
  }))

  return {
    columns: ['vehicle', 'price', 'status', 'created_at'],
    rows,
    total: count || 0,
  }
}

export async function getDealerCustomers(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: dealer } = await admin
    .from('dealers')
    .select('id')
    .eq('org_id', orgId)
    .maybeSingle()

  if (!dealer) return { columns: [], rows: [], total: 0 }

  const { data: ratings, count } = await admin
    .from('dealer_ratings')
    .select(`
      id, rating, review, created_at,
      profiles!inner(full_name, phone)
    `, { count: 'exact' })
    .eq('dealer_id', dealer.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = (ratings || []).map((r: any) => ({
    id: r.id,
    customer: r.profiles?.full_name || '—',
    phone: r.profiles?.phone || '—',
    rating: r.rating,
    review: r.review?.slice(0, 60) || '—',
    date: r.created_at,
  }))

  return {
    columns: ['customer', 'phone', 'rating', 'review', 'date'],
    rows,
    total: count || 0,
  }
}

export async function getDealerSales(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: listings, count } = await admin
    .from('vehicle_listings')
    .select(`
      id, title, price, status, created_at, updated_at,
      vehicles!inner(make, model, year, trim)
    `, { count: 'exact' })
    .eq('org_id', orgId)
    .eq('status', 'sold')
    .order('updated_at', { ascending: false })
    .limit(50)

  const rows = (listings || []).map((l: any) => ({
    id: l.id,
    vehicle: `${l.vehicles?.make || ''} ${l.vehicles?.model || ''} ${l.vehicles?.year || ''}`.trim(),
    price: l.price ? `${Number(l.price).toLocaleString()} SAR` : '—',
    sold_date: l.updated_at,
  }))

  return {
    columns: ['vehicle', 'price', 'sold_date'],
    rows,
    total: count || 0,
  }
}

export async function getDealerPurchaseRequests(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: listings } = await admin
    .from('vehicle_listings')
    .select('id, title')
    .eq('org_id', orgId)

  if (!listings?.length) return { columns: [], rows: [], total: 0 }

  const listingTitles = Object.fromEntries(
    (listings as any[]).map((l: any) => [l.id, l.title])
  )
  const listingIds = (listings as any[]).map((l: any) => l.id)

  const { data: requests, count } = await admin
    .from('purchase_requests')
    .select(`
      id, listing_id, status, proposed_price, created_at,
      profiles!buyer_id(full_name)
    `, { count: 'exact' })
    .in('listing_id', listingIds)
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = ((requests as any[]) || []).map((r: any) => ({
    id: r.id,
    title: listingTitles[r.listing_id] || '—',
    customer_name: r.profiles?.full_name || '—',
    budget_min: r.proposed_price ? Number(r.proposed_price).toLocaleString() + ' SAR' : '—',
    budget_max: '—',
    status: r.status,
    created_at: r.created_at,
  }))

  return {
    columns: ['title', 'customer_name', 'budget_min', 'budget_max', 'status', 'created_at'],
    rows,
    total: count || 0,
  }
}

export async function getDealerQuotations(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: dealers } = await admin
    .from('dealers')
    .select('id')
    .eq('org_id', orgId)

  if (!dealers?.length) return { columns: [], rows: [], total: 0 }

  const dealerIds = (dealers as any[]).map((d: any) => d.id)

  const { data: offers, count } = await admin
    .from('request_offers')
    .select(`
      id, status, created_at, updated_at,
      customer_vehicle_requests!request_id(description, budget_min, budget_max)
    `, { count: 'exact' })
    .in('dealer_id', dealerIds)
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = ((offers as any[]) || []).map((r: any) => ({
    id: r.id,
    title: r.customer_vehicle_requests?.description?.slice(0, 60) || '—',
    amount: '—',
    status: r.status,
    valid_until: '—',
    created_at: r.created_at,
  }))

  return {
    columns: ['title', 'amount', 'status', 'valid_until', 'created_at'],
    rows,
    total: count || 0,
  }
}

export async function getDealerInvoices(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: invoices, count } = await admin
    .from('invoices')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = ((invoices as any[]) || []).map((r: any) => ({
    id: r.id,
    invoice_number: r.invoice_number,
    amount: r.total_amount ? `${Number(r.total_amount).toLocaleString()} SAR` : '—',
    status: r.status,
    due_date: r.due_date,
    created_at: r.created_at,
  }))

  return {
    columns: ['invoice_number', 'amount', 'status', 'due_date', 'created_at'],
    rows,
    total: count || 0,
  }
}

export async function getDealerPayments(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: transactions, count } = await admin
    .from('payment_transactions')
    .select(`
      id, amount, status, created_at,
      payment_methods!payment_method_id(name, name_ar)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = ((transactions as any[]) || []).map((r: any) => ({
    id: r.id,
    amount: r.amount ? `${Number(r.amount).toLocaleString()} SAR` : '—',
    payment_method: r.payment_methods?.name || r.payment_methods?.name_ar || '—',
    status: r.status,
    created_at: r.created_at,
  }))

  return {
    columns: ['amount', 'payment_method', 'status', 'created_at'],
    rows,
    total: count || 0,
  }
}

export async function getDealerBranches(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: branches, count } = await admin
    .from('organization_branches')
    .select('*', { count: 'exact' })
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = ((branches as any[]) || []).map((r: any) => ({
    id: r.id,
    name_en: r.name_en,
    name_ar: r.name_ar,
    phone: r.phone || '—',
    city: '—',
    is_headquarters: r.is_headquarters,
    is_active: r.is_active,
  }))

  return {
    columns: ['name_en', 'name_ar', 'phone', 'city', 'is_headquarters', 'is_active'],
    rows,
    total: count || 0,
  }
}

export async function getInspectionAppointments(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: appointments, count } = await admin
    .from('inspection_appointments')
    .select(`
      id, appointment_date, status, price, payment_status,
      customer:profiles!customer_id(full_name),
      service:inspection_services!service_id(name, name_ar)
    `, { count: 'exact' })
    .eq('org_id', orgId)
    .order('appointment_date', { ascending: false })
    .limit(50)

  const rows = ((appointments as any[]) || []).map((a: any) => ({
    id: a.id,
    customer_name: a.customer?.full_name || '—',
    service_name: a.service?.name || a.service?.name_ar || '—',
    appointment_date: a.appointment_date,
    status: a.status,
    price: a.price ? `${Number(a.price).toLocaleString()} SAR` : '—',
    payment_status: a.payment_status,
  }))

  return {
    columns: ['customer_name', 'service_name', 'appointment_date', 'status', 'price', 'payment_status'],
    rows,
    total: count || 0,
  }
}

export async function getInspectionReports(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: reports, count } = await admin
    .from('inspection_reports')
    .select(`
      id, score, max_score, status, outcome, recommendation, created_at,
      inspector:profiles!inspector_id(full_name)
    `, { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = ((reports as any[]) || []).map((r: any) => ({
    id: r.id,
    score: r.score,
    max_score: r.max_score,
    status: r.status,
    outcome: r.outcome,
    recommendation: r.recommendation || '—',
    inspector_name: r.inspector?.full_name || '—',
    created_at: r.created_at,
  }))

  return {
    columns: ['score', 'status', 'outcome', 'recommendation', 'inspector_name', 'created_at'],
    rows,
    total: count || 0,
  }
}

export async function getInspectionTechnicians(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: center } = await admin
    .from('inspection_centers')
    .select('id')
    .eq('org_id', orgId)
    .maybeSingle()

  if (!center) return { columns: [], rows: [], total: 0 }

  const { data: users, count } = await admin
    .from('inspection_center_users')
    .select(`
      id, role, is_active, created_at,
      user:profiles!user_id(full_name, email)
    `, { count: 'exact' })
    .eq('center_id', center.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = ((users as any[]) || []).map((u: any) => ({
    id: u.id,
    name: u.user?.full_name || '—',
    email: u.user?.email || '—',
    role: u.role,
    is_active: u.is_active,
    created_at: u.created_at,
  }))

  return {
    columns: ['name', 'email', 'role', 'is_active', 'created_at'],
    rows,
    total: count || 0,
  }
}

export async function getSparePartsProducts(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: products, count } = await admin
    .from('spare_parts')
    .select(`
      id, title, part_number, stock_quantity, price, status, is_active, stock_status,
      part_brands!brand_id(name, name_ar)
    `, { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = ((products as any[]) || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    part_number: p.part_number || '—',
    brand_name: p.part_brands?.name || p.part_brands?.name_ar || '—',
    stock_quantity: p.stock_quantity,
    price: p.price ? `${Number(p.price).toLocaleString()} SAR` : '—',
    status: p.is_active ? 'active' : 'inactive',
  }))

  return {
    columns: ['title', 'part_number', 'brand_name', 'stock_quantity', 'price', 'status'],
    rows,
    total: count || 0,
  }
}

export async function getSparePartsOrders(orgId: string): Promise<ModuleData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { columns: [], rows: [], total: 0 }

  const admin = getAdminClient() as any

  const { data: orders, count } = await admin
    .from('spare_part_orders')
    .select(`
      id, total_amount, status, payment_status, customer_id, created_at
    `, { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = ((orders as any[]) || []).map((o: any) => ({
    id: o.id?.slice(0, 8) || '—',
    total_amount: o.total_amount ? `${Number(o.total_amount).toLocaleString()} SAR` : '—',
    status: o.status,
    payment_status: o.payment_status,
    customer_name: '—',
    created_at: o.created_at,
  }))

  return {
    columns: ['id', 'total_amount', 'status', 'payment_status', 'customer_name', 'created_at'],
    rows,
    total: count || 0,
  }
}
