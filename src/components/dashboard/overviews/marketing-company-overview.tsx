import { getDashboardConfig } from '@/config/dashboard/registry'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { Users, Megaphone, UserPlus, UserCheck, DollarSign, TrendingUp, Percent, ClipboardList } from 'lucide-react'

interface Props {
  locale: string
  orgId: string
  orgName?: string
  orgNameAr?: string
  orgSlug: string
  data?: { stats: Array<{ label: string; value: string | number }> }
}

export async function MarketingCompanyOverview({ locale, orgId, orgName, orgNameAr, orgSlug, data }: Props) {
  const isRtl = locale === 'ar'
  const config = getDashboardConfig(orgSlug as any)
  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || ''

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'لوحة تحكم شركة التسويق' : 'Marketing Company Dashboard'}
        description={displayName}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgSlug}/overview` },
          { label: isRtl ? 'نظرة عامة' : 'Overview' },
        ]}
        locale={locale}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'العملاء النشطون' : 'Active Clients'}
          value="—"
          icon={<Users className="h-5 w-5" />}
          color="rose"
        />
        <DashboardStatCard
          label={isRtl ? 'الحملات النشطة' : 'Active Campaigns'}
          value={data?.stats?.find(s => s.label === 'Active Campaigns')?.value ?? '—'}
          icon={<Megaphone className="h-5 w-5" />}
          color="rose"
        />
        <DashboardStatCard
          label={isRtl ? 'العملاء المحتملون الجدد' : 'New Leads'}
          value="—"
          icon={<UserPlus className="h-5 w-5" />}
          color="rose"
        />
        <DashboardStatCard
          label={isRtl ? 'العملاء المحتملون المؤهلون' : 'Qualified Leads'}
          value="—"
          icon={<UserCheck className="h-5 w-5" />}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'إنفاق الحملات' : 'Total Spent'}
          value={data?.stats?.find(s => s.label === 'Total Spent')?.value ?? '—'}
          icon={<DollarSign className="h-5 w-5" />}
          color="rose"
        />
        <DashboardStatCard
          label={isRtl ? 'إيرادات الحملات' : 'Campaign Revenue'}
          value="—"
          icon={<TrendingUp className="h-5 w-5" />}
          color="rose"
        />
        <DashboardStatCard
          label={isRtl ? 'معدل التحويل' : 'Conversion Rate'}
          value="—"
          icon={<Percent className="h-5 w-5" />}
          color="rose"
        />
        <DashboardStatCard
          label={isRtl ? 'المهام المعلقة' : 'Pending Tasks'}
          value="—"
          icon={<ClipboardList className="h-5 w-5" />}
          color="rose"
        />
      </div>

      <DashboardEmptyState
        title={isRtl ? 'مرحباً بك في لوحة تحكم التسويق' : 'Welcome to Your Marketing Dashboard'}
        description={isRtl
          ? 'قم بإدارة الحملات التسويقية والعملاء المحتملين والتقارير من هنا'
          : 'Manage marketing campaigns, leads, and reports from here'}
      />
    </div>
  )
}
