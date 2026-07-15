import { getDashboardConfig } from '@/config/dashboard/registry'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Car, ClipboardList, FileSpreadsheet, MessageSquare, CheckCircle, Truck, DollarSign, CreditCard } from 'lucide-react'

interface Props {
  locale: string
  orgId: string
  orgName?: string
  orgNameAr?: string
  orgSlug: string
  data?: { stats: Array<{ label: string; value: string | number }> }
}

export async function WholesaleCarTraderOverview({ locale, orgId, orgName, orgNameAr, orgSlug, data }: Props) {
  const isRtl = locale === 'ar'
  const config = getDashboardConfig(orgSlug as any)
  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || ''

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'لوحة تحكم تاجر الجملة' : 'Wholesale Car Trader Dashboard'}
        description={displayName}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgSlug}/overview` },
          { label: isRtl ? 'نظرة عامة' : 'Overview' },
        ]}
        locale={locale}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'المركبات المتاحة' : 'Available Vehicles'}
          value="—"
          icon={<Car className="h-5 w-5" />}
          color="pink"
        />
        <DashboardStatCard
          label={isRtl ? 'الطلبات الجديدة' : 'Open Requests'}
          value={data?.stats?.find(s => s.label === 'Open Requests')?.value ?? '—'}
          icon={<ClipboardList className="h-5 w-5" />}
          color="pink"
        />
        <DashboardStatCard
          label={isRtl ? 'عروض الأسعار المعلقة' : 'Pending Quotes'}
          value={data?.stats?.find(s => s.label === 'Pending Quotes')?.value ?? '—'}
          icon={<FileSpreadsheet className="h-5 w-5" />}
          color="pink"
        />
        <DashboardStatCard
          label={isRtl ? 'المفاوضات النشطة' : 'Active Negotiations'}
          value="—"
          icon={<MessageSquare className="h-5 w-5" />}
          color="pink"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'المعاملات المكتملة' : 'Completed Transactions'}
          value={data?.stats?.find(s => s.label === 'Completed Transactions')?.value ?? '—'}
          icon={<CheckCircle className="h-5 w-5" />}
          color="pink"
        />
        <DashboardStatCard
          label={isRtl ? 'التسليمات المعلقة' : 'Pending Deliveries'}
          value="—"
          icon={<Truck className="h-5 w-5" />}
          color="pink"
        />
        <DashboardStatCard
          label={isRtl ? 'القيمة الشهرية' : 'Monthly Value'}
          value="—"
          icon={<DollarSign className="h-5 w-5" />}
          color="pink"
        />
        <DashboardStatCard
          label={isRtl ? 'المدفوعات المستحقة' : 'Outstanding Payments'}
          value="—"
          icon={<CreditCard className="h-5 w-5" />}
          color="pink"
        />
      </div>

      <DashboardEmptyState
        title={isRtl ? 'مرحباً بك في لوحة تحكم تاجر الجملة' : 'Welcome to Your Wholesale Trader Dashboard'}
        description={isRtl
          ? 'قم بإدارة المركبات وعروض الأسعار والمعاملات من هنا'
          : 'Manage vehicles, quotations, and transactions from here'}
      />
    </div>
  )
}
