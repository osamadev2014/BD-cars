import { getDashboardConfig } from '@/config/dashboard/registry'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Car, CheckCircle, Calendar, Key, Wrench, ArrowUp, ArrowDown, DollarSign } from 'lucide-react'

interface Props {
  locale: string
  orgId: string
  orgName?: string
  orgNameAr?: string
  orgSlug: string
  data?: { stats: Array<{ label: string; value: string | number }> }
}

export async function CarRentalCompanyOverview({ locale, orgId, orgName, orgNameAr, orgSlug, data }: Props) {
  const isRtl = locale === 'ar'
  const config = getDashboardConfig(orgSlug as any)
  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || ''

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'لوحة تحكم شركة تأجير السيارات' : 'Car Rental Dashboard'}
        description={displayName}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgSlug}/overview` },
          { label: isRtl ? 'نظرة عامة' : 'Overview' },
        ]}
        locale={locale}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'إجمالي المركبات' : 'Total Vehicles'}
          value="—"
          icon={<Car className="h-5 w-5" />}
          color="orange"
        />
        <DashboardStatCard
          label={isRtl ? 'متاحة' : 'Available'}
          value="—"
          icon={<CheckCircle className="h-5 w-5" />}
          color="orange"
        />
        <DashboardStatCard
          label={isRtl ? 'محجوزة' : 'Reserved'}
          value="—"
          icon={<Calendar className="h-5 w-5" />}
          color="orange"
        />
        <DashboardStatCard
          label={isRtl ? 'مؤجرة حالياً' : 'Currently Rented'}
          value="—"
          icon={<Key className="h-5 w-5" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'قيد الصيانة' : 'In Maintenance'}
          value="—"
          icon={<Wrench className="h-5 w-5" />}
          color="orange"
        />
        <DashboardStatCard
          label={isRtl ? 'استلام اليوم' : "Today's Pickups"}
          value="—"
          icon={<ArrowUp className="h-5 w-5" />}
          color="orange"
        />
        <DashboardStatCard
          label={isRtl ? 'تسليم اليوم' : "Today's Returns"}
          value="—"
          icon={<ArrowDown className="h-5 w-5" />}
          color="orange"
        />
        <DashboardStatCard
          label={isRtl ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
          value="—"
          icon={<DollarSign className="h-5 w-5" />}
          color="orange"
        />
      </div>

      <DashboardEmptyState
        title={isRtl ? 'مرحباً بك في لوحة تحكم شركة التأجير' : 'Welcome to Your Car Rental Dashboard'}
        description={isRtl
          ? 'قم بإدارة أسطول المركبات والحجوزات والعملاء من هنا'
          : 'Manage your vehicle fleet, reservations, and customers from here'}
      />
    </div>
  )
}
