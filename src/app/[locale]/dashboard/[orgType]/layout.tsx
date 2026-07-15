import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getDashboardConfig } from '@/config/dashboard/registry'
import { DashboardLayoutShell } from './dashboard-layout-shell'
import { notFound, redirect } from 'next/navigation'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string; orgType: string }>
}

export default async function OrgDashboardLayout({ children, params }: Props) {
  const { locale, orgType } = await params

  const config = getDashboardConfig(orgType as any)
  if (!config) {
    notFound()
  }

  const validation = await validateDashboardAccess(locale, orgType)

  if (!validation.allowed) {
    if (validation.redirect) {
      redirect(validation.redirect)
    }
    notFound()
  }

  return (
    <DashboardLayoutShell
      locale={locale}
      orgSlug={orgType}
      orgColor={config.color}
      orgName={validation.orgName}
      orgNameAr={validation.orgNameAr}
      orgTypeLabel={locale === 'ar' ? config.labelAr : config.labelEn}
      userRole={validation.userRole}
      sections={config.sidebarSections}
    >
      {children}
    </DashboardLayoutShell>
  )
}
