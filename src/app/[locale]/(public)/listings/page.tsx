import { getVehicles, getMakes } from '@/lib/actions/vehicle-actions'
import { getTranslations } from 'next-intl/server'
import { VehicleCard } from '@/components/vehicles/vehicle-card'
import { ListingsFilter } from './listings-filter'

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; make?: string; min_price?: string; max_price?: string }>
}) {
  const t = await getTranslations('common')
  const sp = await searchParams
  const { data: listings, count } = await getVehicles({
    search: sp.q,
    makeId: sp.make,
    minPrice: sp.min_price ? Number(sp.min_price) : undefined,
    maxPrice: sp.max_price ? Number(sp.max_price) : undefined,
    pageSize: 24,
  })
  const makes = await getMakes()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('listings')}</h1>
          <p className="text-sm text-muted-foreground">{count} {t('listings_found')}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <ListingsFilter makes={makes} />
        </aside>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {listings.map((listing: any) => (
              <VehicleCard key={listing.id} listing={listing} />
            ))}
          </div>
          {listings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">{t('no_listings')}</div>
          )}
        </div>
      </div>
    </div>
  )
}
