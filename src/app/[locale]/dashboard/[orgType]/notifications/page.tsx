import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Bell, Settings } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function NotificationsPage({ params }: Props) {
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
        title={isRtl ? 'الإشعارات' : 'Notifications'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'نظرة عامة' : 'Overview', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'الإشعارات' : 'Notifications' },
        ]}
        locale={locale}
        action={
          <Link
            href={`/${locale}/dashboard/notifications/preferences`}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings className="h-4 w-4" />
            {isRtl ? 'الإعدادات' : 'Settings'}
          </Link>
        }
      />
      <DashboardEmptyState
        icon={<Bell className="h-12 w-12" />}
        title={isRtl ? 'لا توجد إشعارات' : 'No Notifications'}
        description={isRtl
          ? 'ستظهر هنا إشعارات الشحنات والتحديثات الهامة'
          : 'Shipment notifications and important updates will appear here'}
      />
    </div>
  )
}
