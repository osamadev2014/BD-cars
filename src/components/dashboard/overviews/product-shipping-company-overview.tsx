import { getDashboardConfig } from '@/config/dashboard/registry'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Package, Clock, Truck, PackageCheck, AlertTriangle, Users, Building2, DollarSign } from 'lucide-react'

interface Props {
  locale: string
  orgId: string
  orgName?: string
  orgNameAr?: string
  orgSlug: string
  data?: { stats: Array<{ label: string; value: string | number }> }
}

export async function ProductShippingCompanyOverview({ locale, orgId, orgName, orgNameAr, orgSlug, data }: Props) {
  const isRtl = locale === 'ar'
  const config = getDashboardConfig(orgSlug as any)
  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || ''

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'لوحة تحكم شركة الشحن' : 'Shipping Company Dashboard'}
        description={displayName}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgSlug}/overview` },
          { label: isRtl ? 'نظرة عامة' : 'Overview' },
        ]}
        locale={locale}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'الطلبات الجديدة' : 'New Orders'}
          value="—"
          icon={<Package className="h-5 w-5" />}
          color="cyan"
        />
        <DashboardStatCard
          label={isRtl ? 'بانتظار الاستلام' : 'Awaiting Pickup'}
          value={data?.stats?.find(s => s.label === 'Awaiting Pickup')?.value ?? '—'}
          icon={<Clock className="h-5 w-5" />}
          color="cyan"
        />
        <DashboardStatCard
          label={isRtl ? 'قيد النقل' : 'In Transit'}
          value={data?.stats?.find(s => s.label === 'In Transit')?.value ?? '—'}
          icon={<Truck className="h-5 w-5" />}
          color="cyan"
        />
        <DashboardStatCard
          label={isRtl ? 'تم التسليم اليوم' : 'Delivered Today'}
          value={data?.stats?.find(s => s.label === 'Delivered Today')?.value ?? '—'}
          icon={<PackageCheck className="h-5 w-5" />}
          color="cyan"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'متأخر' : 'Delayed'}
          value="—"
          icon={<AlertTriangle className="h-5 w-5" />}
          color="cyan"
        />
        <DashboardStatCard
          label={isRtl ? 'السائقون المتاحون' : 'Available Drivers'}
          value="—"
          icon={<Users className="h-5 w-5" />}
          color="cyan"
        />
        <DashboardStatCard
          label={isRtl ? 'سعة المستودع' : 'Warehouse Capacity'}
          value="—"
          icon={<Building2 className="h-5 w-5" />}
          color="cyan"
        />
        <DashboardStatCard
          label={isRtl ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
          value="—"
          icon={<DollarSign className="h-5 w-5" />}
          color="cyan"
        />
      </div>

      <DashboardEmptyState
        title={isRtl ? 'مرحباً بك في لوحة تحكم الشحن' : 'Welcome to Your Shipping Dashboard'}
        description={isRtl
          ? 'قم بإدارة طلبات الشحن والتسليم والسائقين من هنا'
          : 'Manage shipping orders, deliveries, and drivers from here'}
      />
    </div>
  )
}
