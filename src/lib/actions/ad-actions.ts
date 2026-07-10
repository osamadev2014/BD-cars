'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requirePermission, requireAuth } from '@/server/guards'
import { createAuditLog } from '@/lib/audit/audit-service'

export async function getAdvertiserDashboard(userId?: string) {
  const guard = await requirePermission('view_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const uid = userId || guard.userId!
  const supabase = (await createServerSupabaseClient()) as any

  const { data: campaigns } = await supabase
    .from('ad_campaigns')
    .select('id, status, budget, spent')
    .eq('deleted_at', null)

  const { data: impressions } = await supabase
    .from('ad_impressions')

  const { data: clicks } = await supabase
    .from('ad_clicks')

  const totalImpressions = impressions?.length || 0
  const totalClicks = clicks?.length || 0
  const totalCampaigns = campaigns?.filter((c: any) => c.status !== 'draft').length || 0
  const activeCampaigns = campaigns?.filter((c: any) => c.status === 'active').length || 0
  const totalSpend = campaigns?.reduce((s: number, c: any) => s + (c.spent || 0), 0) || 0
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'

  return {
    totalCampaigns,
    activeCampaigns,
    totalImpressions,
    totalClicks,
    ctr: parseFloat(ctr),
    totalSpend,
  }
}

export async function getAdCampaigns(filters?: {
  status?: string
  page?: number
  perPage?: number
}) {
  const guard = await requirePermission('view_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any
  const page = filters?.page || 1
  const perPage = filters?.perPage || 20
  const offset = (page - 1) * perPage

  let query = supabase
    .from('ad_campaigns')
    .select('*, advertiser:advertisers(name, name_ar, logo_url), placement:ad_placements(name, name_ar)', { count: 'exact' })
    .eq('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const { data, count } = await query.range(offset, offset + perPage - 1)

  return {
    data: data || [],
    count: count || 0,
    page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  }
}

export async function createAdCampaign(data: {
  name: string
  type: string
  budget: number
  daily_budget?: number
  placement_id?: string
  target_url?: string
  image_url?: string
  start_date?: string
  end_date?: string
}) {
  const guard = await requirePermission('manage_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: advertiser } = await supabase
    .from('advertiser_users')
    .select('advertiser_id')
    .eq('user_id', guard.userId)
    .maybeSingle()

  if (!advertiser) throw new Error('No advertiser profile found')

  const { data: campaign, error } = await supabase
    .from('ad_campaigns')
    .insert({
      advertiser_id: advertiser.advertiser_id,
      name: data.name,
      type: data.type,
      budget: data.budget,
      daily_budget: data.daily_budget || null,
      placement_id: data.placement_id || null,
      target_url: data.target_url || null,
      image_url: data.image_url || null,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      status: 'draft',
      spent: 0,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await createAuditLog({
    userId: guard.userId,
    action: 'create',
    entityType: 'ad_campaign',
    entityId: campaign.id,
    newValues: data,
  })

  return campaign
}

export async function updateAdCampaign(id: string, data: {
  name?: string
  type?: string
  status?: string
  budget?: number
  daily_budget?: number
  placement_id?: string
  target_url?: string
  image_url?: string
  start_date?: string
  end_date?: string
}) {
  const guard = await requirePermission('manage_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: old } = await supabase
    .from('ad_campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (!old) throw new Error('Campaign not found')

  const { data: campaign, error } = await supabase
    .from('ad_campaigns')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await createAuditLog({
    userId: guard.userId,
    action: 'update',
    entityType: 'ad_campaign',
    entityId: id,
    oldValues: old,
    newValues: data,
  })

  return campaign
}

export async function deleteAdCampaign(id: string) {
  const guard = await requirePermission('manage_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: old } = await supabase
    .from('ad_campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (!old) throw new Error('Campaign not found')

  const { error } = await supabase
    .from('ad_campaigns')
    .update({ deleted_at: new Date().toISOString(), status: 'ended', updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await createAuditLog({
    userId: guard.userId,
    action: 'delete',
    entityType: 'ad_campaign',
    entityId: id,
    oldValues: old,
  })
}

export async function getAdPlacements() {
  const supabase = (await createServerSupabaseClient()) as any
  const { data } = await supabase
    .from('ad_placements')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  return (data || []) as Array<{
    id: string
    key: string
    name: string
    name_ar: string | null
    description: string | null
    width: number | null
    height: number | null
    is_active: boolean
  }>
}

export async function getSponsorshipPackages() {
  const supabase = (await createServerSupabaseClient()) as any
  const { data } = await supabase
    .from('sponsorship_packages')
    .select('*, placement:ad_placements(name, name_ar)')
    .eq('is_active', true)
    .order('price', { ascending: true })

  return (data || []) as Array<{
    id: string
    name: string
    name_ar: string | null
    description: string | null
    price: number
    duration_days: number
    placement_id: string | null
    is_active: boolean
    placement?: { name: string; name_ar: string } | null
  }>
}

export async function recordAdImpression(campaignId: string, ipAddress?: string | null, userAgent?: string | null) {
  const supabase = (await createServerSupabaseClient()) as any

  const { error } = await supabase
    .from('ad_impressions')
    .insert({
      campaign_id: campaignId,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
    })

  if (error) throw new Error(error.message)
}

export async function recordAdClick(campaignId: string, ipAddress?: string | null, userAgent?: string | null) {
  const supabase = (await createServerSupabaseClient()) as any

  const { error } = await supabase
    .from('ad_clicks')
    .insert({
      campaign_id: campaignId,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
    })

  if (error) throw new Error(error.message)
}

export async function getFeaturedListings() {
  const supabase = (await createServerSupabaseClient()) as any

  const { data } = await supabase
    .from('vehicle_listings')
    .select(`
      id, slug, title, price, is_featured, featured_until,
      vehicle:vehicles(
        id, year, mileage,
        make:car_makes(id, name, name_ar),
        model:car_models(id, name, name_ar),
        images:vehicle_images(id, url, is_primary, sort_order)
      ),
      city:cities(id, name, name_ar)
    `)
    .eq('status', 'active')
    .eq('is_featured', true)
    .gte('featured_until', new Date().toISOString())
    .order('featured_until', { ascending: false })

  return (data || []) as Array<Record<string, any>>
}

export async function getAdvertiserList() {
  const guard = await requirePermission('manage_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { data } = await supabase
    .from('advertisers')
    .select('*')
    .order('name', { ascending: true })

  return (data || []) as Array<{
    id: string
    name: string
    name_ar: string | null
    logo_url: string | null
    website: string | null
    contact_email: string | null
    contact_phone: string | null
    is_active: boolean
    created_at: string
  }>
}

export async function getAdCampaignById(id: string) {
  const guard = await requirePermission('view_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { data } = await supabase
    .from('ad_campaigns')
    .select('*, advertiser:advertisers(*), placement:ad_placements(*)')
    .eq('id', id)
    .single()

  if (!data) throw new Error('Campaign not found')

  const { data: impressions } = await supabase
    .from('ad_impressions')
    .select('created_at')
    .eq('campaign_id', id)
    .order('created_at', { ascending: false })

  const { data: clicks } = await supabase
    .from('ad_clicks')
    .select('created_at')
    .eq('campaign_id', id)
    .order('created_at', { ascending: false })

  return {
    ...data,
    impressions: impressions || [],
    clicks: clicks || [],
  }
}

export async function adminCreateAdvertiser(data: {
  name: string
  name_ar?: string
  logo_url?: string
  website?: string
  contact_email?: string
  contact_phone?: string
}) {
  const guard = await requirePermission('manage_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: advertiser, error } = await supabase
    .from('advertisers')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await createAuditLog({
    userId: guard.userId,
    action: 'create',
    entityType: 'ad_campaign',
    entityId: advertiser.id,
    newValues: data,
  })

  return advertiser
}

export async function adminCreatePlacement(data: {
  key: string
  name: string
  name_ar?: string
  description?: string
  width?: number
  height?: number
}) {
  const guard = await requirePermission('manage_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: placement, error } = await supabase
    .from('ad_placements')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await createAuditLog({
    userId: guard.userId,
    action: 'create',
    entityType: 'ad_campaign',
    entityId: placement.id,
    newValues: data,
  })

  return placement
}

export async function adminUpdatePlacement(id: string, data: {
  key?: string
  name?: string
  name_ar?: string
  description?: string
  width?: number
  height?: number
  is_active?: boolean
}) {
  const guard = await requirePermission('manage_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: old } = await supabase.from('ad_placements').select('*').eq('id', id).single()
  if (!old) throw new Error('Placement not found')

  const { data: placement, error } = await supabase
    .from('ad_placements')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await createAuditLog({
    userId: guard.userId,
    action: 'update',
    entityType: 'ad_campaign',
    entityId: id,
    oldValues: old,
    newValues: data,
  })

  return placement
}

export async function adminDeletePlacement(id: string) {
  const guard = await requirePermission('manage_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { error } = await supabase.from('ad_placements').delete().eq('id', id)
  if (error) throw new Error(error.message)

  await createAuditLog({
    userId: guard.userId,
    action: 'delete',
    entityType: 'ad_campaign',
    entityId: id,
  })
}

export async function adminCreatePackage(data: {
  name: string
  name_ar?: string
  description?: string
  price: number
  duration_days: number
  placement_id?: string
}) {
  const guard = await requirePermission('manage_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: pkg, error } = await supabase
    .from('sponsorship_packages')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await createAuditLog({
    userId: guard.userId,
    action: 'create',
    entityType: 'ad_campaign',
    entityId: pkg.id,
    newValues: data,
  })

  return pkg
}

export async function adminUpdatePackage(id: string, data: {
  name?: string
  name_ar?: string
  description?: string
  price?: number
  duration_days?: number
  placement_id?: string
  is_active?: boolean
}) {
  const guard = await requirePermission('manage_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: old } = await supabase.from('sponsorship_packages').select('*').eq('id', id).single()
  if (!old) throw new Error('Package not found')

  const { data: pkg, error } = await supabase
    .from('sponsorship_packages')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await createAuditLog({
    userId: guard.userId,
    action: 'update',
    entityType: 'ad_campaign',
    entityId: id,
    oldValues: old,
    newValues: data,
  })

  return pkg
}

export async function adminDeletePackage(id: string) {
  const guard = await requirePermission('manage_advertising')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { error } = await supabase.from('sponsorship_packages').delete().eq('id', id)
  if (error) throw new Error(error.message)

  await createAuditLog({
    userId: guard.userId,
    action: 'delete',
    entityType: 'ad_campaign',
    entityId: id,
  })
}

export async function adminGetAllPlacements() {
  const supabase = (await createServerSupabaseClient()) as any
  const { data } = await supabase
    .from('ad_placements')
    .select('*')
    .order('name', { ascending: true })

  return (data || []) as Array<{
    id: string
    key: string
    name: string
    name_ar: string | null
    description: string | null
    width: number | null
    height: number | null
    is_active: boolean
    created_at: string
    updated_at: string
  }>
}

export async function adminGetAllPackages() {
  const supabase = (await createServerSupabaseClient()) as any
  const { data } = await supabase
    .from('sponsorship_packages')
    .select('*, placement:ad_placements(name, name_ar)')
    .order('price', { ascending: true })

  return (data || []) as Array<{
    id: string
    name: string
    name_ar: string | null
    description: string | null
    price: number
    duration_days: number
    placement_id: string | null
    is_active: boolean
    created_at: string
    updated_at: string
    placement?: { name: string; name_ar: string } | null
  }>
}
