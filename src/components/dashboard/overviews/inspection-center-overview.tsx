import { getDashboardConfig } from '@/config/dashboard/registry'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Calendar, Clock, SearchCheck, FileCheck, AlertTriangle, Users, DollarSign, Timer } from 'lucide-react'

interface Props {
  locale: string
  orgId: string
  orgName?: string
  orgNameAr?: string
  orgSlug: string
  data?: { stats: Array<{ label: string; value: string | number }> }
}

export async function InspectionCenterOverview({ locale, orgId, orgName, orgNameAr, orgSlug, data }: Props) {
  const isRtl = locale === 'ar'
  const config = getDashboardConfig(orgSlug as any)
  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || ''

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'لوحة تحكم مركز الفحص' : 'Inspection Center Dashboard'}
        description={displayName}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgSlug}/overview` },
          { label: isRtl ? 'نظرة عامة' : 'Overview' },
        ]}
        locale={locale}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'مواعيد اليوم' : "Today's Appointments"}
          value={data?.stats?.find(s => s.label === "Today's Appointments")?.value ?? '—'}
          icon={<Calendar className="h-5 w-5" />}
          color="teal"
        />
        <DashboardStatCard
          label={isRtl ? 'المركبات المنتظرة' : 'Waiting Vehicles'}
          value="—"
          icon={<Clock className="h-5 w-5" />}
          color="teal"
        />
        <DashboardStatCard
          label={isRtl ? 'الفحوصات قيد التنفيذ' : 'Inspections In Progress'}
          value={data?.stats?.find(s => s.label === 'Inspections In Progress')?.value ?? '—'}
          icon={<SearchCheck className="h-5 w-5" />}
          color="teal"
        />
        <DashboardStatCard
          label={isRtl ? 'الفحوصات المكتملة' : 'Completed'}
          value={data?.stats?.find(s => s.label === 'Completed')?.value ?? '—'}
          icon={<FileCheck className="h-5 w-5" />}
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'الفحوصات الراسبة' : 'Failed Inspections'}
          value={data?.stats?.find(s => s.label === 'Failed Inspections')?.value ?? '—'}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="teal"
        />
        <DashboardStatCard
          label={isRtl ? 'الفنيون المتاحون' : 'Technicians'}
          value={data?.stats?.find(s => s.label === 'Technicians')?.value ?? '—'}
          icon={<Users className="h-5 w-5" />}
          color="teal"
        />
        <DashboardStatCard
          label={isRtl ? 'إيرادات اليوم' : 'Monthly Revenue'}
          value={data?.stats?.find(s => s.label === 'Monthly Revenue')?.value ?? '—'}
          icon={<DollarSign className="h-5 w-5" />}
          color="teal"
        />
        <DashboardStatCard
          label={isRtl ? 'متوسط المدة' : 'Avg Duration'}
          value="—"
          icon={<Timer className="h-5 w-5" />}
          color="teal"
        />
      </div>

      <DashboardEmptyState
        title={isRtl ? 'مرحباً بك في لوحة تحكم مركز الفحص' : 'Welcome to Your Inspection Center Dashboard'}
        description={isRtl
          ? 'قم بإدارة مواعيد الفحص وتعيين الفنيين ومتابعة التقارير من هنا'
          : 'Manage inspection appointments, assign technicians, and track reports from here'}
      />
    </div>
  )
}
