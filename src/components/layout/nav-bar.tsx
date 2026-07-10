'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { NotificationBell } from '@/components/layout/notification-bell'

export function NavBar() {
  const t = useTranslations('nav')
  const c = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push(`/${locale}`)
  }

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/listings`, label: t('cars') },
    { href: `/${locale}/auctions`, label: t('auctions') },
    { href: `/${locale}/dealers`, label: t('dealers') },
    { href: `/${locale}/plans`, label: t('plans') },
    { href: `/${locale}/finance`, label: t('finance') },
    { href: `/${locale}/insurance`, label: t('insurance') },
    { href: `/${locale}/request`, label: t('request') },
    { href: `/${locale}/parts`, label: t('parts') },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image src="/logo.png" alt="BD" width={80} height={32} className="h-8 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  pathname === link.href
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLoading ? null : user ? (
            <>
              <NotificationBell />
              <Link href={`/${locale}/dashboard`}>
                <Button variant="ghost" size="sm">{t('dashboard')}</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>{t('logout')}</Button>
            </>
          ) : (
            <>
              <Link href={`/${locale}/login`}>
                <Button variant="ghost" size="sm">{t('login')}</Button>
              </Link>
              <Link href={`/${locale}/register`}>
                <Button size="sm">{t('register')}</Button>
              </Link>
            </>
          )}
          <Link href={`/${locale}/listings/new`}>
            <Button className="hidden md:inline-flex">{c('sell_car')}</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
