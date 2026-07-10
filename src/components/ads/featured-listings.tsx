import { getFeaturedListings } from '@/lib/actions/ad-actions'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export async function FeaturedListings() {
  const t = await getTranslations('ads')
  const ct = await getTranslations('common')
  const listings = await getFeaturedListings()

  if (listings.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t('featured')}</h2>
          <p className="text-sm text-muted-foreground">{ct('listings')}</p>
        </div>
        <Link href="/listings?featured=true" className="text-sm text-primary hover:underline">
          {ct('view_all')}
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
        {listings.map((listing: any) => {
          const vehicle = listing.vehicle
          const image = vehicle?.images?.[0]
          return (
            <Link
              key={listing.id}
              href={`/listings/${listing.slug}`}
              className="flex-shrink-0 w-72 border rounded-lg bg-card hover:shadow-md transition-shadow snap-start"
            >
              <div className="aspect-[16/10] bg-muted rounded-t-lg overflow-hidden">
                {image ? (
                  <img src={image.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                    {ct('no_image')}
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold truncate">
                  {vehicle?.year} {vehicle?.make?.name} {vehicle?.model?.name}
                </p>
                <p className="text-primary font-bold mt-1">{formatPrice(listing.price)}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
