'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { getMyOrganizations } from '@/lib/actions/org-actions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Store, Wrench, Car, Truck, ShieldCheck, Landmark, Megaphone, Package, Ship, Warehouse, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

const ORG_ICONS: Record<string, typeof Building2> = {
  car_dealer: Car,
  inspection_center: Wrench,
  wholesale_vehicle_trader: Warehouse,
  spare_parts_supplier: Package,
  finance_company: Landmark,
  insurance_company: ShieldCheck,
  advertising_marketing_company: Megaphone,
  car_rental_company: Truck,
  product_shipping_company: Ship,
  vehicle_transport_company: Truck,
}

function getOrgLabel(type: string, isRtl: boolean): string {
  const labels: Record<string, [string, string]> = {
    car_dealer: ['Car Dealership', 'معرض سيارات'],
    inspection_center: ['Inspection Center', 'مركز فحص'],
    wholesale_vehicle_trader: ['Wholesale Trader', 'تاجر جملة'],
    spare_parts_supplier: ['Parts Supplier', 'مورد قطع غيار'],
    finance_company: ['Finance Company', 'شركة تمويل'],
    insurance_company: ['Insurance Company', 'شركة تأمين'],
    advertising_marketing_company: ['Advertising & Marketing', 'إعلانات وتسويق'],
    car_rental_company: ['Car Rental', 'تأجير سيارات'],
    product_shipping_company: ['Shipping Company', 'شركة شحن'],
    vehicle_transport_company: ['Vehicle Transport', 'نقل سيارات'],
  }
  const pair = labels[type]
  return pair ? (isRtl ? pair[1] : pair[0]) : type
}

export default function BusinessSelectPage() {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [orgs, setOrgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selecting, setSelecting] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace(`/${locale}/login`)
      return
    }

    getMyOrganizations()
      .then((data) => {
        setOrgs(data)
        if (data.length === 0) {
          router.replace(`/${locale}/dashboard`)
        } else if (data.length === 1) {
          localStorage.setItem('selected_org_id', data[0].id)
          localStorage.setItem('selected_org_type', data[0].org_type)
          router.replace(`/${locale}/dashboard`)
        }
      })
      .catch(() => router.replace(`/${locale}/dashboard`))
      .finally(() => setLoading(false))
  }, [user, authLoading])

  const handleSelect = (org: any) => {
    setSelecting(org.id)
    localStorage.setItem('selected_org_id', org.id)
    localStorage.setItem('selected_org_type', org.org_type)
    router.push(`/${locale}/dashboard`)
  }

  const goToRegister = () => {
    router.push(`/${locale}/business/register`)
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (orgs.length <= 1) return null

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">{isRtl ? 'اختر المنشأة' : 'Select Organization'}</h1>
          <p className="text-muted-foreground mt-1">
            {isRtl ? 'لديك عدة منشآت. اختر إحداها للمتابعة.' : 'You have multiple organizations. Select one to proceed.'}
          </p>
        </div>

        <div className="space-y-3">
          {orgs.map((org: any) => {
            const Icon = ORG_ICONS[org.org_type] || Building2
            return (
              <Card key={org.id} variant="outline" hover className="cursor-pointer" onClick={() => handleSelect(org)}>
                <CardContent className="flex items-center gap-4 p-4" dir={isRtl ? 'rtl' : 'ltr'}>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{org.name_ar || org.name}</p>
                    <p className="text-sm text-muted-foreground">{getOrgLabel(org.org_type, isRtl)}</p>
                  </div>
                  <div className={`shrink-0 ${isRtl ? 'rotate-180' : ''}`}>
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={goToRegister}>
            {isRtl ? 'تسجيل منشأة جديدة' : 'Register New Organization'}
          </Button>
        </div>
      </div>
    </div>
  )
}
