'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const links = [
  { href: '/admin', key: 'dashboard', icon: '📊' },
  { href: '/admin/approvals', key: 'approvals', icon: '✅' },
  { href: '/admin/organizations', key: 'organizations', icon: '🏢' },
  { href: '/admin/dealers', key: 'dealers', icon: '🏪' },
  { href: '/admin/plans', key: 'plans', icon: '📋' },
  { href: '/admin/crm', key: 'crm', icon: '👥' },
  { href: '/admin/audit-log', key: 'audit_log', icon: '📋' },
  { href: '/admin/content', key: 'content', icon: '📝' },
  { href: '/admin/finance', key: 'finance', icon: '🏦' },
  { href: '/admin/insurance', key: 'insurance', icon: '🛡️' },
  { href: '/admin/auctions', key: 'auctions', icon: '🔨' },
  { href: '/admin/inspections', key: 'inspections', icon: '🔧' },
  { href: '/admin/coupons', key: 'coupons', icon: '🏷️' },
  { href: '/admin/commission', key: 'commission_rules', icon: '📊' },
  { href: '/admin/reports', key: 'reports', icon: '📈' },
  { href: '/admin/payments', key: 'payment_providers', icon: '💳' },
  { href: '/admin/spare-parts', key: 'spare_parts', icon: '🔧' },
  { href: '/admin/wholesale', key: 'wholesale', icon: '🏬' },
  { href: '/admin/ads', key: 'advertise', icon: '📢' },
  { href: '/admin/vehicle-requests', key: 'vehicle_requests', icon: '📋' },
  { href: '/admin/tickets', key: 'tickets', icon: '🎫' },
  { href: '/admin/settings', key: 'settings', icon: '⚙️' },
]

export function AdminSidebar() {
  const t = useTranslations('admin')
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  return (
    <nav className="space-y-1 sticky top-20">
      <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {t('title')}
      </p>
      {links.map((link) => {
        const href = `/${locale}${link.href}`
        const isActive = pathname === href || (link.href !== '/admin' && pathname.startsWith(`${href}`))
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
