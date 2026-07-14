import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Shield } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function RolesPage({ params }: Props) {
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
        title={isRtl ? 'الأدوار والصلاحيات' : 'Roles & Permissions'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'الأدوار والصلاحيات' : 'Roles & Permissions' },
        ]}
        locale={locale}
      />
      <DashboardEmptyState
        icon={<Shield className="h-12 w-12" />}
        title={isRtl ? 'الأدوار والصلاحيات' : 'Roles & Permissions'}
        description={isRtl
          ? 'إدارة الأدوار والصلاحيات للموظفين'
          : 'Manage roles and permissions for employees'}
      />
    </div>
  )
}
