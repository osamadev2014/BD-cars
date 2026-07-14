import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { UserRound } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function DriversPage({ params }: Props) {
  const { locale, orgType } = await params
  const isRtl = locale === 'ar'

  const validation = await validateDashboardAccess(locale, orgType)
  if (!validation.allowed) {
    if (validation.redirect) redirect(validation.redirect)
    notFound()
  }

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'السائقون' : 'Drivers'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'السائقون' : 'Drivers' },
        ]}
        locale={locale}
      />
      <DashboardEmptyState
        icon={<UserRound className="h-12 w-12" />}
        title={isRtl ? 'السائقون' : 'Drivers'}
        description={isRtl
          ? 'إدارة السائقين وحالاتهم'
          : 'Manage drivers and their status'}
      />
    </div>
  )
}
