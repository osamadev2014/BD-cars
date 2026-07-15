import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getSparePartsProducts } from '@/lib/actions/module-actions'
import { SLUG_TO_DB_MAP } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardDataTable } from '@/components/dashboard/dashboard-data-table'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Package } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function ProductsPage({ params }: Props) {
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
        icon={<Package className="w-12 h-12 text-gray-300" />}
        title={isRtl ? 'المنتجات غير متاحة' : 'Products Not Available'}
        description={isRtl
          ? 'وحدة المنتجات متاحة فقط لمنشآت موردي قطع الغيار'
          : 'Products management is available for spare parts supplier organizations only'}
      />
    )
  }

  const data = await getSparePartsProducts(validation.orgId!)

  const columns = [
    { key: 'title', label: isRtl ? 'المنتج' : 'Product' },
    { key: 'part_number', label: isRtl ? 'رقم القطعة' : 'Part Number' },
    { key: 'brand_name', label: isRtl ? 'العلامة التجارية' : 'Brand' },
    {
      key: 'stock_quantity',
      label: isRtl ? 'المخزون' : 'Stock',
      render: (val: number) => {
        const color = val < 5 ? 'text-red-600 dark:text-red-400 font-semibold' :
                      val < 10 ? 'text-amber-600 dark:text-amber-400 font-semibold' :
                      'text-gray-700 dark:text-gray-300'
        return <span className={color}>{val}</span>
      },
    },
    { key: 'price', label: isRtl ? 'السعر' : 'Price' },
    {
      key: 'status',
      label: isRtl ? 'الحالة' : 'Status',
      render: (val: string) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          val === 'active' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
          'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}>
          {isRtl ? (val === 'active' ? 'نشط' : 'غير نشط') : val}
        </span>
      ),
    },
  ]

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'المنتجات' : 'Products'}
        description={isRtl ? `${data.total} منتج` : `${data.total} products`}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'المنتجات' : 'Products' },
        ]}
        locale={locale}
      />

      <DashboardDataTable
        columns={columns}
        rows={data.rows}
        locale={locale}
        emptyMessage={isRtl ? 'لم يتم إضافة أي منتجات بعد' : 'No products have been added yet'}
      />
    </div>
  )
}