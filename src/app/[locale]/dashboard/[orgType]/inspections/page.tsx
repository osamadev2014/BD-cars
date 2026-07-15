import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getInspectionReports } from '@/lib/actions/module-actions'
import { SLUG_TO_DB_MAP } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardDataTable } from '@/components/dashboard/dashboard-data-table'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { SearchCheck } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function InspectionsPage({ params }: Props) {
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
        icon={<SearchCheck className="w-12 h-12 text-gray-300" />}
        title={isRtl ? 'تقارير الفحص غير متاحة' : 'Inspection Reports Not Available'}
        description={isRtl
          ? 'وحدة تقارير الفحص متاحة فقط لمنشآت مراكز الفحص'
          : 'Inspection reports are available for inspection center organizations only'}
      />
    )
  }

  const data = await getInspectionReports(validation.orgId!)

  const columns = [
    {
      key: 'score',
      label: isRtl ? 'النتيجة' : 'Score',
      render: (_val: any, row: any) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          {row.score != null ? `${row.score}/${row.max_score || 100}` : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: isRtl ? 'الحالة' : 'Status',
      render: (val: string) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          val === 'draft' ? 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400' :
          val === 'in_progress' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
          val === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
          val === 'reviewed' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' :
          'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}>
          {isRtl
            ? (val === 'draft' ? 'مسودة' : val === 'in_progress' ? 'قيد الفحص' : val === 'completed' ? 'مكتمل' : val === 'reviewed' ? 'تمت المراجعة' : val)
            : val}
        </span>
      ),
    },
    {
      key: 'outcome',
      label: isRtl ? 'النتيجة' : 'Outcome',
      render: (val: string) => {
        if (!val) return <span className="text-gray-400">—</span>
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            val === 'passed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
            val === 'failed' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
            val === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
            'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}>
            {isRtl
              ? (val === 'passed' ? 'ناجح' : val === 'failed' ? 'راسب' : val === 'pending' ? 'قيد الانتظار' : val)
              : val}
          </span>
        )
      },
    },
    { key: 'recommendation', label: isRtl ? 'التوصية' : 'Recommendation', render: (val: string) => val?.slice(0, 60) || '—' },
    { key: 'inspector_name', label: isRtl ? 'الفحص' : 'Inspector' },
    { key: 'created_at', label: isRtl ? 'التاريخ' : 'Date', render: (val: string) => val ? new Date(val).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US') : '—' },
  ]

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'تقارير الفحص' : 'Inspection Reports'}
        description={isRtl ? `${data.total} تقرير فحص` : `${data.total} inspection reports`}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'تقارير الفحص' : 'Inspection Reports' },
        ]}
        locale={locale}
      />

      <DashboardDataTable
        columns={columns}
        rows={data.rows}
        locale={locale}
        emptyMessage={isRtl ? 'لا توجد تقارير فحص بعد' : 'No inspection reports yet'}
      />
    </div>
  )
}
