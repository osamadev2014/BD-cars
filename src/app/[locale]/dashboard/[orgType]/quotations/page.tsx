import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getDealerQuotations } from '@/lib/actions/module-actions'
import { SLUG_TO_DB_MAP } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardDataTable } from '@/components/dashboard/dashboard-data-table'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { FileSpreadsheet } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function QuotationsPage({ params }: Props) {
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
        icon={<FileSpreadsheet className="w-12 h-12 text-gray-300" />}
        title={isRtl ? 'غير متاح' : 'Not Available'}
        description={isRtl ? 'عروض الأسعار متاحة فقط لمعارض السيارات' : 'Quotations are available for car dealers only'}
      />
    )
  }

  const data = await getDealerQuotations(validation.orgId!)

  const columns = [
    { key: 'title', label: isRtl ? 'الطلب' : 'Request' },
    { key: 'amount', label: isRtl ? 'المبلغ' : 'Amount' },
    {
      key: 'status',
      label: isRtl ? 'الحالة' : 'Status',
      render: (val: string) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          val === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
          val === 'accepted' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
          val === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
          val === 'draft' ? 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400' :
          'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}>
          {isRtl
            ? (val === 'pending' ? 'قيد الانتظار' : val === 'accepted' ? 'مقبول' : val === 'rejected' ? 'مرفوض' : val === 'draft' ? 'مسودة' : val)
            : val}
        </span>
      ),
    },
    { key: 'valid_until', label: isRtl ? 'صالح حتى' : 'Valid Until' },
    { key: 'created_at', label: isRtl ? 'التاريخ' : 'Date', render: (val: string) => val ? new Date(val).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US') : '—' },
  ]

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'عروض الأسعار' : 'Quotations'}
        description={isRtl ? `${data.total} عرض سعر` : `${data.total} quotations`}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'عروض الأسعار' : 'Quotations' },
        ]}
        locale={locale}
      />

      <DashboardDataTable
        columns={columns}
        rows={data.rows}
        locale={locale}
        emptyMessage={isRtl ? 'لا توجد عروض أسعار بعد' : 'No quotations yet'}
      />
    </div>
  )
}
