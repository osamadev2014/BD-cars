import { getDashboardConfig } from '@/config/dashboard/registry'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { cn } from '@/lib/utils'
import { ClipboardList, CheckCircle, Clock, Truck, PackageCheck, Users, UserCheck, DollarSign, ArrowUpRight, MapPin, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Props {
  locale: string
  orgId: string
  orgName?: string
  orgNameAr?: string
  orgSlug: string
  data?: { stats: Array<{ label: string; value: string | number }> }
}

export async function CarTransportCompanyOverview({ locale, orgId, orgName, orgNameAr, orgSlug, data }: Props) {
  const isRtl = locale === 'ar'
  const config = getDashboardConfig(orgSlug as any)
  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || ''

  const activeShipments = data?.stats?.find(s => s.label === 'Active Shipments')?.value ?? '—'
  const delivered = data?.stats?.find(s => s.label === 'Delivered')?.value ?? '—'

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={isRtl ? 'لوحة التحكم' : 'Dashboard'}
        description={displayName}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgSlug}/overview` },
          { label: isRtl ? 'نظرة عامة' : 'Overview' },
        ]}
        locale={locale}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardStatCard
          label={isRtl ? 'الشحنات النشطة' : 'Active Shipments'}
          value={activeShipments}
          icon={<Truck className="h-5 w-5" />}
          color="blue"
          trend={{ value: 12, positive: true }}
        />
        <DashboardStatCard
          label={isRtl ? 'تم التسليم اليوم' : 'Delivered Today'}
          value={delivered}
          icon={<PackageCheck className="h-5 w-5" />}
          color="green"
          trend={{ value: 8, positive: true }}
        />
        <DashboardStatCard
          label={isRtl ? 'الناقلون المتاحون' : 'Available Carriers'}
          value="12"
          icon={<Truck className="h-5 w-5" />}
          color="amber"
        />
        <DashboardStatCard
          label={isRtl ? 'السائقون النشطون' : 'Active Drivers'}
          value="8"
          icon={<UserCheck className="h-5 w-5" />}
          color="purple"
          trend={{ value: 25, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'بانتظار الاستلام' : 'Pending Pickup'}
          value="5"
          icon={<Clock className="h-5 w-5" />}
          color="orange"
        />
        <DashboardStatCard
          label={isRtl ? 'قيد النقل' : 'In Transit'}
          value={activeShipments}
          icon={<Truck className="h-5 w-5" />}
          color="blue"
        />
        <DashboardStatCard
          label={isRtl ? 'تم التسليم (هذا الشهر)' : 'Delivered (Month)'}
          value={delivered}
          icon={<PackageCheck className="h-5 w-5" />}
          color="green"
        />
        <DashboardStatCard
          label={isRtl ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
          value="— SAR"
          icon={<DollarSign className="h-5 w-5" />}
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {isRtl ? 'النشاط الأخير' : 'Recent Activity'}
              </h3>
              <Link
                href={`/${locale}/dashboard/${orgSlug}/active-shipments`}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {isRtl ? 'عرض الكل' : 'View All'}
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { action: isRtl ? 'تم استلام طلب نقل جديد' : 'New transport request received', time: isRtl ? 'منذ 5 دقائق' : '5 min ago', color: 'blue' },
                { action: isRtl ? 'تم تعيين سائق للشحنة #TR-1024' : 'Driver assigned to shipment #TR-1024', time: isRtl ? 'منذ 15 دقيقة' : '15 min ago', color: 'green' },
                { action: isRtl ? 'تم تسليم الشحنة #TR-1018' : 'Shipment #TR-1018 delivered', time: isRtl ? 'منذ ساعة' : '1 hour ago', color: 'green' },
                { action: isRtl ? 'تأخير في استلام الشحنة #TR-1021' : 'Pickup delay for shipment #TR-1021', time: isRtl ? 'منذ ساعتين' : '2 hours ago', color: 'red' },
                { action: isRtl ? 'تم تحديث مسار الشحنة #TR-1015' : 'Route updated for shipment #TR-1015', time: isRtl ? 'منذ 3 ساعات' : '3 hours ago', color: 'amber' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className={cn(
                    'w-2 h-2 rounded-full mt-2 shrink-0',
                    item.color === 'blue' ? 'bg-blue-500' : item.color === 'green' ? 'bg-green-500' : item.color === 'red' ? 'bg-red-500' : 'bg-amber-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.action}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              {isRtl ? 'إجراءات سريعة' : 'Quick Actions'}
            </h3>
            <div className="space-y-2">
              {[
                { label: isRtl ? 'طلب نقل جديد' : 'New Transport Request', href: `/${locale}/dashboard/${orgSlug}/transport-requests/new`, icon: ClipboardList, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
                { label: isRtl ? 'تعيين سائق' : 'Assign Driver', href: `/${locale}/dashboard/${orgSlug}/shipments/assign`, icon: UserCheck, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
                { label: isRtl ? 'تتبع شحنة' : 'Track Shipment', href: `/${locale}/dashboard/${orgSlug}/live-tracking`, icon: MapPin, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
                { label: isRtl ? 'عرض التقارير' : 'View Reports', href: `/${locale}/dashboard/${orgSlug}/reports`, icon: TrendingUp, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
              ].map((action, i) => {
                const Icon = action.icon
                return (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', action.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {action.label}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-gray-300 dark:text-gray-600 mr-auto" />
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              {isRtl ? 'الشحنات النشطة' : 'Active Shipments'}
            </h3>
            <div className="space-y-3">
              {[
                { id: 'TR-1024', from: isRtl ? 'الرياض' : 'Riyadh', to: isRtl ? 'جدة' : 'Jeddah', status: isRtl ? 'قيد النقل' : 'In Transit', eta: isRtl ? 'ساعتان' : '2 hrs' },
                { id: 'TR-1023', from: isRtl ? 'جدة' : 'Jeddah', to: isRtl ? 'الدمام' : 'Dammam', status: isRtl ? 'تم الاستلام' : 'Picked Up', eta: isRtl ? '٤ ساعات' : '4 hrs' },
                { id: 'TR-1022', from: isRtl ? 'الرياض' : 'Riyadh', to: isRtl ? 'مكة' : 'Makkah', status: isRtl ? 'بانتظار الاستلام' : 'Pending Pickup', eta: isRtl ? 'غداً' : 'Tomorrow' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{s.id}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{s.from} → {s.to}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{s.status}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{s.eta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}