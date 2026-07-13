import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Car, Building2, Wrench, Warehouse, Package, Landmark, ShieldCheck, Megaphone, Truck, Ship, ArrowLeft } from 'lucide-react'

const ORG_HOME_LINKS: Record<string, Array<{ href: string; icon: any; labelKey: string }>> = {
  car_dealer: [
    { href: '/dashboard/listings', icon: Car, labelKey: 'my_listings' },
    { href: '/dashboard/inventory', icon: Package, labelKey: 'inventory' },
    { href: '/dashboard/sales', icon: ArrowLeft, labelKey: 'sales' },
    { href: '/dashboard/requests', icon: ArrowLeft, labelKey: 'purchase_requests' },
  ],
  inspection_center: [
    { href: '/dashboard/inspections', icon: Wrench, labelKey: 'inspections' },
    { href: '/dashboard/appointments', icon: ArrowLeft, labelKey: 'appointments' },
  ],
  wholesale_vehicle_trader: [
    { href: '/dashboard/wholesale', icon: Warehouse, labelKey: 'wholesale' },
    { href: '/dashboard/requests', icon: ArrowLeft, labelKey: 'requests' },
  ],
  spare_parts_supplier: [
    { href: '/dashboard/parts', icon: Package, labelKey: 'parts' },
    { href: '/dashboard/part-orders', icon: ArrowLeft, labelKey: 'part_orders' },
    { href: '/dashboard/part-requests', icon: ArrowLeft, labelKey: 'part_requests' },
  ],
  finance_company: [
    { href: '/dashboard/finance', icon: Landmark, labelKey: 'finance' },
    { href: '/dashboard/requests', icon: ArrowLeft, labelKey: 'requests' },
  ],
  insurance_company: [
    { href: '/dashboard/insurance', icon: ShieldCheck, labelKey: 'insurance' },
    { href: '/dashboard/requests', icon: ArrowLeft, labelKey: 'requests' },
  ],
  advertising_marketing_company: [
    { href: '/dashboard/ads', icon: Megaphone, labelKey: 'ads' },
    { href: '/dashboard/campaigns', icon: ArrowLeft, labelKey: 'campaigns' },
  ],
  car_rental_company: [
    { href: '/dashboard/vehicles', icon: Truck, labelKey: 'vehicles' },
    { href: '/dashboard/bookings', icon: ArrowLeft, labelKey: 'bookings' },
  ],
  product_shipping_company: [
    { href: '/dashboard/delivery', icon: Ship, labelKey: 'delivery_orders' },
    { href: '/dashboard/orders', icon: ArrowLeft, labelKey: 'orders' },
  ],
  vehicle_transport_company: [
    { href: '/dashboard/delivery', icon: Truck, labelKey: 'delivery_orders' },
    { href: '/dashboard/fleet', icon: ArrowLeft, labelKey: 'fleet' },
  ],
}

export async function OrgOverview({ orgType, locale }: { orgType: string; locale: string }) {
  const t = await getTranslations('common')
  const isRtl = locale === 'ar'
  const links = ORG_HOME_LINKS[orgType] || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{t(link.labelKey)}</h3>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
