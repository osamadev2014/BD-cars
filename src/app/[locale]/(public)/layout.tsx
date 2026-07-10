import type { ReactNode } from 'react'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { CompareBar } from '@/components/compare/compare-bar'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <MobileBottomNav />
      <CompareBar />
    </div>
  )
}
