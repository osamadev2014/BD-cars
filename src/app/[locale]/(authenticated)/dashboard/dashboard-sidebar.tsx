'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Car, DollarSign, Mail, Eye, Wallet, FileText,
  Landmark, Tags, ShieldCheck, Truck, Bell, Star, Store,
  FileEdit, Ticket, MessageSquare, Building2, Wrench, Package,
  SearchCheck, Gavel, BarChart3, Settings,
} from 'lucide-react'

const links: { href: string; key: string; icon: React.ReactNode }[] = [
  { href: '/dashboard/listings', key: 'my_listings', icon: <Car className="h-4 w-4" /> },
  { href: '/dashboard/sales', key: 'sales', icon: <DollarSign className="h-4 w-4" /> },
  { href: '/dashboard/requests', key: 'purchase_requests', icon: <Mail className="h-4 w-4" /> },
  { href: '/dashboard/viewings', key: 'viewings', icon: <Eye className="h-4 w-4" /> },
  { href: '/dashboard/wallet', key: 'wallet', icon: <Wallet className="h-4 w-4" /> },
  { href: '/dashboard/invoices', key: 'invoices', icon: <FileText className="h-4 w-4" /> },
  { href: '/dashboard/finance', key: 'finance', icon: <Landmark className="h-4 w-4" /> },
  { href: '/dashboard/coupons', key: 'my_coupons', icon: <Tags className="h-4 w-4" /> },
  { href: '/dashboard/insurance', key: 'insurance', icon: <ShieldCheck className="h-4 w-4" /> },
  { href: '/dashboard/delivery', key: 'delivery_orders', icon: <Truck className="h-4 w-4" /> },
  { href: '/dashboard/notifications', key: 'notifications', icon: <Bell className="h-4 w-4" /> },
  { href: '/dashboard/favorites', key: 'favorites', icon: <Star className="h-4 w-4" /> },
  { href: '/dashboard/dealer', key: 'dealer_dashboard', icon: <Store className="h-4 w-4" /> },
  { href: '/dashboard/vehicle-requests', key: 'vehicle_requests', icon: <FileEdit className="h-4 w-4" /> },
  { href: '/dashboard/tickets', key: 'support_tickets', icon: <Ticket className="h-4 w-4" /> },
  { href: '/dashboard/messages', key: 'messages', icon: <MessageSquare className="h-4 w-4" /> },
  { href: '/dashboard/wholesale', key: 'wholesale', icon: <Building2 className="h-4 w-4" /> },
  { href: '/dashboard/part-requests', key: 'part_requests', icon: <Wrench className="h-4 w-4" /> },
  { href: '/dashboard/part-orders', key: 'part_orders', icon: <Package className="h-4 w-4" /> },
  { href: '/dashboard/inspections', key: 'inspections', icon: <SearchCheck className="h-4 w-4" /> },
  { href: '/dashboard/auctions', key: 'my_auctions', icon: <Gavel className="h-4 w-4" /> },
  { href: '/dashboard/saved-searches', key: 'saved_searches', icon: <SearchCheck className="h-4 w-4" /> },
  { href: '/dashboard/comparisons', key: 'saved_comparisons', icon: <BarChart3 className="h-4 w-4" /> },
  { href: '/dashboard/settings', key: 'settings', icon: <Settings className="h-4 w-4" /> },
]

export function DashboardSidebar() {
  const t = useTranslations('common')
  const pathname = usePathname()
  const locale = pathname.split('/')[1]
  const { unread } = useRealtimeNotifications()

  return (
    <nav className="space-y-0.5 sticky top-20">
      <Link
        href={`/${locale}/dashboard`}
        className={cn(
          'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
          pathname === `/${locale}/dashboard`
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        )}
      >
        <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
        {t('dashboard')}
      </Link>
      {links.map((link) => {
        const href = `/${locale}${link.href}`
        const isActive = pathname === href || pathname.startsWith(`${href}/`)
        const isNotif = link.href === '/dashboard/notifications'
        return (
          <Link
            key={link.href}
            href={href}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <span className="flex-shrink-0">{link.icon}</span>
            <span className="flex-1 truncate">{t(link.key)}</span>
            {isNotif && unread > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
