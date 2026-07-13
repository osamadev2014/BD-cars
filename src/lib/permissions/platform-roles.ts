import type { RoleSlug } from '@/types'

const PLATFORM_ADMIN_ROLES: readonly string[] = [
  'system_owner',
  'super_admin',
  'admin',
] as const

export function isPlatformAdmin(roles: string[] | undefined): boolean {
  if (!roles || roles.length === 0) return false
  return roles.some((r) => PLATFORM_ADMIN_ROLES.includes(r))
}

export function getHighestPlatformRole(roles: string[] | undefined): RoleSlug | null {
  if (!roles || roles.length === 0) return null
  for (const tier of PLATFORM_ADMIN_ROLES) {
    if (roles.includes(tier)) return tier as RoleSlug
  }
  return null
}
