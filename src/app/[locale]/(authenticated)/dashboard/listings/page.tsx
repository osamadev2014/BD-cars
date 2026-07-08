import { getTranslations } from 'next-intl/server'
import { getVehicles } from '@/lib/actions/vehicle-actions'
import { VehicleCard } from '@/components/vehicles/vehicle-card'

export default async function MyListingsPage() {
  const t = await getTranslations('common')
  const { data: listings } = await getVehicles({ pageSize: 50 })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('my_listings')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing: any) => (
          <VehicleCard key={listing.id} listing={listing} />
        ))}
      </div>
      {listings.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">{t('no_listings')}</div>
      )}
    </div>
  )
}
