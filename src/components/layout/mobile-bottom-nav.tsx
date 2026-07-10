'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Home, Search, Heart, Plus, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '', icon: Home, label: { en: 'Home', ar: 'الرئيسية' } },
  { href: '/listings', icon: Search, label: { en: 'Browse', ar: 'تصفح' } },
  { href: '/listings/new', icon: Plus, label: { en: 'Sell', ar: 'بيع' }, premium: true },
  { href: '/dashboard/favorites', icon: Heart, label: { en: 'Favorites', ar: 'المفضلة' } },
  { href: '/dashboard', icon: User, label: { en: 'Profile', ar: 'حسابي' } },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const locale = useLocale()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const fullHref = `/${locale}${item.href}`
          const isActive = pathname === fullHref || (item.href && pathname.startsWith(fullHref + '/'))
          const Icon = item.icon

          if (item.premium) {
            return (
              <Link
                key={item.href}
                href={fullHref}
                className="flex flex-col items-center justify-center gap-0.5"
              >
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-premium-from to-premium-to flex items-center justify-center shadow-md">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {locale === 'ar' ? item.label.ar : item.label.en}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={fullHref}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1',
                isActive ? 'text-accent' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{locale === 'ar' ? item.label.ar : item.label.en}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
