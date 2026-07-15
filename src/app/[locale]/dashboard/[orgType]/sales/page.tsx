import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getDealerSales } from '@/lib/actions/module-actions'
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

export default async function SalesPage({ params }: Props) {
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
        icon={<ShoppingCart className="w-12 h-12 text-gray-300" />}
        title={isRtl ? 'غير متاح' : 'Not Available'}
        description={isRtl ? 'وحدة المبيعات متاحة فقط لمعارض السيارات' : 'Sales module is available for car dealers only'}
      />
    )
  }

  const data = await getDealerSales(validation.orgId!)

  const columns = [
    { key: 'vehicle', label: isRtl ? 'المركبة' : 'Vehicle' },
    { key: 'price', label: isRtl ? 'السعر' : 'Price' },
    { key: 'sold_date', label: isRtl ? 'تاريخ البيع' : 'Sale Date', render: (val: string) => val ? new Date(val).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US') : '—' },
  ]

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'المبيعات' : 'Sales'}
        description={isRtl ? `${data.total} عملية بيع` : `${data.total} sales`}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'المبيعات' : 'Sales' },
        ]}
        locale={locale}
      />

      <DashboardDataTable
        columns={columns}
        rows={data.rows}
        locale={locale}
        emptyMessage={isRtl ? 'لا توجد مبيعات بعد' : 'No sales recorded yet'}
      />
    </div>
  )
}
