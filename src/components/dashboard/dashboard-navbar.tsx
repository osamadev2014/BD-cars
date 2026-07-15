'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { PanelLeftClose, PanelLeftOpen, Menu, Plus, Bell, Sun, Moon, Globe, ChevronDown, User, Settings, Building2, ArrowLeftRight, LogOut, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardNavbarProps {
  locale: string
  orgSlug: string
  orgName?: string
  orgNameAr?: string
  orgType?: string
  userRole?: string
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
  onOpenMobileSidebar?: () => void
  onOpenBranchSelector?: () => void
  selectedBranchName?: string
}

interface ProfileDropdownItem {
  id: string
  label: string
  icon: typeof User
  href?: string
  onClick?: () => void
  divider?: boolean
}

export function DashboardNavbar({
  locale,
  orgSlug,
  orgName,
  orgNameAr,
  orgType,
  userRole,
  onToggleSidebar,
  sidebarCollapsed,
  onOpenMobileSidebar,
  onOpenBranchSelector,
  selectedBranchName,
}: DashboardNavbarProps) {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const pathname = usePathname()
  const isRtl = locale === 'ar'
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored ? stored === 'dark' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleTheme = useCallback(() => {
    setDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || orgSlug
  const branchLabel = selectedBranchName || (isRtl ? 'كل الفروع' : 'All Branches')

  const profileItems: ProfileDropdownItem[] = [
    { id: 'profile', label: t('my_profile'), icon: User, href: `/${locale}/dashboard/${orgSlug}/profile` },
    { id: 'settings', label: t('account_settings'), icon: Settings, href: `/${locale}/dashboard/${orgSlug}/settings` },
    { id: 'org_settings', label: t('org_settings'), icon: Building2, href: `/${locale}/dashboard/${orgSlug}/settings/organization` },
    { id: 'divider1', label: '', icon: User, divider: true },
    { id: 'switch', label: t('switch_org'), icon: ArrowLeftRight, href: `/${locale}/select-org` },
    { id: 'marketplace', label: t('return_marketplace'), icon: Building2, href: `/${locale}/marketplace` },
    { id: 'divider2', label: '', icon: User, divider: true },
    { id: 'signout', label: t('sign_out'), icon: LogOut, onClick: () => { window.location.href = `/${locale}/auth/signout` } },
  ]

  const userName = 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <header
      dir={isRtl ? 'rtl' : 'ltr'}
      className="sticky top-0 z-30 bg-white dark:bg-[#0f0f1a] border-b border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden lg:flex"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {displayName?.charAt(0).toUpperCase() || 'O'}
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[160px] block">
                {displayName}
              </span>
              {orgType && (
                <span className="text-xs text-gray-400 dark:text-gray-500">{orgType.replace(/_/g, ' ')}</span>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 ml-2 text-sm text-gray-400 dark:text-gray-500">
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">{displayName}</span>
          </div>

          <button
            onClick={onOpenBranchSelector}
            className="hidden md:flex items-center gap-1.5 px-3 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span className="truncate max-w-[100px]">{branchLabel}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:flex" aria-label="Quick create">
            <Plus className="h-5 w-5" />
          </button>

          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen((p) => !p)}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={() => {
              const alt = isRtl ? 'en' : 'ar'
              router.push(pathname, { locale: alt })
            }}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:flex"
            aria-label="Switch language"
          >
            <Globe className="h-5 w-5" />
          </button>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center">
                {userInitial}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{userName}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">{userRole || t('member')}</p>
              </div>
              <ChevronDown className="hidden lg:block h-4 w-4 text-gray-400 dark:text-gray-500" />
            </button>

            {profileOpen && (
              <div
                className={cn(
                  'absolute top-full mt-2 w-48 bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden',
                  isRtl ? 'left-0' : 'right-0'
                )}
              >
                <div className="py-1">
                  {profileItems.map((item) => {
                    if (item.divider) {
                      return <div key={item.id} className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                    }
                    const Icon = item.icon
                    const content = (
                      <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                        <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span>{item.label}</span>
                      </div>
                    )
                    if (item.href) {
                      return (
                        <a key={item.id} href={item.href} onClick={() => setProfileOpen(false)}>
                          {content}
                        </a>
                      )
                    }
                    return (
                      <div key={item.id} onClick={() => { item.onClick?.(); setProfileOpen(false) }}>
                        {content}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
