import { getVehicles, getMakes } from '@/lib/actions/vehicle-actions'
import { getTranslations } from 'next-intl/server'
import { VehicleCard } from '@/components/vehicles/vehicle-card'
import { SearchSection } from './search-section'

export default async function HomePage() {
  const t = await getTranslations('common')
  const { data: listings } = await getVehicles({ pageSize: 12 })
  const makes = await getMakes()

  return (
    <div>
      <SearchSection makes={makes} />
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('latest_listings')}</h2>
          <a href="/listings" className="text-sm text-primary hover:underline">
            {t('view_all')}
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {listings.map((listing: any) => (
            <VehicleCard key={listing.id} listing={listing} />
          ))}
        </div>
        {listings.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('no_listings')}
          </div>
        )}
      </section>
    </div>
  )
}
