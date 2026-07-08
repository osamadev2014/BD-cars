import type { ReactNode } from 'react'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
