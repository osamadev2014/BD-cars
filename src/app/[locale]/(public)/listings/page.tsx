import type { Metadata } from 'next'
import { getVehicles, getMakes } from '@/lib/actions/vehicle-actions'
import { getCities, getBodyTypes, getFuelTypes, getTransmissions, getConditionTypes } from '@/lib/actions/lookups-actions'
import { getTranslations } from 'next-intl/server'
import { VehicleCard } from '@/components/vehicle/vehicle-card'
import { ListingsFilter } from './listings-filter'
import { AdBanner } from '@/components/ads/ad-banner'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Used Cars for Sale in Saudi Arabia',
    description: 'Browse thousands of new and used cars for sale in Saudi Arabia. Filter by make, model, price, and location.',
    path: '/listings',
  })
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; make?: string; model?: string; min_price?: string; max_price?: string; min_year?: string; max_year?: string; city?: string; body_type?: string; fuel_type?: string; transmission?: string; condition?: string; sort?: string }>
}) {
  const t = await getTranslations('common')
  const sp = await searchParams
  const [listingsResult, makes, cities, bodyTypes, fuelTypes, transmissions, conditions] = await Promise.all([
    getVehicles({
      search: sp.q,
      makeId: sp.make,
      modelId: sp.model,
      minYear: sp.min_year ? Number(sp.min_year) : undefined,
      maxYear: sp.max_year ? Number(sp.max_year) : undefined,
      minPrice: sp.min_price ? Number(sp.min_price) : undefined,
      maxPrice: sp.max_price ? Number(sp.max_price) : undefined,
      bodyTypeId: sp.body_type,
      fuelTypeId: sp.fuel_type,
      transmissionId: sp.transmission,
      conditionId: sp.condition,
      cityId: sp.city,
      sortBy: sp.sort || 'created_at_desc',
      pageSize: 24,
    }),
    getMakes(),
    getCities(),
    getBodyTypes(),
    getFuelTypes(),
    getTransmissions(),
    getConditionTypes(),
  ])
  const { data: listings, count } = listingsResult

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
          <ListingsFilter
            makes={makes}
            cities={cities}
            bodyTypes={bodyTypes}
            fuelTypes={fuelTypes}
            transmissions={transmissions}
            conditions={conditions}
          />
        </aside>
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {listings.slice(0, 6).map((listing: any) => (
              <VehicleCard key={listing.id} listing={listing} />
            ))}
          </div>
          {listings.length > 6 && (
            <AdBanner placementKey="listings_mid" className="w-full" />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {listings.slice(6).map((listing: any) => (
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
