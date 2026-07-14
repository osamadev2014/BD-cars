import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Truck } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function ActiveShipmentsPage({ params }: Props) {
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
        title={isRtl ? 'الشحنات النشطة' : 'Active Shipments'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'الشحنات النشطة' : 'Active Shipments' },
        ]}
        locale={locale}
      />
      <DashboardEmptyState
        icon={<Truck className="h-12 w-12" />}
        title={isRtl ? 'الشحنات النشطة' : 'Active Shipments'}
        description={isRtl
          ? 'متابعة الشحنات الجاري نقلها حالياً'
          : 'Track currently active shipments'}
      />
    </div>
  )
}
