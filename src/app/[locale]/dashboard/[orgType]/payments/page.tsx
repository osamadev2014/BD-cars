import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Wallet } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function PaymentsPage({ params }: Props) {
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
        title={isRtl ? 'المدفوعات' : 'Payments'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'المدفوعات' : 'Payments' },
        ]}
        locale={locale}
      />
      <DashboardEmptyState
        icon={<Wallet className="h-12 w-12" />}
        title={isRtl ? 'المدفوعات' : 'Payments'}
        description={isRtl
          ? 'إدارة المدفوعات والتحصيلات'
          : 'Manage payments and collections'}
      />
    </div>
  )
}
