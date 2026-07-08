import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import type { AuditAction, EntityType } from '@/types'

export async function createAuditLog(params: {
  userId?: string | null
  action: AuditAction
  entityType: EntityType
  entityId?: string | null
  oldValues?: unknown
  newValues?: unknown
  metadata?: unknown
  ipAddress?: string | null
}) {
  try {
    const adminClient = getAdminClient() as any
    await adminClient.from('audit_logs').insert({
      user_id: params.userId || null,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId || null,
      old_values: params.oldValues || null,
      new_values: params.newValues || null,
      metadata: params.metadata || null,
      ip_address: params.ipAddress || null,
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}

export async function getUserAuditLogs(userId: string, limit = 50) {
  const supabase = (await createServerSupabaseClient()) as any
  const { data } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}

export async function getEntityAuditLogs(
  entityType: EntityType,
  entityId: string,
  limit = 50
) {
  const supabase = (await createServerSupabaseClient()) as any
  const { data } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}
