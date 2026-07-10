'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { NotificationBell } from '@/components/layout/notification-bell'
import { Menu, X, Plus, LogOut, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = (t: (key: string) => string) => [
  { href: '/listings', label: t('cars') },
  { href: '/auctions', label: t('auctions') },
  { href: '/dealers', label: t('dealers') },
  { href: '/plans', label: t('plans') },
  { href: '/parts', label: t('parts') },
]

export function PublicHeader() {
  const t = useTranslations('nav')
  const c = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push(`/${locale}`)
  }

  const links = navLinks(t)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
            <Image src="/logo.png" alt="BD" width={80} height={32} className="h-8 w-auto" priority />
          </Link>
          <nav className="hidden lg:flex items-center gap-0.5">
            {links.map((link) => {
              const fullHref = `/${locale}${link.href}`
              const isActive = pathname === fullHref || pathname.startsWith(fullHref + '/')
              return (
                <Link
                  key={link.href}
                  href={fullHref}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <Link href={`/${locale}/listings/new`}>
            <Button variant="primary" size="sm" className="hidden md:inline-flex" iconLeft={<Plus className="h-4 w-4" />}>
              {c('sell_car')}
            </Button>
          </Link>

          {isLoading ? null : user ? (
            <div className="flex items-center gap-0.5">
              <NotificationBell />
              <Link href={`/${locale}/dashboard`}>
                <Button variant="ghost" size="sm" iconLeft={<LayoutDashboard className="h-4 w-4" />}>
                  {t('dashboard')}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} iconLeft={<LogOut className="h-4 w-4" />}>
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link href={`/${locale}/login`}>
                <Button variant="ghost" size="sm">{t('login')}</Button>
              </Link>
              <Link href={`/${locale}/register`}>
                <Button variant="primary" size="sm">{t('register')}</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {links.map((link) => {
              const fullHref = `/${locale}${link.href}`
              const isActive = pathname === fullHref
              return (
                <Link
                  key={link.href}
                  href={fullHref}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-xl transition-colors',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-border/60 mt-2">
              <Link href={`/${locale}/listings/new`} onClick={() => setMobileOpen(false)}>
                <Button variant="primary" fullWidth iconLeft={<Plus className="h-4 w-4" />}>
                  {c('sell_car')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
