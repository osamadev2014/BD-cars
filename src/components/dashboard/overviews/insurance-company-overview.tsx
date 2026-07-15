import { getDashboardConfig } from '@/config/dashboard/registry'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { FileText, Clock, Shield, AlertTriangle, FileWarning, CheckCircle, DollarSign, TrendingUp } from 'lucide-react'

interface Props {
  locale: string
  orgId: string
  orgName?: string
  orgNameAr?: string
  orgSlug: string
  data?: { stats: Array<{ label: string; value: string | number }> }
}

export async function InsuranceCompanyOverview({ locale, orgId, orgName, orgNameAr, orgSlug, data }: Props) {
  const isRtl = locale === 'ar'
  const config = getDashboardConfig(orgSlug as any)
  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || ''

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'لوحة تحكم شركة التأمين' : 'Insurance Company Dashboard'}
        description={displayName}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgSlug}/overview` },
          { label: isRtl ? 'نظرة عامة' : 'Overview' },
        ]}
        locale={locale}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'الطلبات الجديدة' : 'New Requests'}
          value={data?.stats?.find(s => s.label === 'New Requests')?.value ?? '—'}
          icon={<FileText className="h-5 w-5" />}
          color="indigo"
        />
        <DashboardStatCard
          label={isRtl ? 'عروض الأسعار المعلقة' : 'Pending Quotations'}
          value={data?.stats?.find(s => s.label === 'Pending Quotations')?.value ?? '—'}
          icon={<Clock className="h-5 w-5" />}
          color="indigo"
        />
        <DashboardStatCard
          label={isRtl ? 'الوثائق النشطة' : 'Active Policies'}
          value="—"
          icon={<Shield className="h-5 w-5" />}
          color="indigo"
        />
        <DashboardStatCard
          label={isRtl ? 'تنتهي قريباً' : 'Expiring Soon'}
          value="—"
          icon={<AlertTriangle className="h-5 w-5" />}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'المطالبات المفتوحة' : 'Open Claims'}
          value={data?.stats?.find(s => s.label === 'Open Claims')?.value ?? '—'}
          icon={<FileWarning className="h-5 w-5" />}
          color="indigo"
        />
        <DashboardStatCard
          label={isRtl ? 'المطالبات المعتمدة' : 'Approved Claims'}
          value="—"
          icon={<CheckCircle className="h-5 w-5" />}
          color="indigo"
        />
        <DashboardStatCard
          label={isRtl ? 'إيرادات الأقساط' : 'Premium Revenue'}
          value="—"
          icon={<DollarSign className="h-5 w-5" />}
          color="indigo"
        />
        <DashboardStatCard
          label={isRtl ? 'معدل الموافقة' : 'Approval Rate'}
          value="—"
          icon={<TrendingUp className="h-5 w-5" />}
          color="indigo"
        />
      </div>

      <DashboardEmptyState
        title={isRtl ? 'مرحباً بك في لوحة تحكم شركة التأمين' : 'Welcome to Your Insurance Company Dashboard'}
        description={isRtl
          ? 'قم بإدارة وثائق التأمين والمطالبات والعملاء من هنا'
          : 'Manage insurance policies, claims, and customers from here'}
      />
    </div>
  )
}
