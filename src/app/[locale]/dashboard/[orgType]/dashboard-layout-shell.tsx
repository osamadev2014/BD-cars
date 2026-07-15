'use client'

import { useState, useCallback } from 'react'
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { DashboardModal } from '@/components/dashboard/dashboard-modal'
import { BranchSelectorModal } from '@/components/dashboard/branch-selector-modal'
import { useLocale } from 'next-intl'

interface Props {
  children: React.ReactNode
  locale: string
  orgSlug: string
  orgColor?: string
  orgName?: string
  orgNameAr?: string
  orgTypeLabel?: string
  userRole?: string
  sections: any[]
}

export function DashboardLayoutShell({
  children,
  locale,
  orgSlug,
  orgColor,
  orgName,
  orgNameAr,
  orgTypeLabel,
  userRole,
  sections,
}: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [branchModalOpen, setBranchModalOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<{ id: string; name: string; nameAr?: string } | null>(null)
  const localeFromHook = useLocale()
  const activeLocale = locale || localeFromHook || 'ar'
  const isRtl = activeLocale === 'ar'

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  const handleOpenMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(true)
  }, [])

  const handleCloseMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false)
  }, [])

  const handleBranchSelect = useCallback((branch: any) => {
    setSelectedBranch(branch)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f1a] transition-colors duration-300">
      <DashboardNavbar
        locale={activeLocale}
        orgSlug={orgSlug}
        orgName={orgName}
        orgNameAr={orgNameAr}
        orgType={orgTypeLabel}
        userRole={userRole}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
        onOpenMobileSidebar={handleOpenMobileSidebar}
        onOpenBranchSelector={() => setBranchModalOpen(true)}
        selectedBranchName={selectedBranch ? (activeLocale === 'ar' && selectedBranch.nameAr ? selectedBranch.nameAr : selectedBranch.name) : undefined}
      />

      <DashboardSidebar
        locale={activeLocale}
        orgSlug={orgSlug}
        orgColor={orgColor}
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        sections={sections}
        orgName={orgName}
        orgNameAr={orgNameAr}
        orgTypeLabel={orgTypeLabel}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={handleCloseMobileSidebar}
      />

      <main
        className={`transition-all duration-300 pt-16 pb-20 lg:pb-0 ${
          isRtl
            ? (sidebarCollapsed ? 'lg:mr-16' : 'lg:mr-64')
            : (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64')
        } p-4 sm:p-6 lg:p-8`}
      >
        {children}
      </main>

      <DashboardModal open={branchModalOpen} onClose={() => setBranchModalOpen(false)} size="lg" locale={activeLocale}>
        <BranchSelectorModal
          open={branchModalOpen}
          onClose={() => setBranchModalOpen(false)}
          locale={activeLocale}
          orgId=""
          currentBranchId={selectedBranch?.id}
          onSelect={handleBranchSelect}
        />
      </DashboardModal>
    </div>
  )
}
