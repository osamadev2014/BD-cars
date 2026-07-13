'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getMyOrganizations } from '@/lib/actions/org-actions'
import { useAuth } from '@/hooks/use-auth'
import { Building2, ChevronDown, LogOut, Settings, Users, Globe, Check, Plus } from 'lucide-react'

const ORG_TYPE_LABELS: Record<string, [string, string]> = {
  car_dealer: ['Car Dealer', 'معرض سيارات'],
  inspection_center: ['Inspection Center', 'مركز فحص'],
  wholesale_vehicle_trader: ['Wholesale Trader', 'تاجر جملة'],
  spare_parts_supplier: ['Parts Supplier', 'مورد قطع غيار'],
  finance_company: ['Finance Company', 'شركة تمويل'],
  insurance_company: ['Insurance Company', 'شركة تأمين'],
  advertising_marketing_company: ['Agency', 'شركة إعلانات'],
  car_rental_company: ['Car Rental', 'تأجير سيارات'],
  product_shipping_company: ['Shipping Co.', 'شركة شحن'],
  vehicle_transport_company: ['Vehicle Transport', 'نقل سيارات'],
}

export function OrgTopNav() {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const [orgs, setOrgs] = useState<any[]>([])
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null)
  const [showOrgMenu, setShowOrgMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  useEffect(() => {
    getMyOrganizations().then((data) => {
      setOrgs(data)
      const orgId = localStorage.getItem('selected_org_id')
      if (orgId) {
        const found = data.find((o: any) => o.id === orgId)
        setSelectedOrg(found || null)
      }
    })
  }, [])

  const typeLabel = ORG_TYPE_LABELS[selectedOrg.org_type]
  const otherLocales = (['ar', 'en'] as const).filter((l) => l !== locale)

  const switchOrg = (org: any) => {
    localStorage.setItem('selected_org_id', org.id)
    localStorage.setItem('selected_org_type', org.org_type)
    setSelectedOrg(org)
    setShowOrgMenu(false)
    router.push(`/${locale}/dashboard`)
    router.refresh()
  }

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  const handleSignOut = async () => {
    localStorage.removeItem('selected_org_id')
    localStorage.removeItem('selected_org_type')
    await signOut()
    router.push(`/${locale}`)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        {/* Left: Org selector */}
        <div className="relative">
          <button
            onClick={() => setShowOrgMenu(!showOrgMenu)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div className="text-right hidden sm:block">
              {selectedOrg ? (
                <>
                  <p className="text-sm font-medium leading-tight">{selectedOrg.name_ar || selectedOrg.name}</p>
                  <p className="text-[10px] text-muted-foreground">{isRtl ? typeLabel?.[1] : typeLabel?.[0]}</p>
                </>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">
                  {isRtl ? 'اختر منشأة' : 'Select Organization'}
                </p>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {showOrgMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowOrgMenu(false)} />
              <div className="absolute top-full mt-1 w-72 rounded-xl border bg-background shadow-lg z-20 p-2 space-y-0.5" dir={isRtl ? 'rtl' : 'ltr'}>
                <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                  {isRtl ? 'المنشآت' : 'Organizations'}
                </p>
                {orgs.length === 0 && (
                  <p className="px-3 py-2 text-xs text-muted-foreground">
                    {isRtl ? 'لا توجد منشآت بعد' : 'No organizations yet'}
                  </p>
                )}
                {orgs.map((org: any) => {
                  const tLabel = ORG_TYPE_LABELS[org.org_type]
                  const isActive = org.id === selectedOrg?.id
                  return (
                    <button
                      key={org.id}
                      onClick={() => switchOrg(org)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                      }`}
                    >
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <Building2 className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 text-right">
                        <p className="font-medium">{org.name_ar || org.name}</p>
                        <p className="text-xs text-muted-foreground">{isRtl ? tLabel?.[1] : tLabel?.[0]}</p>
                      </div>
                      {isActive && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  )
                })}
                <hr className="my-1 border-border" />
                <Link
                  href={`/${locale}/business/register`}
                  onClick={() => setShowOrgMenu(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
                    <Plus className="h-3.5 w-3.5" />
                  </div>
                  <span>{isRtl ? 'إنشاء منشأة جديدة' : 'Create Organization'}</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Right: Profile + Language + Actions */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">{locale === 'ar' ? 'AR' : 'EN'}</span>
            </button>
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
                <div className="absolute top-full end-0 mt-1 rounded-lg border bg-background shadow-lg z-20 p-1 min-w-[100px]">
                  {otherLocales.map((l) => (
                    <button
                      key={l}
                      onClick={() => { switchLocale(l); setShowLangMenu(false) }}
                      className="w-full text-right px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
                    >
                      {l === 'ar' ? 'العربية' : 'English'}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {(user?.full_name || 'U')[0]?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.full_name}</span>
            </button>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute top-full end-0 mt-1 rounded-lg border bg-background shadow-lg z-20 p-1 min-w-[160px]">
                  <Link
                    href={`/${locale}/dashboard/settings`}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    {isRtl ? 'الإعدادات' : 'Settings'}
                  </Link>
                  <Link
                    href={`/${locale}/dashboard/team`}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    {isRtl ? 'فريق العمل' : 'Team'}
                  </Link>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {isRtl ? 'تسجيل خروج' : 'Sign Out'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
