interface DashboardLayoutProps {
  children: React.ReactNode
  locale: string
  orgSlug: string
  orgName?: string
  orgNameAr?: string
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <>{children}</>
}
