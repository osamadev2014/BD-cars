'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'

export interface DashboardStats {
  stats: Array<{ label: string; value: string; icon?: string }>
  recent: Array<{ action: string; time: string }>
}

export async function getCarDealerStats(orgId: string): Promise<DashboardStats> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [], recent: [] }

  const supabase = (await createServerSupabaseClient()) as any

  const { count: activeListings } = await supabase
    .from('vehicle_listings').select('*', { count: 'exact', head: true })
    .eq('org_id', orgId).in('status', ['active', 'published'])

  const { count: pendingRequests } = await supabase
    .from('vehicle_listings').select('*', { count: 'exact', head: true })
    .eq('org_id', orgId).eq('status', 'pending')

  const { data: recentActivity } = await supabase
    .from('vehicle_listings').select('title, status, updated_at')
    .eq('org_id', orgId).order('updated_at', { ascending: false }).limit(5)

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const { count: weeklyViews } = await supabase
    .from('vehicle_listings').select('*', { count: 'exact', head: true })
    .eq('org_id', orgId).gte('updated_at', weekAgo.toISOString())

  const { data: salesData } = await supabase
    .from('vehicle_listings').select('price')
    .eq('org_id', orgId).eq('status', 'sold')

  const monthlySales = (salesData || []).reduce((sum: number, l: any) => sum + Number(l.price || 0), 0)

  return {
    stats: [
      { label: 'Active Listings', value: String(activeListings || 0) },
      { label: 'Views This Week', value: String(weeklyViews || 0) },
      { label: 'Pending Requests', value: String(pendingRequests || 0) },
      { label: 'Sales Total', value: `${(monthlySales / 1000).toFixed(1)}K SAR` },
    ],
    recent: (recentActivity || []).map((l: any) => ({
      action: `${l.title}: ${l.status}`,
      time: timeAgo(new Date(l.updated_at)),
    })),
  }
}

export async function getInspectionCenterStats(orgId: string): Promise<DashboardStats> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [], recent: [] }

  const supabase = (await createServerSupabaseClient()) as any

  const from = 'inspection_appointments'
  const { count: total } = await supabase.from(from).select('*', { count: 'exact', head: true }).eq('org_id', orgId)
  const { count: completed } = await supabase.from(from).select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'completed')
  const { count: pending } = await supabase.from(from).select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'pending')
  const { data: revenue } = await supabase.from(from).select('price').eq('org_id', orgId)
  const totalRevenue = (revenue || []).reduce((s: number, r: any) => s + Number(r.price || 0), 0)
  const { data: recent } = await supabase.from('inspection_reports').select('title, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(5)

  return {
    stats: [
      { label: 'Total Appointments', value: String(total || 0) },
      { label: 'Completed', value: String(completed || 0) },
      { label: 'Pending', value: String(pending || 0) },
      { label: 'Revenue', value: `${totalRevenue.toLocaleString()} SAR` },
    ],
    recent: (recent || []).map((r: any) => ({
      action: r.title || 'Inspection report',
      time: timeAgo(new Date(r.created_at)),
    })),
  }
}

export async function getFinanceCompanyStats(orgId: string): Promise<DashboardStats> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [], recent: [] }
  const supabase = (await createServerSupabaseClient()) as any

  const { count: requests } = await supabase.from('finance_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId)
  const { count: approved } = await supabase.from('finance_offers').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'approved')
  const { data: recent } = await supabase.from('finance_requests').select('id, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(5)

  return {
    stats: [
      { label: 'Total Requests', value: String(requests || 0) },
      { label: 'Approved Offers', value: String(approved || 0) },
    ],
    recent: (recent || []).map((r: any) => ({
      action: `Request ${r.id?.slice(0, 8)}: ${r.status}`,
      time: timeAgo(new Date(r.created_at)),
    })),
  }
}

export async function getInsuranceCompanyStats(orgId: string): Promise<DashboardStats> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [], recent: [] }
  const supabase = (await createServerSupabaseClient()) as any

  const { count: requests } = await supabase.from('insurance_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId)
  const { count: active } = await supabase.from('insurance_offers').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'active')
  const { data: recent } = await supabase.from('insurance_requests').select('id, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(5)

  return {
    stats: [
      { label: 'Total Requests', value: String(requests || 0) },
      { label: 'Active Offers', value: String(active || 0) },
    ],
    recent: (recent || []).map((r: any) => ({
      action: `Request ${r.id?.slice(0, 8)}: ${r.status}`,
      time: timeAgo(new Date(r.created_at)),
    })),
  }
}

export async function getAdvertisingStats(orgId: string): Promise<DashboardStats> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [], recent: [] }
  const supabase = (await createServerSupabaseClient()) as any

  const { count: campaigns } = await supabase.from('ad_campaigns').select('*', { count: 'exact', head: true }).eq('org_id', orgId)
  const { count: active } = await supabase.from('ad_campaigns').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'active')
  const { data: budget } = await supabase.from('ad_campaigns').select('budget, spent').eq('org_id', orgId)
  const totalBudget = (budget || []).reduce((s: number, c: any) => s + Number(c.budget || 0), 0)
  const totalSpent = (budget || []).reduce((s: number, c: any) => s + Number(c.spent || 0), 0)
  const { data: recent } = await supabase.from('ad_campaigns').select('name, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(5)

  return {
    stats: [
      { label: 'Total Campaigns', value: String(campaigns || 0) },
      { label: 'Active', value: String(active || 0) },
      { label: 'Total Budget', value: `${(totalBudget / 1000).toFixed(0)}K SAR` },
      { label: 'Spent', value: `${(totalSpent / 1000).toFixed(0)}K SAR` },
    ],
    recent: (recent || []).map((c: any) => ({
      action: `${c.name}: ${c.status}`,
      time: timeAgo(new Date(c.created_at)),
    })),
  }
}

export async function getPartsSupplierStats(orgId: string): Promise<DashboardStats> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [], recent: [] }
  const supabase = (await createServerSupabaseClient()) as any

  const { count: total } = await supabase.from('spare_parts').select('*', { count: 'exact', head: true }).eq('org_id', orgId)
  const { count: outOfStock } = await supabase.from('spare_parts').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('stock_status', 'out_of_stock')
  const { count: orders } = await supabase.from('part_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId)
  const { data: recent } = await supabase.from('spare_parts').select('title, stock_status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(5)

  return {
    stats: [
      { label: 'Total Parts', value: String(total || 0) },
      { label: 'Out of Stock', value: String(outOfStock || 0) },
      { label: 'Orders', value: String(orders || 0) },
    ],
    recent: (recent || []).map((p: any) => ({
      action: `${p.title}: ${p.stock_status}`,
      time: timeAgo(new Date(p.created_at)),
    })),
  }
}

export async function getWholesaleTraderStats(orgId: string): Promise<DashboardStats> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [], recent: [] }
  const supabase = (await createServerSupabaseClient()) as any

  const { count: open } = await supabase.from('wholesale_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'open')
  const { count: total } = await supabase.from('wholesale_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId)
  const { data: recent } = await supabase.from('wholesale_requests').select('title, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(5)

  return {
    stats: [
      { label: 'Open Requests', value: String(open || 0) },
      { label: 'Total Requests', value: String(total || 0) },
    ],
    recent: (recent || []).map((r: any) => ({
      action: `${r.title}: ${r.status}`,
      time: timeAgo(new Date(r.created_at)),
    })),
  }
}

export async function getCarRentalStats(orgId: string): Promise<DashboardStats> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [], recent: [] }
  const supabase = (await createServerSupabaseClient()) as any

  const { count: fleetSize } = await supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('org_id', orgId)
  const { data: bookings } = await supabase.from('rental_bookings').select('id, total_amount, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false })
  const activeBookings = (bookings || []).filter((b: any) => b.status === 'active').length
  const monthlyRevenue = (bookings || []).reduce((s: number, b: any) => s + Number(b.total_amount || 0), 0)
  const available = fleetSize ? fleetSize - activeBookings : 0

  return {
    stats: [
      { label: 'Fleet Size', value: String(fleetSize || 0) },
      { label: 'Active Bookings', value: String(activeBookings) },
      { label: 'Available Vehicles', value: String(Math.max(available, 0)) },
      { label: 'Monthly Revenue', value: `${(monthlyRevenue / 1000).toFixed(0)}K SAR` },
    ],
    recent: (bookings || []).slice(0, 5).map((b: any) => ({
      action: `Booking ${b.id?.slice(0, 8)}: ${b.status}`,
      time: timeAgo(new Date(b.created_at)),
    })),
  }
}

export async function getShippingStats(orgId: string): Promise<DashboardStats> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [], recent: [] }
  const supabase = (await createServerSupabaseClient()) as any

  const { count: total } = await supabase.from('delivery_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId)
  const { count: inTransit } = await supabase.from('delivery_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'in_transit')
  const { count: delivered } = await supabase.from('delivery_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'delivered')
  const { data: recent } = await supabase.from('delivery_orders').select('id, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(5)

  return {
    stats: [
      { label: 'Total Orders', value: String(total || 0) },
      { label: 'In Transit', value: String(inTransit || 0) },
      { label: 'Delivered', value: String(delivered || 0) },
    ],
    recent: (recent || []).map((o: any) => ({
      action: `Order ${o.id?.slice(0, 8)}: ${o.status}`,
      time: timeAgo(new Date(o.created_at)),
    })),
  }
}

export async function getVehicleTransportStats(orgId: string): Promise<DashboardStats> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [], recent: [] }
  const supabase = (await createServerSupabaseClient()) as any

  const { count: total } = await supabase.from('delivery_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId)
  const { count: active } = await supabase.from('delivery_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId).in('status', ['in_transit', 'pending'])
  const { data: fees } = await supabase.from('delivery_orders').select('delivery_fee').eq('org_id', orgId).eq('status', 'delivered')
  const totalFees = (fees || []).reduce((s: number, o: any) => s + Number(o.delivery_fee || 0), 0)
  const { data: recent } = await supabase.from('delivery_orders').select('id, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(5)

  return {
    stats: [
      { label: 'Total Orders', value: String(total || 0) },
      { label: 'Active', value: String(active || 0) },
      { label: 'Completed Revenue', value: `${(totalFees / 1000).toFixed(1)}K SAR` },
    ],
    recent: (recent || []).map((o: any) => ({
      action: `Transport ${o.id?.slice(0, 8)}: ${o.status}`,
      time: timeAgo(new Date(o.created_at)),
    })),
  }
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
