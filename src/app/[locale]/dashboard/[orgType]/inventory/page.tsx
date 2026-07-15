import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getDashboardConfig } from '@/config/dashboard/registry'
import { getDealerInventory } from '@/lib/actions/module-actions'
import { SLUG_TO_DB_MAP } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { InventoryTable } from './inventory-table'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Package, Car, Plus, AlertTriangle, CheckCircle } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string; orgType: string }> }

export default async function InventoryPage({ params }: Props) {
  const { locale, orgType } = await params
  const isRtl = locale === 'ar'
  const validation = await validateDashboardAccess(locale, orgType)
  if (!validation.allowed) {
    if (validation.redirect) redirect(validation.redirect)
    notFound()
  }

  const dbOrgType = SLUG_TO_DB_MAP[orgType as OrgTypeSlug]
  if (dbOrgType !== 'car_dealer') {
    return (
      <DashboardEmptyState
        icon={<Package className="w-12 h-12 text-gray-300" />}
        title={isRtl ? 'المخزون غير متاح' : 'Inventory Not Available'}
        description={isRtl ? 'وحدة المخزون متاحة فقط لمنشآت معارض السيارات' : 'Inventory management is available for car dealer organizations only'}
      />
    )
  }

  const config = getDashboardConfig(orgType as any)
  const data = await getDealerInventory(validation.orgId!)
  const vehicles = data.rows || []

  const total = vehicles.length
  const active = vehicles.filter((v: any) => v.status === 'active').length
  const pending = vehicles.filter((v: any) => v.status === 'pending' || v.status === 'pending_approval').length
  const sold = vehicles.filter((v: any) => v.status === 'sold').length

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={isRtl ? 'المخزون' : 'Inventory'}
        description={isRtl ? `${total} مركبة في المخزون` : `${total} vehicles in inventory`}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'المخزون' : 'Inventory' },
        ]}
        locale={locale}
        action={
          <Link
            href={`/${locale}/dashboard/${orgType}/inventory/new`}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {isRtl ? 'إضافة مركبة' : 'Add Vehicle'}
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardStatCard
          label={isRtl ? 'إجمالي المركبات' : 'Total Vehicles'}
          value={total}
          icon={<Car className="h-5 w-5" />}
          color="blue"
        />
        <DashboardStatCard
          label={isRtl ? 'نشطة' : 'Active'}
          value={active}
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
        <DashboardStatCard
          label={isRtl ? 'بإنتظار الموافقة' : 'Pending Approval'}
          value={pending}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="amber"
        />
        <DashboardStatCard
          label={isRtl ? 'مباعة' : 'Sold'}
          value={sold}
          icon={<Car className="h-5 w-5" />}
          color="purple"
        />
      </div>

      <InventoryTable
        rows={vehicles}
        locale={locale}
        orgType={orgType}
        emptyMessage={isRtl ? 'لم يتم إضافة أي مركبات بعد' : 'No vehicles have been added yet'}
      />
    </div>
  )
}