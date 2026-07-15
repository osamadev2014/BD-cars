'use client'

import { usePathname } from '@/i18n/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Bell, BarChart3, Car, Users, ShoppingCart, ClipboardList,
  FileSpreadsheet, CalendarCheck, Receipt, Wallet, SearchCheck, Truck, Ship,
  Store, UsersRound, Shield, Settings, TrendingUp, Package, UserCheck, Building2,
  Calendar, Clock, Activity, FileText, PlusCircle, UserPlus, BarChart4, CreditCard,
  DollarSign, MapPin, Phone, Mail, Globe as GlobeIcon, HelpCircle, LogOut,
  ChevronLeft, ChevronRight, Menu, X, Sun, Moon, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'

interface SidebarItem {
  id: string
  labelEn: string
  labelAr: string
  href: string
  icon: string
  badge?: string
}

interface SidebarSection {
  id: string
  labelEn: string
  labelAr: string
  items: SidebarItem[]
}

interface DashboardSidebarProps {
  locale: string
  orgSlug: string
  orgColor?: string
  collapsed: boolean
  onToggle: () => void
  sections: SidebarSection[]
  orgName?: string
  orgNameAr?: string
  orgTypeLabel?: string
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const iconMap: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard, Bell, BarChart3, Car, Users, ShoppingCart, ClipboardList,
  FileSpreadsheet, CalendarCheck, Receipt, Wallet, SearchCheck, Truck, Ship,
  Store, UsersRound, Shield, Settings, TrendingUp, Package, UserCheck, Building2,
  Calendar, Clock, Activity, FileText, PlusCircle, UserPlus, BarChart4, CreditCard,
  DollarSign, MapPin, Phone, Mail, GlobeIcon, HelpCircle, LogOut,
  ChevronLeft, ChevronRight, Menu, X, Sun, Moon, PanelLeftClose, PanelLeftOpen,
}

function SidebarIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name]
  if (!Icon) return <LayoutDashboard className={className} />
  return <Icon className={className} />
}

export function DashboardSidebar({
  locale,
  orgSlug,
  orgColor,
  collapsed,
  onToggle,
  sections,
  orgName,
  orgNameAr,
  orgTypeLabel,
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const isRtl = locale === 'ar'
  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || orgSlug

  function isActive(href: string) {
    const fullHref = `/${locale}/dashboard${href}`
    return pathname === fullHref || pathname.startsWith(fullHref + '/')
  }

  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    amber: 'text-amber-600 dark:text-amber-400',
    purple: 'text-purple-600 dark:text-purple-400',
    red: 'text-red-600 dark:text-red-400',
    teal: 'text-teal-600 dark:text-teal-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    orange: 'text-orange-600 dark:text-orange-400',
    pink: 'text-pink-600 dark:text-pink-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
  }
  const activeColor = orgColor ? colorClasses[orgColor] || 'text-blue-600 dark:text-blue-400' : 'text-blue-600 dark:text-blue-400'

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 h-16 px-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
          {displayName?.charAt(0).toUpperCase() || 'R'}
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
            {orgTypeLabel && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{orgTypeLabel}</p>
            )}
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-none space-y-1">
        {sections.map((section) => (
          <div key={section.id} className="mb-1">
            {!collapsed && (
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-2">
                {isRtl ? section.labelAr : section.labelEn}
              </p>
            )}
            {section.items.map((item) => {
              const active = isActive(item.href)
              const label = isRtl ? item.labelAr : item.labelEn
              return (
                <Link
                  key={item.id}
                  href={`/${locale}/dashboard${item.href}`}
                  onClick={() => onMobileClose?.()}
                  className={cn(
                    'flex items-center gap-3 mx-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                    collapsed && 'justify-center mx-auto w-12 h-10 p-0'
                  )}
                  title={collapsed ? label : undefined}
                >
                  <SidebarIcon name={item.icon} className={cn("h-5 w-5 shrink-0", active && activeColor)} />
                  {!collapsed && (
                    <span className={cn("truncate", active && "font-bold")}>{label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-800 p-3 shrink-0">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isRtl ? (
            collapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
          ) : (
            collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </>
  )

  return (
    <>
      <aside
        dir={isRtl ? 'rtl' : 'ltr'}
        className={cn(
          'fixed top-0 h-screen z-20 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800',
          'transition-all duration-200 hidden lg:flex flex-col',
          collapsed ? 'w-16' : 'w-64',
          isRtl ? 'right-0 border-l border-r-0' : 'left-0'
        )}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside
            dir={isRtl ? 'rtl' : 'ltr'}
            className={cn(
              'absolute top-0 h-full w-72 bg-white dark:bg-gray-950 shadow-2xl flex flex-col',
              'transition-transform duration-300 ease-in-out',
              isRtl ? 'left-0' : 'right-0'
            )}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {displayName?.charAt(0).toUpperCase() || 'R'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
                  {orgTypeLabel && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{orgTypeLabel}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onMobileClose}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {sections.map((section) => (
                <div key={section.id} className="mb-1">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-2">
                    {isRtl ? section.labelAr : section.labelEn}
                  </p>
                  {section.items.map((item) => {
                    const fullHref = `/${locale}/dashboard${item.href}`
                    const active = pathname === fullHref || pathname.startsWith(fullHref + '/')
                    const label = isRtl ? item.labelAr : item.labelEn
                    return (
                      <Link
                        key={item.id}
                        href={fullHref}
                        onClick={onMobileClose}
                        className={cn(
                          'flex items-center gap-3 mx-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                          active
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                      >
                        <SidebarIcon name={item.icon} className={cn("h-5 w-5 shrink-0", active && activeColor)} />
                        <span className={cn("truncate", active && "font-bold")}>{label}</span>
                        {item.badge && (
                          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}
