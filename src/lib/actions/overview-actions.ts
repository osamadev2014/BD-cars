'use server'

import { requireAuth } from '@/server/guards'
import { getAdminClient } from '@/lib/supabase/admin'

export interface StatItem {
  label: string
  value: string | number
}

export interface OverviewData {
  stats: StatItem[]
}

export async function getCarDealerStats(orgId: string): Promise<OverviewData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [] }

  const admin = getAdminClient() as any

  const { count: activeListings } = await admin
    .from('vehicle_listings')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('status', 'active')

  const { count: availableInventory } = await admin
    .from('dealer_inventory')
    .select('*', { count: 'exact', head: true })
    .eq('dealer_id', orgId)
    .in('status', ['available', 'in_stock'])

  const { count: reservedCars } = await admin
    .from('vehicle_listings')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('status', 'reserved')

  const { count: soldThisMonth } = await admin
    .from('vehicle_listings')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('status', 'sold')
    .gte('updated_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

  const { count: pendingRequests } = await admin
    .from('purchase_requests')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('status', 'pending')

  const { data: dealerData } = await admin
    .from('dealers')
    .select('id')
    .eq('org_id', orgId)
    .maybeSingle()

  const { count: customers } = dealerData
    ? (await admin.from('dealer_ratings').select('*', { count: 'exact', head: true }).eq('dealer_id', dealerData.id)).count
    : 0

  const { count: totalDealerSales } = dealerData
    ? (await admin.from('vehicle_listings').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'sold')).count
    : 0

  return {
    stats: [
      { label: 'Active Listings', value: activeListings ?? 0 },
      { label: 'Available Inventory', value: availableInventory ?? 0 },
      { label: 'Reserved', value: reservedCars ?? 0 },
      { label: 'Sold This Month', value: soldThisMonth ?? 0 },
      { label: 'Pending Requests', value: pendingRequests ?? 0 },
      { label: 'Total Customers', value: customers ?? 0 },
      { label: 'Total Sales', value: totalDealerSales ?? 0 },
      { label: 'Active Listings', value: activeListings ?? 0 },
    ],
  }
}

export async function getInspectionCenterStats(orgId: string): Promise<OverviewData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [] }

  const admin = getAdminClient() as any

  const today = new Date().toISOString().split('T')[0]

  const [{ count: appointmentsToday }, { count: inspectionsInProgress }, { count: completedInspections }, { count: failedInspections }] = await Promise.all([
    admin.from('inspection_appointments').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('appointment_date', today),
    admin.from('inspection_reports').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'in_progress'),
    admin.from('inspection_reports').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'completed'),
    admin.from('inspection_reports').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('outcome', 'failed'),
  ])

  const { data: centerData } = await admin
    .from('inspection_centers')
    .select('id')
    .eq('org_id', orgId)
    .maybeSingle()

  const { count: technicians } = centerData
    ? (await admin.from('inspection_center_users').select('*', { count: 'exact', head: true }).eq('center_id', centerData.id).eq('role', 'technician')).count
    : 0

  const { data: revenueData } = await admin
    .from('inspection_revenue_shares')
    .select('total_amount')
    .eq('center_id', centerData?.id)
    .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

  const todayRevenue = revenueData?.reduce((sum: number, r: any) => sum + Number(r.total_amount), 0) ?? 0

  return {
    stats: [
      { label: "Today's Appointments", value: appointmentsToday ?? 0 },
      { label: 'Inspections In Progress', value: inspectionsInProgress ?? 0 },
      { label: 'Completed', value: completedInspections ?? 0 },
      { label: 'Failed Inspections', value: failedInspections ?? 0 },
      { label: 'Technicians', value: technicians ?? 0 },
      { label: 'Monthly Revenue', value: `${todayRevenue.toLocaleString()} SAR` },
    ],
  }
}

export async function getFinanceCompanyStats(orgId: string): Promise<OverviewData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [] }

  const admin = getAdminClient() as any

  const [{ count: newApplications }, { count: underReview }, { count: approved }, { count: rejected }] = await Promise.all([
    admin.from('finance_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'new'),
    admin.from('finance_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'under_review'),
    admin.from('finance_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'approved'),
    admin.from('finance_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'rejected'),
  ])

  const { count: activeAgreements } = await admin
    .from('finance_offers')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('status', 'accepted')

  return {
    stats: [
      { label: 'New Applications', value: newApplications ?? 0 },
      { label: 'Under Review', value: underReview ?? 0 },
      { label: 'Approved', value: approved ?? 0 },
      { label: 'Rejected', value: rejected ?? 0 },
      { label: 'Active Agreements', value: activeAgreements ?? 0 },
    ],
  }
}

export async function getInsuranceCompanyStats(orgId: string): Promise<OverviewData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [] }

  const admin = getAdminClient() as any

  const [{ count: newRequests }, { count: pendingQuotes }, { count: openClaims }] = await Promise.all([
    admin.from('insurance_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'new'),
    admin.from('insurance_offers').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'pending'),
    admin.from('insurance_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'claim_filed'),
  ])

  return {
    stats: [
      { label: 'New Requests', value: newRequests ?? 0 },
      { label: 'Pending Quotations', value: pendingQuotes ?? 0 },
      { label: 'Open Claims', value: openClaims ?? 0 },
    ],
  }
}

export async function getCarRentalStats(orgId: string): Promise<OverviewData> {
  return { stats: [{ label: 'Coming Soon', value: '—' }] }
}

export async function getCarTransportStats(orgId: string): Promise<OverviewData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [] }

  const admin = getAdminClient() as any

  const [{ count: activeShipments }, { count: deliveredToday }] = await Promise.all([
    admin.from('delivery_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId).in('status', ['in_transit', 'picked_up']),
    admin.from('delivery_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'delivered'),
  ])

  return {
    stats: [
      { label: 'Active Shipments', value: activeShipments ?? 0 },
      { label: 'Delivered', value: deliveredToday ?? 0 },
    ],
  }
}

export async function getProductShippingStats(orgId: string): Promise<OverviewData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [] }

  const admin = getAdminClient() as any

  const [{ count: awaitingPickup }, { count: inTransit }, { count: deliveredToday }] = await Promise.all([
    admin.from('delivery_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'pending'),
    admin.from('delivery_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'in_transit'),
    admin.from('delivery_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'delivered'),
  ])

  return {
    stats: [
      { label: 'Awaiting Pickup', value: awaitingPickup ?? 0 },
      { label: 'In Transit', value: inTransit ?? 0 },
      { label: 'Delivered Today', value: deliveredToday ?? 0 },
    ],
  }
}

export async function getSparePartsStats(orgId: string): Promise<OverviewData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [] }

  const admin = getAdminClient() as any

  const [{ count: totalProducts }, { count: lowStock }, { count: outOfStock }, { count: newOrders }] = await Promise.all([
    admin.from('spare_parts').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
    admin.from('spare_parts').select('*', { count: 'exact', head: true }).eq('org_id', orgId).lt('stock_quantity', 10).gt('stock_quantity', 0),
    admin.from('spare_parts').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('stock_quantity', 0),
    admin.from('spare_part_orders').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'pending'),
  ])

  return {
    stats: [
      { label: 'Total Products', value: totalProducts ?? 0 },
      { label: 'Low Stock', value: lowStock ?? 0 },
      { label: 'Out of Stock', value: outOfStock ?? 0 },
      { label: 'New Orders', value: newOrders ?? 0 },
    ],
  }
}

export async function getWholesaleTraderStats(orgId: string): Promise<OverviewData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [] }

  const admin = getAdminClient() as any

  const [{ count: newRequests }, { count: pendingQuotes }, { count: completedTransactions }] = await Promise.all([
    admin.from('wholesale_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'open'),
    admin.from('wholesale_offers').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'pending'),
    admin.from('wholesale_contracts').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'completed'),
  ])

  return {
    stats: [
      { label: 'Open Requests', value: newRequests ?? 0 },
      { label: 'Pending Quotes', value: pendingQuotes ?? 0 },
      { label: 'Completed Transactions', value: completedTransactions ?? 0 },
    ],
  }
}

export async function getMarketingStats(orgId: string): Promise<OverviewData> {
  const auth = await requireAuth()
  if (!auth.allowed) return { stats: [] }

  const admin = getAdminClient() as any

  const [{ count: activeCampaigns }, { data: campaigns }] = await Promise.all([
    admin.from('ad_campaigns').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'active'),
    admin.from('ad_campaigns').select('budget, spent').eq('org_id', orgId).eq('status', 'active'),
  ])

  const totalBudget = campaigns?.reduce((sum: number, c: any) => sum + Number(c.budget || 0), 0) ?? 0
  const totalSpent = campaigns?.reduce((sum: number, c: any) => sum + Number(c.spent || 0), 0) ?? 0

  return {
    stats: [
      { label: 'Active Campaigns', value: activeCampaigns ?? 0 },
      { label: 'Total Budget', value: `${totalBudget.toLocaleString()} SAR` },
      { label: 'Total Spent', value: `${totalSpent.toLocaleString()} SAR` },
    ],
  }
}
