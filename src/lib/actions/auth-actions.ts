'use server'

import { resolveAuthenticatedUserId } from '@/server/guards'
import { getAdminClient } from '@/lib/supabase/admin'
import { getUserPermissions } from '@/lib/permissions/permission-service'
import type { UserProfile, RoleSlug } from '@/types'

interface GetCurrentUserOptions {
  includePermissions?: boolean
}

export async function getCurrentUser(
  options: GetCurrentUserOptions = {}
): Promise<UserProfile | null> {
  const userId = await resolveAuthenticatedUserId()
  if (!userId) return null

  const adminClient = getAdminClient() as any

  const [{ data: profile }, { data: userRoles }] = await Promise.all([
    adminClient.from('profiles').select('*').eq('id', userId).single(),
    adminClient
      .from('user_roles')
      .select('role:roles!inner(slug)')
      .eq('user_id', userId),
  ])

  if (!profile) return null

  const roles: RoleSlug[] = (userRoles || []).map(
    (r: { role: { slug: string } }) => r.role.slug as RoleSlug
  )

  let permissions: string[] | undefined
  if (options.includePermissions) {
    permissions = await getUserPermissions(userId)
  }

  return {
    id: profile.id,
    phone: profile.phone,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    locale: profile.locale,
    is_active: profile.is_active,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    last_sign_in_at: profile.last_sign_in_at,
    roles,
    permissions,
  }
}
