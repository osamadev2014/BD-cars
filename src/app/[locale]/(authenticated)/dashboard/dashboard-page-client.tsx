'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { getMyOrganizations } from '@/lib/actions/org-actions'
import { useAuth } from '@/hooks/use-auth'
import { getOrgDashboard } from '@/components/dashboard/org-dashboards'
import {
  Car, Building2, Wrench, Warehouse, Package, Landmark,
  ShieldCheck, Megaphone, Truck, Ship, LayoutDashboard,
} from 'lucide-react'

const ORG_QUICK_LINKS: Record<string, Array<{ href: string; label_ar: string; label_en: string; icon: any }>> = {
  car_dealer: [
    { href: '/dashboard/listings', label_ar: 'إعلاناتي', label_en: 'My Listings', icon: Car },
    { href: '/dashboard/sales', label_ar: 'المبيعات', label_en: 'Sales', icon: LayoutDashboard },
    { href: '/dashboard/requests', label_ar: 'طلبات الشراء', label_en: 'Requests', icon: LayoutDashboard },
    { href: '/dashboard/team', label_ar: 'فريق العمل', label_en: 'Team', icon: LayoutDashboard },
  ],
  inspection_center: [
    { href: '/dashboard/inspections', label_ar: 'الفحوصات', label_en: 'Inspections', icon: Wrench },
    { href: '/dashboard/appointments', label_ar: 'المواعيد', label_en: 'Appointments', icon: LayoutDashboard },
    { href: '/dashboard/team', label_ar: 'الفريق', label_en: 'Team', icon: LayoutDashboard },
  ],
  wholesale_vehicle_trader: [
    { href: '/dashboard/wholesale', label_ar: 'الجملة', label_en: 'Wholesale', icon: Warehouse },
    { href: '/dashboard/requests', label_ar: 'الطلبات', label_en: 'Requests', icon: LayoutDashboard },
  ],
  spare_parts_supplier: [
    { href: '/dashboard/parts', label_ar: 'قطع الغيار', label_en: 'Parts', icon: Package },
    { href: '/dashboard/part-orders', label_ar: 'الطلبيات', label_en: 'Orders', icon: LayoutDashboard },
  ],
  finance_company: [
    { href: '/dashboard/finance', label_ar: 'التمويل', label_en: 'Finance', icon: Landmark },
    { href: '/dashboard/requests', label_ar: 'الطلبات', label_en: 'Requests', icon: LayoutDashboard },
  ],
  insurance_company: [
    { href: '/dashboard/insurance', label_ar: 'التأمين', label_en: 'Insurance', icon: ShieldCheck },
    { href: '/dashboard/requests', label_ar: 'الطلبات', label_en: 'Requests', icon: LayoutDashboard },
  ],
  advertising_marketing_company: [
    { href: '/dashboard/ads', label_ar: 'الإعلانات', label_en: 'Ads', icon: Megaphone },
    { href: '/dashboard/campaigns', label_ar: 'الحملات', label_en: 'Campaigns', icon: LayoutDashboard },
  ],
  car_rental_company: [
    { href: '/dashboard/bookings', label_ar: 'الحجوزات', label_en: 'Bookings', icon: Truck },
    { href: '/dashboard/fleet', label_ar: 'الأسطول', label_en: 'Fleet', icon: LayoutDashboard },
  ],
  product_shipping_company: [
    { href: '/dashboard/delivery', label_ar: 'الشحن', label_en: 'Delivery', icon: Ship },
    { href: '/dashboard/orders', label_ar: 'الطلبات', label_en: 'Orders', icon: LayoutDashboard },
  ],
  vehicle_transport_company: [
    { href: '/dashboard/delivery', label_ar: 'النقل', label_en: 'Transport', icon: Truck },
    { href: '/dashboard/fleet', label_ar: 'الأسطول', label_en: 'Fleet', icon: LayoutDashboard },
  ],
}

const GENERAL_LINKS = [
  { href: '/dashboard/listings', label_ar: 'إعلاناتي', label_en: 'My Listings', icon: '📋' },
  { href: '/dashboard/ads', label_ar: 'الإعلانات', label_en: 'Ads', icon: '📢' },
  { href: '/dashboard/sales', label_ar: 'المبيعات', label_en: 'Sales', icon: '💰' },
  { href: '/dashboard/wallet', label_ar: 'المحفظة', label_en: 'Wallet', icon: '💳' },
  { href: '/dashboard/invoices', label_ar: 'الفواتير', label_en: 'Invoices', icon: '📄' },
  { href: '/dashboard/finance', label_ar: 'التمويل', label_en: 'Finance', icon: '🏦' },
  { href: '/dashboard/insurance', label_ar: 'التأمين', label_en: 'Insurance', icon: '🛡️' },
  { href: '/dashboard/notifications', label_ar: 'الإشعارات', label_en: 'Notifications', icon: '🔔' },
  { href: '/dashboard/favorites', label_ar: 'المفضلة', label_en: 'Favorites', icon: '⭐' },
  { href: '/dashboard/team', label_ar: 'فريق العمل', label_en: 'Team', icon: '👥' },
  { href: '/dashboard/settings', label_ar: 'الإعدادات', label_en: 'Settings', icon: '⚙️' },
]

export function DashboardPageClient() {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const { user, isLoading: authLoading } = useAuth()

  const [org, setOrg] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return

    const storedOrgId = localStorage.getItem('selected_org_id')
    if (!storedOrgId) {
      setLoading(false)
      return
    }

    getMyOrganizations().then((orgs) => {
      const found = orgs.find((o: any) => o.id === storedOrgId)
      setOrg(found || null)
      setLoading(false)
    })
  }, [authLoading])

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (org) {
    const DashboardComponent = getOrgDashboard(org.org_type)
    const quickLinks = ORG_QUICK_LINKS[org.org_type] || []

    return (
      <div className="space-y-8">
        {/* Dedicated org dashboard */}
        {DashboardComponent ? (
          <DashboardComponent
            orgName={org.name}
            orgNameAr={org.name_ar || org.name}
            locale={locale}
            orgId={org.id}
          />
        ) : (
          <div>
            <div className="flex items-center gap-4 p-6 rounded-2xl border bg-card">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{org.name_ar || org.name}</h1>
                <p className="text-sm text-muted-foreground capitalize">{org.org_type?.replace(/_/g, ' ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick links */}
        {quickLinks.length > 0 && (
          <>
            <h2 className="text-lg font-semibold">{isRtl ? 'الوصول السريع' : 'Quick Access'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link) => {
                const LinkIcon = link.icon
                return (
                  <Link key={link.href} href={link.href}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card flex items-center gap-4"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <LinkIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{isRtl ? link.label_ar : link.label_en}</h3>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* General section */}
        <h2 className="text-lg font-semibold">{isRtl ? 'عام' : 'General'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GENERAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card"
            >
              <span className="text-2xl">{link.icon}</span>
              <h3 className="font-semibold mt-2">{isRtl ? link.label_ar : link.label_en}</h3>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // No org: generic user dashboard
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isRtl ? 'لوحة التحكم' : 'Dashboard'}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GENERAL_LINKS.map((link) => (
          <Link key={link.href} href={link.href}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card"
          >
            <span className="text-2xl">{link.icon}</span>
            <h3 className="font-semibold mt-2">{isRtl ? link.label_ar : link.label_en}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
