import { redirect } from 'next/navigation'
import { requireAuth } from '@/server/guards'
import { getAdminClient } from '@/lib/supabase/admin'
import { ORG_TYPE_SLUG_MAP } from '@/config/dashboard'
import type { DbOrgType } from '@/config/dashboard'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function OldDashboardRedirect({ params }: Props) {
  const { locale } = await params
  const auth = await requireAuth()

  if (!auth.allowed || !auth.userId) {
    redirect(`/${locale}/login`)
  }

  const admin = getAdminClient() as any
  const { data: memberships } = await admin
    .from('organization_members')
    .select('organization_id, organizations!inner(id, org_type)')
    .eq('user_id', auth.userId)
    .eq('is_active', true)

  if (!memberships || memberships.length === 0) {
    redirect(`/${locale}/business/select`)
  }

  const firstOrg = memberships[0].organizations as any
  const slug = ORG_TYPE_SLUG_MAP[firstOrg.org_type as DbOrgType]

  if (slug) {
    redirect(`/${locale}/dashboard/${slug}/overview`)
  }

  redirect(`/${locale}/business/select`)
}
