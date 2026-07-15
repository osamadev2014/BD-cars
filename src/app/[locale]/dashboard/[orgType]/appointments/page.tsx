import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getInspectionAppointments } from '@/lib/actions/module-actions'
import { SLUG_TO_DB_MAP } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardDataTable } from '@/components/dashboard/dashboard-data-table'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Calendar } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function AppointmentsPage({ params }: Props) {
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
        icon={<Calendar className="w-12 h-12 text-gray-300" />}
        title={isRtl ? 'المواعيد غير متاحة' : 'Appointments Not Available'}
        description={isRtl
          ? 'وحدة المواعيد متاحة فقط لمنشآت مراكز الفحص'
          : 'Appointments management is available for inspection center organizations only'}
      />
    )
  }

  const data = await getInspectionAppointments(validation.orgId!)

  const columns = [
    { key: 'customer_name', label: isRtl ? 'العميل' : 'Customer' },
    { key: 'service_name', label: isRtl ? 'الخدمة' : 'Service' },
    { key: 'appointment_date', label: isRtl ? 'التاريخ' : 'Date', render: (val: string) => val ? new Date(val).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US') : '—' },
    {
      key: 'status',
      label: isRtl ? 'الحالة' : 'Status',
      render: (val: string) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          val === 'scheduled' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
          val === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
          val === 'cancelled' ? 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400' :
          val === 'no_show' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
          'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}>
          {isRtl
            ? (val === 'scheduled' ? 'مجدول' : val === 'completed' ? 'مكتمل' : val === 'cancelled' ? 'ملغي' : val === 'no_show' ? 'لم يحضر' : val)
            : val}
        </span>
      ),
    },
    { key: 'price', label: isRtl ? 'السعر' : 'Price' },
    {
      key: 'payment_status',
      label: isRtl ? 'الدفع' : 'Payment',
      render: (val: string) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          val === 'paid' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
          val === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
          val === 'refunded' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' :
          'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}>
          {isRtl
            ? (val === 'paid' ? 'مدفوع' : val === 'pending' ? 'قيد الانتظار' : val === 'refunded' ? 'مسترجع' : val)
            : val}
        </span>
      ),
    },
  ]

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'المواعيد' : 'Appointments'}
        description={isRtl ? `${data.total} موعد` : `${data.total} appointments`}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'المواعيد' : 'Appointments' },
        ]}
        locale={locale}
      />

      <DashboardDataTable
        columns={columns}
        rows={data.rows}
        locale={locale}
        emptyMessage={isRtl ? 'لا توجد مواعيد بعد' : 'No appointments yet'}
      />
    </div>
  )
}
