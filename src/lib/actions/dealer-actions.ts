'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

export async function registerDealer(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const name = formData.get('name') as string
  const nameAr = formData.get('name_ar') as string
  const phone = formData.get('phone') as string
  const cityId = formData.get('city_id') as string
  const description = formData.get('description') as string

  if (!name || !phone) return { success: false, error: 'Name and phone required' }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)

  // Check if user already has a dealer
  const { data: existing } = await (supabase as any)
    .from('dealers')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (existing) return { success: false, error: 'You already have a dealer account' }

  const { data: dealer, error } = await (supabase as any)
    .from('dealers')
    .insert({
      owner_id: user.id,
      name, name_ar: nameAr || null,
      slug, phone,
      city_id: cityId || null,
      description: description || null,
      is_approved: false,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Subscribe to free plan
  const { data: freePlan } = await (supabase as any)
    .from('dealer_subscription_plans')
    .select('id')
    .eq('slug', 'free')
    .single()

  if (freePlan) {
    await (supabase as any)
      .from('dealer_subscriptions')
      .insert({ dealer_id: dealer.id, plan_id: freePlan.id })
  }

  revalidatePath('/dashboard/dealer')
  return { success: true, dealer }
}

export async function getMyDealer() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await (supabase as any)
    .from('dealers')
    .select('*, subscription:dealer_subscriptions(*, plan:dealer_subscription_plans(*)), branches:dealer_branches(*)')
    .eq('owner_id', user.id)
    .single()

  return data || null
}

export async function getDealerDashboard() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const dealer = await getMyDealer()
  if (!dealer) return null

  const { data: listings } = await (supabase as any)
    .from('vehicle_listings')
    .select('*, vehicle:vehicles(*, make:makes(*), model:models(*), images:vehicle_images(*))')
    .eq('dealer_id', dealer.id)
    .order('created_at', { ascending: false })

  const { data: stats } = await (supabase as any)
    .from('dealer_stats')
    .select('*')
    .eq('dealer_id', dealer.id)
    .order('date', { ascending: false })
    .limit(30)

  const { data: staff } = await (supabase as any)
    .from('dealer_users')
    .select('*, user:profiles!user_id(id, full_name, phone)')
    .eq('dealer_id', dealer.id)

  const { data: ratings } = await (supabase as any)
    .from('dealer_ratings')
    .select('*, user:profiles!user_id(id, full_name)')
    .eq('dealer_id', dealer.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    ...dealer,
    listings: listings || [],
    stats: stats || [],
    staff: staff || [],
    ratings: ratings || [],
  }
}

export async function getAllDealers() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('dealers')
    .select('*, owner:profiles!owner_id(id, full_name, phone), plan:dealer_subscriptions(*, plan:dealer_subscription_plans(*))')
    .order('created_at', { ascending: false })
    .limit(100)

  return (data as any[]) || []
}

export async function approveDealer(id: string, approve: boolean) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any)
    .from('dealers')
    .update({ is_approved: approve, is_active: approve })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/dealers')
  return { success: true }
}

export async function getSubscriptionPlans() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('dealer_subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price_monthly', { ascending: true })

  return (data as any[]) || []
}

export async function subscribeToPlan(dealerId: string, planId: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any)
    .from('dealer_subscriptions')
    .insert({ dealer_id: dealerId, plan_id: planId })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/dealer')
  return { success: true }
}

export async function getDealers() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('dealers')
    .select('*, city:cities(*), owner:profiles!owner_id(id, full_name)')
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('name')
  return (data as any[]) || []
}

export async function getDealerBySlug(slug: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('dealers')
    .select('*, city:cities(*), owner:profiles!owner_id(id, full_name, phone), page:dealer_pages(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('is_approved', true)
    .single()
  return data || null
}

export async function getDealerListings(dealerId: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('vehicle_listings')
    .select('*, vehicle:vehicles(*, make:makes(*), model:models(*), images:vehicle_images(*)), city:cities(*)')
    .eq('dealer_id', dealerId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  return (data as any[]) || []
}

export async function getAllPlans() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('dealer_subscription_plans')
    .select('*')
    .order('price_monthly', { ascending: true })
  return (data as any[]) || []
}

export async function upsertPlan(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const id = formData.get('id') as string
  const payload: Record<string, any> = {
    name: formData.get('name'),
    name_ar: formData.get('name_ar') || null,
    slug: formData.get('slug'),
    description: formData.get('description') || null,
    price_monthly: parseFloat(formData.get('price_monthly') as string) || 0,
    price_yearly: formData.get('price_yearly') ? parseFloat(formData.get('price_yearly') as string) : null,
    max_listings: formData.get('max_listings') ? parseInt(formData.get('max_listings') as string) : null,
    max_staff: formData.get('max_staff') ? parseInt(formData.get('max_staff') as string) : null,
    max_branches: formData.get('max_branches') ? parseInt(formData.get('max_branches') as string) : null,
    has_analytics: formData.get('has_analytics') === 'on',
    has_wholesale: formData.get('has_wholesale') === 'on',
    has_auctions: formData.get('has_auctions') === 'on',
    has_parts: formData.get('has_parts') === 'on',
    has_delivery: formData.get('has_delivery') === 'on',
    has_featured: formData.get('has_featured') === 'on',
    has_api: formData.get('has_api') === 'on',
    is_active: formData.get('is_active') === 'on',
  }

  let error: any
  if (id) {
    ({ error } = await (supabase as any)
      .from('dealer_subscription_plans')
      .update(payload)
      .eq('id', id))
  } else {
    ({ error } = await (supabase as any)
      .from('dealer_subscription_plans')
      .insert(payload))
  }

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/plans')
  return { success: true }
}

export async function togglePlan(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: plan } = await (supabase as any)
    .from('dealer_subscription_plans')
    .select('is_active')
    .eq('id', id)
    .single()
  if (!plan) return { success: false, error: 'Plan not found' }

  const { error } = await (supabase as any)
    .from('dealer_subscription_plans')
    .update({ is_active: !plan.is_active })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/plans')
  return { success: true }
}

export async function getCities() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('cities')
    .select('*')
    .order('name')
  return (data as any[]) || []
}

export async function getStaffList() {
  const dealer = await getMyDealer()
  if (!dealer) return []
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('dealer_users')
    .select('*, user:profiles!user_id(id, full_name, phone, email)')
    .eq('dealer_id', dealer.id)
  return (data as any[]) || []
}

export async function inviteStaff(phone: string, role = 'employee') {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }

  const supabase = await createServerSupabaseClient()
  const dealer = await getMyDealer()
  if (!dealer) return { success: false, error: 'no_dealer' }

  if (dealer.staff?.length >= (dealer.subscription?.[0]?.plan?.max_staff ?? Infinity)) {
    return { success: false, error: 'staff_limit_reached' }
  }

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('id, full_name, phone')
    .eq('phone', phone)
    .single()

  if (!profile) return { success: false, error: 'user_not_found' }

  const { data: existing } = await (supabase as any)
    .from('dealer_users')
    .select('id')
    .eq('dealer_id', dealer.id)
    .eq('user_id', profile.id)
    .single()

  if (existing) return { success: false, error: 'already_staff' }

  const { error } = await (supabase as any)
    .from('dealer_users')
    .insert({ dealer_id: dealer.id, user_id: profile.id, role })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/dealer')
  return { success: true, user: profile }
}

export async function removeStaff(userId: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }

  const supabase = await createServerSupabaseClient()
  const dealer = await getMyDealer()
  if (!dealer) return { success: false, error: 'no_dealer' }

  const { error } = await (supabase as any)
    .from('dealer_users')
    .delete()
    .eq('dealer_id', dealer.id)
    .eq('user_id', userId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/dealer')
  return { success: true }
}

export async function updateStaffRole(userId: string, role: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: 'auth_required' }

  const supabase = await createServerSupabaseClient()
  const dealer = await getMyDealer()
  if (!dealer) return { success: false, error: 'no_dealer' }

  const { error } = await (supabase as any)
    .from('dealer_users')
    .update({ role })
    .eq('dealer_id', dealer.id)
    .eq('user_id', userId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/dealer')
  return { success: true }
}
