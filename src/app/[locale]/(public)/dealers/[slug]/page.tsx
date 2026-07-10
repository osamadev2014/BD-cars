import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getDealerBySlug, getDealerListings } from '@/lib/actions/dealer-actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DealerRating } from '@/components/dealers/dealer-rating'
import { buildMetadata, buildLocalBusinessSchema } from '@/lib/seo'
import { JsonLd } from '@/components/shared/json-ld'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const dealer = await getDealerBySlug(slug)
  if (!dealer) return {}
  return buildMetadata({
    title: dealer.name,
    description: dealer.description || `${dealer.name} - ${dealer.cities?.name || ''} dealer in Saudi Arabia`,
    path: `/dealers/${slug}`,
    ogImage: dealer.logo_url || undefined,
  })
}

export default async function DealerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const t = await getTranslations('dealers')
  const dealer = await getDealerBySlug(slug)
  if (!dealer) notFound()

  const listings = await getDealerListings(dealer.id)

  const dealerSchema = buildLocalBusinessSchema({
    name: dealer.name,
    description: dealer.description,
    logo: dealer.logo_url,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dealers/${slug}`,
    telephone: dealer.phone,
    email: dealer.email,
    address: dealer.cities?.name,
    aggregateRating: dealer.rating > 0 ? {
      ratingValue: dealer.rating,
      reviewCount: dealer.review_count || 0,
    } : undefined,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={dealerSchema} />
      <div className="bg-card border rounded-lg p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground overflow-hidden flex-shrink-0">
            {dealer.logo_url ? (
              <img src={dealer.logo_url} alt={dealer.name} className="w-full h-full object-cover" />
            ) : (
              dealer.name[0]
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{dealer.name}</h1>
            {dealer.cities && <p className="text-muted-foreground">{dealer.cities.name || dealer.cities.name_ar}</p>}
            {dealer.rating > 0 && (
              <p className="text-sm">{'★'.repeat(Math.round(dealer.rating))} ({dealer.review_count} {t('reviews')})</p>
            )}
            <div className="flex gap-4 text-sm">
              {dealer.phone && <span dir="ltr">{dealer.phone}</span>}
              {dealer.email && <span>{dealer.email}</span>}
            </div>
          </div>
        </div>
        {dealer.description && <p className="mt-4 text-muted-foreground">{dealer.description}</p>}
      </div>

      <div className="mb-8">
        <DealerRating dealer={dealer} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">{t('inventory')} ({listings.length})</h2>
        {listings.length === 0 ? (
          <div className="border rounded-lg bg-card p-12 text-center">
            <p className="text-muted-foreground">{t('no_listings')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing: any) => {
              const vehicle = listing.vehicles
              const image = listing.primary_image
              return (
                <Link key={listing.id} href={`/listings/${listing.slug}`} className="border rounded-lg bg-card overflow-hidden hover:border-primary transition-colors">
                  <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm overflow-hidden">
                    {image ? <img src={image.url} alt="" className="w-full h-full object-cover" /> : <span>{t('no_image')}</span>}
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="font-semibold truncate">{vehicle?.make?.name} {vehicle?.model?.name} ({vehicle?.year})</p>
                    <p className="text-sm text-muted-foreground">{vehicle?.mileage?.toLocaleString()} km</p>
                    <p className="font-bold">{Number(listing.price).toLocaleString()} SAR</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
