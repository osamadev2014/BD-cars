'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const links = [
  { href: '/dashboard/listings', key: 'my_listings', icon: '📋' },
  { href: '/dashboard/favorites', key: 'favorites', icon: '⭐' },
  { href: '/dashboard/messages', key: 'messages', icon: '💬' },
  { href: '/dashboard/inspections', key: 'inspections', icon: '🔧' },
  { href: '/dashboard/auctions', key: 'my_auctions', icon: '🔨' },
  { href: '/dashboard/settings', key: 'settings', icon: '⚙️' },
]

export function DashboardSidebar() {
  const t = useTranslations('common')
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  return (
    <nav className="space-y-1 sticky top-20">
      <Link
        href={`/${locale}/dashboard`}
        className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          pathname === `/${locale}/dashboard`
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent'
        }`}
      >
        {t('dashboard')}
      </Link>
      {links.map((link) => {
        const href = `/${locale}${link.href}`
        const isActive = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={link.href}
            href={href}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
            }`}
          >
            <span>{link.icon}</span>
            {t(link.key)}
          </Link>
        )
      })}
    </nav>
  )
}
