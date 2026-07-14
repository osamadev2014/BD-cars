'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { Bell, Globe, LogOut, Settings, User, ArrowLeftFromLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'

interface OrgHeaderProps {
  onCreate?: () => void
}

export function OrganizationSelectorHeader({ onCreate }: OrgHeaderProps) {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const router = useRouter()
  const { user, signOut } = useAuth()

  const switchLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar'
    router.push(`/${newLocale}/business/select`)
  }

  const userInitial = user?.full_name?.charAt(0) || user?.phone?.charAt(0) || 'U'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
            <a href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Image src="/logo.png" alt="Riyon" width={20} height={20} className="invert" />
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline">ريون</span>
            </a>
            <div className="h-5 w-px bg-border mx-1" />
            <span className="text-sm font-medium text-muted-foreground">
              {isRtl ? 'اختيار المنشأة' : 'Select Workspace'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label={isRtl ? 'الإشعارات' : 'Notifications'}>
              <Bell className="h-5 w-5" />
            </Button>

            <button
              onClick={switchLocale}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={isRtl ? 'English' : 'العربية'}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{locale === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors"
                  aria-label={isRtl ? 'القائمة الشخصية' : 'User menu'}
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRtl ? 'start' : 'end'} className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.full_name || user?.phone}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user?.phone}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard`)}>
                  <User className="h-4 w-4 ms-2" />
                  {isRtl ? 'الحساب الشخصي' : 'My Account'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard/settings`)}>
                  <Settings className="h-4 w-4 ms-2" />
                  {isRtl ? 'الإعدادات' : 'Settings'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/${locale}`)}>
                  <ArrowLeftFromLine className="h-4 w-4 ms-2" />
                  {isRtl ? 'العودة للسوق' : 'Back to Marketplace'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 ms-2" />
                  {isRtl ? 'تسجيل الخروج' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
