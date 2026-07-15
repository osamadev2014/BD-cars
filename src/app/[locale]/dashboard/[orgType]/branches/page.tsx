import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getDealerBranches } from '@/lib/actions/module-actions'
import { SLUG_TO_DB_MAP } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardDataTable } from '@/components/dashboard/dashboard-data-table'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Store } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function BranchesPage({ params }: Props) {
  const { locale, orgType } = await params
  const isRtl = locale === 'ar'

  const validation = await validateDashboardAccess(locale, orgType)
  if (!validation.allowed) {
    if (validation.redirect) redirect(validation.redirect)
    notFound()
  }

  const isCarDealer = SLUG_TO_DB_MAP[orgType as OrgTypeSlug] === 'car_dealer'
  if (!isCarDealer) {
    return (
      <DashboardEmptyState
        icon={<Store className="w-12 h-12 text-gray-300" />}
        title={isRtl ? 'غير متاح' : 'Not Available'}
        description={isRtl ? 'إدارة الفروع متاحة فقط لمعارض السيارات' : 'Branch management is available for car dealers only'}
      />
    )
  }

  const data = await getDealerBranches(validation.orgId!)

  const columns = [
    { key: 'name_en', label: isRtl ? 'الاسم' : 'Name', render: (_: any, row: any) => isRtl ? (row.name_ar || row.name_en) : row.name_en },
    { key: 'phone', label: isRtl ? 'الهاتف' : 'Phone' },
    { key: 'city', label: isRtl ? 'المدينة' : 'City' },
    {
      key: 'is_headquarters',
      label: isRtl ? 'الفرع الرئيسي' : 'Headquarters',
      render: (val: boolean) => val ? (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
          {isRtl ? 'الرئيسي' : 'Main'}
        </span>
      ) : '—',
    },
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
  ]

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'الفروع' : 'Branches'}
        description={isRtl ? `${data.total} فرع` : `${data.total} branches`}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'الفروع' : 'Branches' },
        ]}
        locale={locale}
      />

      <DashboardDataTable
        columns={columns}
        rows={data.rows}
        locale={locale}
        emptyMessage={isRtl ? 'لا توجد فروع بعد' : 'No branches yet'}
      />
    </div>
  )
}
