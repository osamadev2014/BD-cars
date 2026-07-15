import { getDashboardConfig } from '@/config/dashboard/registry'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { FileText, Clock, CheckCircle, XCircle, FileSpreadsheet, FileSignature, DollarSign, CreditCard } from 'lucide-react'

interface Props {
  locale: string
  orgId: string
  orgName?: string
  orgNameAr?: string
  orgSlug: string
  data?: { stats: Array<{ label: string; value: string | number }> }
}

export async function FinanceCompanyOverview({ locale, orgId, orgName, orgNameAr, orgSlug, data }: Props) {
  const isRtl = locale === 'ar'
  const config = getDashboardConfig(orgSlug as any)
  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || ''

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'لوحة تحكم شركة التمويل' : 'Finance Company Dashboard'}
        description={displayName}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgSlug}/overview` },
          { label: isRtl ? 'نظرة عامة' : 'Overview' },
        ]}
        locale={locale}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'الطلبات الجديدة' : 'New Applications'}
          value={data?.stats?.find(s => s.label === 'New Applications')?.value ?? '—'}
          icon={<FileText className="h-5 w-5" />}
          color="green"
        />
        <DashboardStatCard
          label={isRtl ? 'قيد المراجعة' : 'Under Review'}
          value={data?.stats?.find(s => s.label === 'Under Review')?.value ?? '—'}
          icon={<Clock className="h-5 w-5" />}
          color="green"
        />
        <DashboardStatCard
          label={isRtl ? 'تمت الموافقة' : 'Approved'}
          value={data?.stats?.find(s => s.label === 'Approved')?.value ?? '—'}
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
        <DashboardStatCard
          label={isRtl ? 'مرفوض' : 'Rejected'}
          value={data?.stats?.find(s => s.label === 'Rejected')?.value ?? '—'}
          icon={<XCircle className="h-5 w-5" />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label={isRtl ? 'العروض المعلقة' : 'Pending Offers'}
          value="—"
          icon={<FileSpreadsheet className="h-5 w-5" />}
          color="green"
        />
        <DashboardStatCard
          label={isRtl ? 'الاتفاقيات النشطة' : 'Active Agreements'}
          value={data?.stats?.find(s => s.label === 'Active Agreements')?.value ?? '—'}
          icon={<FileSignature className="h-5 w-5" />}
          color="green"
        />
        <DashboardStatCard
          label={isRtl ? 'إجمالي التمويل' : 'Total Financing'}
          value="—"
          icon={<DollarSign className="h-5 w-5" />}
          color="green"
        />
        <DashboardStatCard
          label={isRtl ? 'الأقساط الشهرية' : 'Monthly Repayments'}
          value="—"
          icon={<CreditCard className="h-5 w-5" />}
          color="green"
        />
      </div>

      <DashboardEmptyState
        title={isRtl ? 'مرحباً بك في لوحة تحكم شركة التمويل' : 'Welcome to Your Finance Company Dashboard'}
        description={isRtl
          ? 'قم بإدارة طلبات التمويل والموافقات والعملاء من هنا'
          : 'Manage financing applications, approvals, and customers from here'}
      />
    </div>
  )
}
