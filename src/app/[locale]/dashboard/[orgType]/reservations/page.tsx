import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { CalendarCheck } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props { params: Promise<{ locale: string; orgType: string }> }

export default async function ReservationsPage({ params }: Props) {
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
        title={isRtl ? 'الحجوزات' : 'Reservations'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'الحجوزات' : 'Reservations' },
        ]}
        locale={locale}
      />
      <DashboardEmptyState
        icon={<CalendarCheck className="h-12 w-12" />}
        title={isRtl ? 'الحجوزات' : 'Reservations'}
        description={isRtl ? 'إدارة حجوزات وطلبات العملاء' : 'Manage customer reservations and requests'}
      />
    </div>
  )
}