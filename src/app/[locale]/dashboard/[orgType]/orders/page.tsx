import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getSparePartsOrders } from '@/lib/actions/module-actions'
import { SLUG_TO_DB_MAP } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardDataTable } from '@/components/dashboard/dashboard-data-table'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { ShoppingCart } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function OrdersPage({ params }: Props) {
  const { locale, orgType } = await params
  const isRtl = locale === 'ar'

  const validation = await validateDashboardAccess(locale, orgType)
  if (!validation.allowed) {
    if (validation.redirect) redirect(validation.redirect)
    notFound()
  }

  const isSparePartsSupplier = SLUG_TO_DB_MAP[orgType as OrgTypeSlug] === 'spare_parts_supplier'

  if (!isSparePartsSupplier) {
    return (
      <DashboardEmptyState
        icon={<ShoppingCart className="w-12 h-12 text-gray-300" />}
        title={isRtl ? 'الطلبات غير متاحة' : 'Orders Not Available'}
        description={isRtl
          ? 'وحدة الطلبات متاحة فقط لمنشآت موردي قطع الغيار'
          : 'Orders management is available for spare parts supplier organizations only'}
      />
    )
  }

  const data = await getSparePartsOrders(validation.orgId!)

  const columns = [
    { key: 'id', label: isRtl ? 'رقم الطلب' : 'Order ID' },
    { key: 'total_amount', label: isRtl ? 'المبلغ' : 'Amount' },
    {
      key: 'status',
      label: isRtl ? 'الحالة' : 'Status',
      render: (val: string) => {
        const colors: Record<string, string> = {
          pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
          confirmed: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
          processing: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
          shipped: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
          delivered: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
          cancelled: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
        }
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[val] || 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            {val}
          </span>
        )
      },
    },
    {
      key: 'payment_status',
      label: isRtl ? 'الدفع' : 'Payment',
      render: (val: string) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          val === 'paid' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
          val === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
          val === 'failed' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
          'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}>
          {isRtl
            ? (val === 'paid' ? 'مدفوع' : val === 'pending' ? 'قيد الانتظار' : val === 'failed' ? 'فشل' : val)
            : val}
        </span>
      ),
    },
    { key: 'customer_name', label: isRtl ? 'العميل' : 'Customer' },
    {
      key: 'created_at',
      label: isRtl ? 'التاريخ' : 'Date',
      render: (val: string) => val ? new Date(val).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US') : '—',
    },
  ]

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'الطلبات' : 'Orders'}
        description={isRtl ? `${data.total} طلب` : `${data.total} orders`}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'الطلبات' : 'Orders' },
        ]}
        locale={locale}
      />

      <DashboardDataTable
        columns={columns}
        rows={data.rows}
        locale={locale}
        emptyMessage={isRtl ? 'لا توجد طلبات بعد' : 'No orders yet'}
      />
    </div>
  )
}