import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Users } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function CustomersPage({ params }: Props) {
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
        title={isRtl ? 'العملاء' : 'Customers'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'العملاء' : 'Customers' },
        ]}
        locale={locale}
      />
      <DashboardEmptyState
        icon={<Users className="h-12 w-12" />}
        title={isRtl ? 'العملاء' : 'Customers'}
        description={isRtl
          ? 'إدارة العملاء وحساباتهم'
          : 'Manage customers and their accounts'}
      />
    </div>
  )
}
