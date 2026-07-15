import { getDashboardConfig } from '@/config/dashboard/registry'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Package, CheckCircle, AlertTriangle, XCircle, ShoppingCart, Truck, DollarSign, Building2 } from 'lucide-react'

interface Props {
  locale: string
  orgId: string
  orgName?: string
  orgNameAr?: string
  orgSlug: string
  data?: { stats: Array<{ label: string; value: string | number }> }
}

export async function SparePartsSupplierOverview({ locale, orgId, orgName, orgNameAr, orgSlug, data }: Props) {
  const isRtl = locale === 'ar'
  const config = getDashboardConfig(orgSlug as any)
  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || ''

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'لوحة تحكم مورد قطع الغيار' : 'Spare Parts Supplier Dashboard'}
        description={displayName}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgSlug}/overview` },
          { label: isRtl ? 'نظرة عامة' : 'Overview' },
        ]}
        locale={locale}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'إجمالي المنتجات' : 'Total Products'}
          value={data?.stats?.find(s => s.label === 'Total Products')?.value ?? '—'}
          icon={<Package className="h-5 w-5" />}
          color="purple"
        />
        <DashboardStatCard
          label={isRtl ? 'متاح' : 'Available'}
          value="—"
          icon={<CheckCircle className="h-5 w-5" />}
          color="purple"
        />
        <DashboardStatCard
          label={isRtl ? 'مخزون منخفض' : 'Low Stock'}
          value={data?.stats?.find(s => s.label === 'Low Stock')?.value ?? '—'}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="purple"
        />
        <DashboardStatCard
          label={isRtl ? 'نفذ من المخزون' : 'Out of Stock'}
          value={data?.stats?.find(s => s.label === 'Out of Stock')?.value ?? '—'}
          icon={<XCircle className="h-5 w-5" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'طلبات جديدة' : 'New Orders'}
          value={data?.stats?.find(s => s.label === 'New Orders')?.value ?? '—'}
          icon={<ShoppingCart className="h-5 w-5" />}
          color="purple"
        />
        <DashboardStatCard
          label={isRtl ? 'شحنات معلقة' : 'Pending Shipments'}
          value="—"
          icon={<Truck className="h-5 w-5" />}
          color="purple"
        />
        <DashboardStatCard
          label={isRtl ? 'المبيعات الشهرية' : 'Monthly Sales'}
          value="—"
          icon={<DollarSign className="h-5 w-5" />}
          color="purple"
        />
        <DashboardStatCard
          label={isRtl ? 'قيمة المخزون' : 'Inventory Value'}
          value="—"
          icon={<Building2 className="h-5 w-5" />}
          color="purple"
        />
      </div>

      <DashboardEmptyState
        title={isRtl ? 'مرحباً بك في لوحة تحكم المورد' : 'Welcome to Your Spare Parts Supplier Dashboard'}
        description={isRtl
          ? 'قم بإدارة المنتجات والمخزون والطلبات من هنا'
          : 'Manage products, inventory, and orders from here'}
      />
    </div>
  )
}
