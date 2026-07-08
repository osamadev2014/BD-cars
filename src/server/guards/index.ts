import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserPermissions, getUserRoles, checkPermission, checkRole } from '@/lib/permissions/permission-service'
import type { RoleSlug } from '@/types'

export interface GuardResult {
  allowed: boolean
  error?: string
  status?: number
}

async function safeGuard<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export async function requireAuth(): Promise<GuardResult & { userId?: string }> {
  return safeGuard(async () => {
    const supabase = (await createServerSupabaseClient()) as any
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return { allowed: false, error: 'Authentication required', status: 401 }
    }

    return { allowed: true, userId: session.user.id }
  }, { allowed: false, error: 'Service unavailable', status: 503 })
}

export async function requirePermission(
  permission: string
): Promise<GuardResult & { userId?: string }> {
  return safeGuard(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) return auth

    const result = await checkPermission(auth.userId!, permission)
    if (!result.allowed) {
      return {
        allowed: false,
        error: result.reason || 'Permission denied',
        status: 403,
      }
    }

    return { allowed: true, userId: auth.userId }
  }, { allowed: false, error: 'Service unavailable', status: 503 })
}

export async function requireRole(
  role: RoleSlug
): Promise<GuardResult & { userId?: string }> {
  return safeGuard(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) return auth

    const result = await checkRole(auth.userId!, role)
    if (!result.allowed) {
      return {
        allowed: false,
        error: result.reason || 'Role required',
        status: 403,
      }
    }

    return { allowed: true, userId: auth.userId }
  }, { allowed: false, error: 'Service unavailable', status: 503 })
}

export async function getCurrentUserId(): Promise<string | null> {
  return safeGuard(async () => {
    const auth = await requireAuth()
    return auth.allowed ? auth.userId! : null
  }, null)
}

export async function requireOwnership(
  entityType: string,
  entityId: string,
  ownerField = 'user_id'
): Promise<GuardResult & { userId?: string }> {
  return safeGuard(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) return auth

    const supabase = (await createServerSupabaseClient()) as any
    const { data } = await supabase
      .from(entityType)
      .select(ownerField)
      .eq('id', entityId)
      .single()

    if (!data) {
      return { allowed: false, error: 'Entity not found', status: 404 }
    }

    if (data[ownerField] !== auth.userId) {
      return { allowed: false, error: 'Not authorized', status: 403 }
    }

    return { allowed: true, userId: auth.userId }
  }, { allowed: false, error: 'Service unavailable', status: 503 })
}

export async function requireFeatureEnabled(
  featureKey: string
): Promise<GuardResult> {
  const { isFeatureEnabled } = await import('@/lib/settings/settings-service')
  const enabled = await isFeatureEnabled(featureKey)

  if (!enabled) {
    return { allowed: false, error: 'Feature is disabled', status: 403 }
  }

  return { allowed: true }
}

export async function requireSettingsAccess(
  category: string
): Promise<GuardResult & { userId?: string }> {
  return requirePermission('edit_settings')
}
