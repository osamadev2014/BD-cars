import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { MapPin } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function LiveTrackingPage({ params }: Props) {
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
        title={isRtl ? 'التتبع المباشر' : 'Live Tracking'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'التتبع المباشر' : 'Live Tracking' },
        ]}
        locale={locale}
      />
      <DashboardEmptyState
        icon={<MapPin className="h-12 w-12" />}
        title={isRtl ? 'التتبع المباشر' : 'Live Tracking'}
        description={isRtl
          ? 'تتبع الشحنات والناقلات في الوقت الفعلي'
          : 'Real-time tracking of shipments and carriers'}
      />
    </div>
  )
}
