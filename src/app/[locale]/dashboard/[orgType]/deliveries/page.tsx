import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { PackageCheck } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function DeliveriesPage({ params }: Props) {
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
        title={isRtl ? 'عمليات التسليم' : 'Delivery Operations'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'عمليات التسليم' : 'Delivery Operations' },
        ]}
        locale={locale}
      />
      <DashboardEmptyState
        icon={<PackageCheck className="h-12 w-12" />}
        title={isRtl ? 'عمليات التسليم' : 'Delivery Operations'}
        description={isRtl
          ? 'إدارة عمليات تسليم المركبات'
          : 'Manage vehicle delivery operations'}
      />
    </div>
  )
}
