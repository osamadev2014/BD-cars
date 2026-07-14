import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { UserCheck } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function DriverReportsPage({ params }: Props) {
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
        title={isRtl ? 'تقارير السائقين' : 'Driver Reports'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'التقارير' : 'Reports', href: `/${locale}/dashboard/${orgType}/reports` },
          { label: isRtl ? 'تقارير السائقين' : 'Driver Reports' },
        ]}
        locale={locale}
      />
      <DashboardEmptyState
        icon={<UserCheck className="h-12 w-12" />}
        title={isRtl ? 'تقارير السائقين' : 'Driver Reports'}
        description={isRtl
          ? 'تحليل أداء السائقين وإنتاجيتهم'
          : 'Analyze driver performance and productivity'}
      />
    </div>
  )
}
