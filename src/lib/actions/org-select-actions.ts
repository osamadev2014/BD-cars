'use server'

import { requireAuth } from '@/server/guards'
import { getAdminClient } from '@/lib/supabase/admin'

export async function validateOrgAccess(orgId: string): Promise<{ allowed: boolean; error?: string }> {
  const auth = await requireAuth()
  if (!auth.allowed || !auth.userId) {
    return { allowed: false, error: 'Authentication required' }
  }

  const admin = getAdminClient() as any
  const { data: membership } = await admin
    .from('organization_members')
    .select('id, role, status')
    .eq('organization_id', orgId)
    .eq('user_id', auth.userId)
    .eq('is_active', true)
    .maybeSingle()

  if (!membership) {
    return { allowed: false, error: 'Access denied' }
  }

  const { data: org } = await admin
    .from('organizations')
    .select('status, is_active')
    .eq('id', orgId)
    .single()

  if (org?.status === 'suspended') {
    return { allowed: false, error: 'Organization suspended' }
  }

  return { allowed: true }
}
