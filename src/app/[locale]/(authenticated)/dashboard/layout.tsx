import { DashboardSidebar } from './dashboard-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 hidden lg:block">
          <DashboardSidebar />
        </aside>
        <main className="lg:col-span-3 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
