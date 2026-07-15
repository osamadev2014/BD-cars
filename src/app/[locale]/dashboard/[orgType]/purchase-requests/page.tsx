import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getDealerPurchaseRequests } from '@/lib/actions/module-actions'
import { SLUG_TO_DB_MAP } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardDataTable } from '@/components/dashboard/dashboard-data-table'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { ClipboardList } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function PurchaseRequestsPage({ params }: Props) {
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
        icon={<ClipboardList className="w-12 h-12 text-gray-300" />}
        title={isRtl ? 'غير متاح' : 'Not Available'}
        description={isRtl ? 'طلبات الشراء متاحة فقط لمعارض السيارات' : 'Purchase requests are available for car dealers only'}
      />
    )
  }

  const data = await getDealerPurchaseRequests(validation.orgId!)

  const columns = [
    { key: 'title', label: isRtl ? 'المركبة' : 'Vehicle' },
    { key: 'customer_name', label: isRtl ? 'العميل' : 'Customer' },
    { key: 'budget_min', label: isRtl ? 'الميزانية' : 'Budget' },
    {
      key: 'status',
      label: isRtl ? 'الحالة' : 'Status',
      render: (val: string) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          val === 'open' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
          val === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
          val === 'accepted' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
          val === 'rejected' || val === 'closed' ? 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400' :
          'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}>
          {isRtl
            ? (val === 'open' ? 'مفتوح' : val === 'pending' ? 'قيد الانتظار' : val === 'accepted' ? 'مقبول' : val === 'rejected' ? 'مرفوض' : val === 'closed' ? 'مغلق' : val)
            : val}
        </span>
      ),
    },
    { key: 'created_at', label: isRtl ? 'التاريخ' : 'Date', render: (val: string) => val ? new Date(val).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US') : '—' },
  ]

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'طلبات الشراء' : 'Purchase Requests'}
        description={isRtl ? `${data.total} طلب شراء` : `${data.total} purchase requests`}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'طلبات الشراء' : 'Purchase Requests' },
        ]}
        locale={locale}
      />

      <DashboardDataTable
        columns={columns}
        rows={data.rows}
        locale={locale}
        emptyMessage={isRtl ? 'لا توجد طلبات شراء بعد' : 'No purchase requests yet'}
      />
    </div>
  )
}
