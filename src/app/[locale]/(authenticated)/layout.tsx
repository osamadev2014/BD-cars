import type { ReactNode } from 'react'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <MobileBottomNav />
    </>
  )
}
