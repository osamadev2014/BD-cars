import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { BarChart3, TrendingUp, UserCheck, Truck, ArrowUpRight, FileText, Download, Calendar } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

interface Props { params: Promise<{ locale: string; orgType: string }> }

export default async function ReportsPage({ params }: Props) {
  const { locale, orgType } = await params
  const isRtl = locale === 'ar'
  const validation = await validateDashboardAccess(locale, orgType)
  if (!validation.allowed) {
    if (validation.redirect) redirect(validation.redirect)
    notFound()
  }

  const reports = [
    {
      id: 'shipments',
      title: isRtl ? 'تقارير الشحنات' : 'Shipment Reports',
      desc: isRtl ? 'تحليل حركة الشحنات وأوقات التسليم' : 'Analyze shipment movement and delivery times',
      icon: Truck,
      color: 'bg-blue-500',
      href: `/${locale}/dashboard/${orgType}/reports/shipments`,
    },
    {
      id: 'drivers',
      title: isRtl ? 'تقارير السائقين' : 'Driver Reports',
      desc: isRtl ? 'أداء السائقين وإنجازاتهم' : 'Driver performance and achievements',
      icon: UserCheck,
      color: 'bg-purple-500',
      href: `/${locale}/dashboard/${orgType}/reports/drivers`,
    },
    {
      id: 'financial',
      title: isRtl ? 'التقارير المالية' : 'Financial Reports',
      desc: isRtl ? 'تحليل الإيرادات والمصروفات' : 'Revenue and expense analysis',
      icon: TrendingUp,
      color: 'bg-green-500',
      href: `/${locale}/dashboard/${orgType}/reports/financial`,
    },
  ]

  const summaryStats = [
    { label: isRtl ? 'إجمالي الشحنات' : 'Total Shipments', value: '1,284', icon: Truck, color: 'blue' as const },
    { label: isRtl ? 'معدل التسليم' : 'Delivery Rate', value: '97.2%', icon: TrendingUp, color: 'green' as const },
    { label: isRtl ? 'السائقون النشطون' : 'Active Drivers', value: '24', icon: UserCheck, color: 'purple' as const },
    { label: isRtl ? 'متوسط وقت التسليم' : 'Avg Delivery Time', value: '3.5h', icon: Calendar, color: 'amber' as const },
  ]

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={isRtl ? 'التقارير' : 'Reports'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'التقارير' : 'Reports' },
        ]}
        locale={locale}
        action={
          <button className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity">
            <Download className="h-4 w-4" />
            {isRtl ? 'تصدير التقرير' : 'Export Report'}
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryStats.map((stat, i) => (
          <DashboardStatCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={<stat.icon className="h-5 w-5" />}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon
          return (
            <Link
              key={report.id}
              href={report.href}
              className="group relative rounded-xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${report.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{report.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{report.desc}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}