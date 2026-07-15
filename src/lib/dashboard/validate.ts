import { requireAuth } from '@/server/guards'
import { getAdminClient } from '@/lib/supabase/admin'
import { SLUG_TO_DB_MAP, VALID_ORG_SLUGS } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'

export interface DashboardValidation {
  allowed: boolean
  orgId?: string
  orgType?: string
  orgName?: string
  orgNameAr?: string
  userId?: string
  userRole?: string
  error?: string
  redirect?: string
}

export async function validateDashboardAccess(
  locale: string,
  orgSlug: string,
  requiredPermission?: string
): Promise<DashboardValidation> {
  const auth = await requireAuth()
  if (!auth.allowed || !auth.userId) {
    return { allowed: false, error: 'Authentication required', redirect: `/${locale}/login?redirect=/${locale}/dashboard/${orgSlug}` }
  }

  if (!VALID_ORG_SLUGS.includes(orgSlug as OrgTypeSlug)) {
    return { allowed: false, error: 'Invalid organization type' }
  }

  const dbOrgType = SLUG_TO_DB_MAP[orgSlug as OrgTypeSlug]
  const admin = getAdminClient() as any

  const { data: membership, error: memberError } = await admin
    .from('organization_members')
    .select('id, role, organization_id')
    .eq('user_id', auth.userId)
    .eq('is_active', true)

  if (memberError || !membership || membership.length === 0) {
    return { allowed: false, error: 'No organization membership', redirect: `/${locale}/business/select` }
  }

  const orgIds = membership.map((m: any) => m.organization_id)

  const { data: org } = await admin
    .from('organizations')
    .select('id, org_type, status, is_active, name, name_ar')
    .in('id', orgIds)
    .eq('org_type', dbOrgType)
    .eq('status', 'active')
    .eq('is_active', true)
    .maybeSingle()

  if (!org) {
    return { allowed: false, error: 'No matching organization', redirect: `/${locale}/business/select` }
  }

  const activeMembership = membership.find((m: any) => m.organization_id === org.id)

  if (requiredPermission) {
    const { data: permCheck } = await admin.rpc('check_org_permission', {
      p_role_slug: activeMembership.role,
      p_permission: requiredPermission,
    })
    if (!permCheck) {
      return { allowed: false, error: 'Insufficient permissions' }
    }
  }

  return {
    allowed: true,
    orgId: org.id,
    orgType: org.org_type,
    orgName: org.name,
    orgNameAr: org.name_ar,
    userId: auth.userId,
    userRole: activeMembership.role,
  }
}
