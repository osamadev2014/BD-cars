import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Settings } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function OrganizationSettingsPage({ params }: Props) {
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
        title={isRtl ? 'إعدادات المنشأة' : 'Organization Settings'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'إعدادات المنشأة' : 'Organization Settings' },
        ]}
        locale={locale}
      />
      <DashboardEmptyState
        icon={<Settings className="h-12 w-12" />}
        title={isRtl ? 'إعدادات المنشأة' : 'Organization Settings'}
        description={isRtl
          ? 'إدارة إعدادات المنشأة وتفضيلاتها'
          : 'Manage organization settings and preferences'}
      />
    </div>
  )
}
