import { getTranslations } from 'next-intl/server'
import { getVehicles } from '@/lib/actions/vehicle-actions'
import { getMyDealer } from '@/lib/actions/dealer-actions'
import { ListingActions } from '@/components/listings/listing-actions'

export default async function MyListingsPage() {
  const t = await getTranslations('common')
  const [listingsResult, dealer] = await Promise.all([
    getVehicles({ pageSize: 50 }),
    getMyDealer(),
  ])
  const { data: listings } = listingsResult
  const hasFeatured = dealer?.subscription?.plan?.has_featured ?? false

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('my_listings')}</h1>
        <p className="text-sm text-muted-foreground">{listings.length} {t('listings_found')}</p>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="divide-y">
          {listings.map((listing: any) => (
            <div key={listing.id} className="px-4 py-3 hover:bg-muted/30">
              <ListingActions listing={listing} hasFeatured={hasFeatured} />
            </div>
          ))}
          {listings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">{t('no_listings')}</div>
          )}
        </div>
      </div>
    </div>
  )
}
