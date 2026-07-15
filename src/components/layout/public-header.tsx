'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { NotificationBell } from '@/components/layout/notification-bell'
import { Menu, X, LogOut, LayoutDashboard, Globe, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { locales } from '@/i18n/config'

export function PublicHeader() {
  const t = useTranslations('nav')
  const c = useTranslations('common')
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setLangOpen(false)
  }

  const navLinks = [
    { href: '/listings', label: t('cars') },
    { href: '/auctions', label: t('auctions') },
    { href: '/parts', label: t('parts') },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div dir={isRtl ? 'rtl' : 'ltr'} className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Logo + Nav - Right in RTL, Left in LTR */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/logo.png" alt="BD" width={96} height={36} className="h-9 w-auto" style={{ width: 'auto', height: 'auto' }} priority />
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const fullHref = `/${link.href}`
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

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => setLangOpen(!langOpen)}>
              <Globe className="h-4 w-4" />
            </Button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className={cn(
                  'absolute top-full mt-1 z-50 w-36 rounded-xl border border-border bg-card shadow-lg py-1',
                  isRtl ? 'left-0' : 'right-0'
                )}>
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLocale(l)}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors',
                        l === locale ? 'font-semibold text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {l === 'ar' ? 'العربية' : 'English'}
                      {l === locale && <span className={cn("absolute", isRtl ? 'left-3' : 'right-3')}>✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Theme */}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={toggleDark}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Auth */}
          {isLoading ? null : user ? (
            <div className="flex items-center gap-1">
              <NotificationBell />
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="h-9" iconLeft={<LayoutDashboard className="h-4 w-4" />}>
                  {t('dashboard')}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="h-9">{t('login')}</Button>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 rounded-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const fullHref = `/${link.href}`
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
            <div className="pt-2 border-t border-border/60 mt-2 flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => { switchLocale(locale === 'ar' ? 'en' : 'ar'); setMobileOpen(false) }}>
                <Globe className="h-4 w-4 ml-1.5" />
                {locale === 'ar' ? 'English' : 'العربية'}
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => { toggleDark(); setMobileOpen(false) }}>
                {dark ? <Sun className="h-4 w-4 ml-1.5" /> : <Moon className="h-4 w-4 ml-1.5" />}
                {dark ? (locale === 'ar' ? 'وضع فاتح' : 'Light') : (locale === 'ar' ? 'وضع مظلم' : 'Dark')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}