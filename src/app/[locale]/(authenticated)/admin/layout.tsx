import { AdminSidebar } from './admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <aside className="lg:col-span-1 hidden lg:block">
          <AdminSidebar />
        </aside>
        <main className="lg:col-span-4 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
