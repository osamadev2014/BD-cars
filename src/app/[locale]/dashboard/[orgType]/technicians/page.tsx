import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getInspectionTechnicians } from '@/lib/actions/module-actions'
import { SLUG_TO_DB_MAP } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardDataTable } from '@/components/dashboard/dashboard-data-table'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Users } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function TechniciansPage({ params }: Props) {
  const { locale, orgType } = await params
  const isRtl = locale === 'ar'

  const validation = await validateDashboardAccess(locale, orgType)
  if (!validation.allowed) {
    if (validation.redirect) redirect(validation.redirect)
    notFound()
  }

  const isInspectionCenter = SLUG_TO_DB_MAP[orgType as OrgTypeSlug] === 'inspection_center'

  if (!isInspectionCenter) {
    return (
      <DashboardEmptyState
        icon={<Users className="w-12 h-12 text-gray-300" />}
        title={isRtl ? 'الفنيين غير متاحين' : 'Technicians Not Available'}
        description={isRtl
          ? 'وحدة الفنيين متاحة فقط لمنشآت مراكز الفحص'
          : 'Technicians management is available for inspection center organizations only'}
      />
    )
  }

  const data = await getInspectionTechnicians(validation.orgId!)

  const columns = [
    { key: 'name', label: isRtl ? 'الاسم' : 'Name' },
    { key: 'email', label: isRtl ? 'البريد الإلكتروني' : 'Email' },
    { key: 'role', label: isRtl ? 'الدور' : 'Role' },
    {
      key: 'is_active',
      label: isRtl ? 'الحالة' : 'Status',
      render: (val: boolean) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          val ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
          'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}>
          {isRtl ? (val ? 'نشط' : 'غير نشط') : (val ? 'Active' : 'Inactive')}
        </span>
      ),
    },
    { key: 'created_at', label: isRtl ? 'تاريخ الانضمام' : 'Join Date', render: (val: string) => val ? new Date(val).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US') : '—' },
  ]

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'الفنيين' : 'Technicians'}
        description={isRtl ? `${data.total} فني` : `${data.total} technicians`}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'الفنيين' : 'Technicians' },
        ]}
        locale={locale}
      />

      <DashboardDataTable
        columns={columns}
        rows={data.rows}
        locale={locale}
        emptyMessage={isRtl ? 'لا يوجد فنيين بعد' : 'No technicians yet'}
      />
    </div>
  )
}
