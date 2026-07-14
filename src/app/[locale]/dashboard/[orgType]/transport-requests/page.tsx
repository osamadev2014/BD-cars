import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { ClipboardList } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function TransportRequestsPage({ params }: Props) {
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
        title={isRtl ? 'طلبات النقل' : 'Transport Requests'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'طلبات النقل' : 'Transport Requests' },
        ]}
        locale={locale}
      />
      <DashboardEmptyState
        icon={<ClipboardList className="h-12 w-12" />}
        title={isRtl ? 'طلبات النقل' : 'Transport Requests'}
        description={isRtl
          ? 'إدارة طلبات نقل المركبات الجديدة'
          : 'Manage new vehicle transport requests'}
      />
    </div>
  )
}
