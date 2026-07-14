'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { requireAuth, requirePermission } from '@/server/guards'
import { revalidatePath } from 'next/cache'

export async function registerOrganization(formData: {
  org_type: string
  name: string
  name_ar?: string
  phone?: string
  email?: string
  registration_number?: string
  city_id?: string
  address?: string
}) {
  const auth = await requireAuth()
  if (!auth.allowed) throw new Error('Authentication required')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: org, error } = await supabase
    .from('organizations')
    .insert({
      org_type: formData.org_type,
      name: formData.name,
      name_ar: formData.name_ar || null,
      phone: formData.phone || null,
      email: formData.email || null,
      registration_number: formData.registration_number || null,
      city_id: formData.city_id || null,
      address: formData.address || null,
      status: 'pending_approval',
      is_active: false,
      created_by: auth.userId,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({
      organization_id: org.id,
      user_id: auth.userId,
      role: 'owner',
      status: 'active',
      is_active: true,
      created_by: auth.userId,
    })

  if (memberError) throw new Error(memberError.message)

  revalidatePath('/business/pending')
  return { orgId: org.id }
}

export async function getMyOrganizations() {
  const auth = await requireAuth()
  if (!auth.allowed) return []

  const supabase = getAdminClient() as any

  // Get orgs where user is a member
  const { data: memberships } = await supabase
    .from('organization_members')
    .select('organization_id, role')
    .eq('user_id', auth.userId)
    .eq('is_active', true)

  if (!memberships?.length) return []

  const orgIds = memberships.map((m: any) => m.organization_id)
  const roleMap = Object.fromEntries(memberships.map((m: any) => [m.organization_id, m.role]))

  const { data: orgs } = await supabase
    .from('organizations')
    .select('*')
    .in('id', orgIds)
    .order('created_at', { ascending: false })

  return (orgs || []).map((org: any) => ({ ...org, my_role: roleMap[org.id] }))
}

export async function getPendingOrganizations() {
  const guard = await requirePermission('approve_dealers')
  if (!guard.allowed) return []

  const supabase = (await createServerSupabaseClient()) as any

  const { data } = await supabase
    .from('organizations')
    .select(`
      *,
      owner:created_by(id, full_name, phone)
    `)
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: false })

  return data || []
}

export async function getAllOrganizations() {
  const guard = await requirePermission('approve_dealers')
  if (!guard.allowed) return []

  const supabase = (await createServerSupabaseClient()) as any

  const { data } = await supabase
    .from('organizations')
    .select(`
      *,
      owner:created_by(id, full_name, phone)
    `)
    .order('created_at', { ascending: false })

  return data || []
}

export async function approveOrganization(orgId: string) {
  const guard = await requirePermission('approve_dealers')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { error } = await supabase
    .from('organizations')
    .update({ status: 'active', is_active: true, updated_at: new Date().toISOString() })
    .eq('id', orgId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/organizations')
}

export async function rejectOrganization(orgId: string, reason: string) {
  const guard = await requirePermission('approve_dealers')
  if (!guard.allowed) throw new Error(guard.error || 'Permission denied')

  const supabase = (await createServerSupabaseClient()) as any

  const { error } = await supabase
    .from('organizations')
    .update({ status: 'rejected', status_notes: reason, updated_at: new Date().toISOString() })
    .eq('id', orgId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/organizations')
}

export async function getOrganizationMembers(orgId: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return []

  const supabase = (await createServerSupabaseClient()) as any

  const { data } = await supabase
    .from('organization_members')
    .select(`
      *,
      user:user_id(id, full_name, phone, avatar_url)
    `)
    .eq('organization_id', orgId)
    .order('created_at', { ascending: true })

  return data || []
}

export async function inviteMember(orgId: string, phone: string, role: string = 'member') {
  const auth = await requireAuth()
  if (!auth.allowed) throw new Error('Authentication required')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', orgId)
    .eq('user_id', auth.userId)
    .eq('is_active', true)
    .single()

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    throw new Error('Only owners and admins can invite members')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('phone', phone)
    .maybeSingle()

  if (!profile) {
    throw new Error('User not found. The user must have an account first.')
  }

  const { data: existing } = await supabase
    .from('organization_members')
    .select('id')
    .eq('organization_id', orgId)
    .eq('user_id', profile.id)
    .maybeSingle()

  if (existing) {
    throw new Error('User is already a member of this organization')
  }

  const { error } = await supabase
    .from('organization_members')
    .insert({
      organization_id: orgId,
      user_id: profile.id,
      role,
      status: 'active',
      is_active: true,
      invited_by: auth.userId,
      invited_at: new Date().toISOString(),
      created_by: auth.userId,
    })

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/team')
}

export async function updateMemberRole(memberId: string, role: string) {
  const auth = await requireAuth()
  if (!auth.allowed) throw new Error('Authentication required')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: member } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('id', memberId)
    .single()

  if (!member) throw new Error('Member not found')

  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', member.organization_id)
    .eq('user_id', auth.userId)
    .eq('is_active', true)
    .single()

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    throw new Error('Permission denied')
  }

  const { error } = await supabase
    .from('organization_members')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', memberId)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/team')
}

export async function removeMember(memberId: string) {
  const auth = await requireAuth()
  if (!auth.allowed) throw new Error('Authentication required')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: member } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('id', memberId)
    .single()

  if (!member) throw new Error('Member not found')

  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', member.organization_id)
    .eq('user_id', auth.userId)
    .eq('is_active', true)
    .single()

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    throw new Error('Permission denied')
  }

  const { data: target } = await supabase
    .from('organization_members')
    .select('role')
    .eq('id', memberId)
    .single()

  if (target?.role === 'owner') {
    throw new Error('Cannot remove the organization owner')
  }

  const { error } = await supabase
    .from('organization_members')
    .update({ is_active: false, status: 'left', updated_at: new Date().toISOString() })
    .eq('id', memberId)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/team')
}

export async function getCurrentOrgId(): Promise<string | null> {
  const auth = await requireAuth()
  if (!auth.allowed) return null

  const supabase = (await createServerSupabaseClient()) as any

  const { data: memberships } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', auth.userId)
    .eq('is_active', true)
    .limit(1)

  return memberships?.[0]?.organization_id || null
}
