import { cache } from 'react'
import { getAdminClient } from '@/lib/supabase/admin'
import { createAuditLog } from '@/lib/audit/audit-service'
import type { RoleSlug } from '@/types'

type PermissionCheck = {
  allowed: boolean
  reason?: string
}

export const getUserRoles = cache(async (userId: string): Promise<RoleSlug[]> => {
  try {
    const supabase = getAdminClient() as any
    const { data } = await supabase
      .from('user_roles')
      .select('role:roles!inner(slug)')
      .eq('user_id', userId)

    if (!data) return []
    return data.map((r: { role: { slug: string } }) => r.role.slug as RoleSlug)
  } catch {
    return []
  }
})

export const getUserPermissions = cache(
  async (userId: string): Promise<string[]> => {
    try {
      const supabase = getAdminClient() as any
      const { data } = await supabase
        .from('user_roles')
        .select(
          'role:roles!inner(role_permissions!inner(permission:permissions!inner(slug)))'
        )
        .eq('user_id', userId)

      if (!data) return []

      const permissions = new Set<string>()
      for (const row of data) {
        const role = row.role as {
          role_permissions: Array<{
            permission: { slug: string }
          }>
        }
        for (const rp of role.role_permissions) {
          permissions.add(rp.permission.slug)
        }
      }

      return Array.from(permissions)
    } catch {
      return []
    }
  }
)

export async function checkPermission(
  userId: string,
  requiredPermission: string
): Promise<PermissionCheck> {
  const permissions = await getUserPermissions(userId)
  const allowed = permissions.includes(requiredPermission)
  return {
    allowed,
    reason: allowed ? undefined : `Missing permission: ${requiredPermission}`,
  }
}

export async function checkRole(
  userId: string,
  requiredRole: RoleSlug
): Promise<PermissionCheck> {
  const roles = await getUserRoles(userId)
  const allowed = roles.includes(requiredRole)
  return {
    allowed,
    reason: allowed ? undefined : `Missing role: ${requiredRole}`,
  }
}

export async function hasAnyPermission(
  userId: string,
  permissions: string[]
): Promise<boolean> {
  const userPerms = await getUserPermissions(userId)
  return permissions.some((p) => userPerms.includes(p))
}

export async function hasAllPermissions(
  userId: string,
  permissions: string[]
): Promise<boolean> {
  const userPerms = await getUserPermissions(userId)
  return permissions.every((p) => userPerms.includes(p))
}

export async function assignRole(
  userId: string,
  roleId: string,
  assignedBy?: string
): Promise<boolean> {
  try {
    const adminClient = getAdminClient() as any

    const { data: existing } = await adminClient
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role_id', roleId)
      .maybeSingle()

    if (existing) return true

    await adminClient.from('user_roles').insert({
      user_id: userId,
      role_id: roleId,
    })

    await createAuditLog({
      userId: assignedBy,
      action: 'update',
      entityType: 'role',
      entityId: roleId,
      metadata: { affected_user: userId, action: 'role_assigned' },
    })

    return true
  } catch (error) {
    console.error('Failed to assign role:', error)
    return false
  }
}

export async function removeRole(
  userId: string,
  roleId: string,
  removedBy?: string
): Promise<boolean> {
  try {
    const adminClient = getAdminClient() as any

    await adminClient
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId)

    await createAuditLog({
      userId: removedBy,
      action: 'update',
      entityType: 'role',
      entityId: roleId,
      metadata: { affected_user: userId, action: 'role_removed' },
    })

    return true
  } catch (error) {
    console.error('Failed to remove role:', error)
    return false
  }
}
