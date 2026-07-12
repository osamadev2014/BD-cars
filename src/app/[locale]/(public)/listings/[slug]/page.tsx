import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVehicleDetail } from '@/lib/actions/vehicle-actions'
import { getFinancePartners } from '@/lib/actions/finance-actions'
import { getInsurancePartners } from '@/lib/actions/insurance-actions'
import { getTranslations } from 'next-intl/server'
import { formatPrice } from '@/lib/utils'
import { buildMetadata, buildVehicleSchema } from '@/lib/seo'
import { JsonLd } from '@/components/shared/json-ld'
import { VehicleDetailClient } from './vehicle-detail-client'
import { ListingReviews } from '@/components/listings/listing-reviews'
import { AdBanner } from '@/components/ads/ad-banner'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const listing = await getVehicleDetail(slug)
  if (!listing) return {}
  const vehicle = listing.vehicle
  const primaryImage = vehicle?.images?.find((img: any) => img.is_primary) || vehicle?.images?.[0]
  const title = `${vehicle?.year} ${vehicle?.make?.name} ${vehicle?.model?.name}`
  const desc = vehicle?.description || `${title} - ${listing.price?.toLocaleString()} SAR`
  return buildMetadata({
    title,
    description: desc.slice(0, 160),
    path: `/listings/${slug}`,
    ogImage: primaryImage?.url,
  })
}

export const revalidate = 300

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const t = await getTranslations('common')
  const listing = await getVehicleDetail(slug)
  if (!listing) return notFound()

  const [financePartners, insurancePartners] = await Promise.all([
    getFinancePartners(),
    getInsurancePartners(),
  ])

  const vehicle = listing.vehicle
  const primaryImage = vehicle?.images?.find((img: any) => img.is_primary) || vehicle?.images?.[0]

  const vehicleSchema = buildVehicleSchema({
    price: listing.price,
    mileage: vehicle?.mileage,
    year: vehicle?.year,
    make: vehicle?.make?.name,
    model: vehicle?.model?.name,
    trim: vehicle?.trim?.name,
    bodyType: vehicle?.body_type?.name,
    fuelType: vehicle?.fuel_type?.name,
    transmission: vehicle?.transmission?.name,
    color: vehicle?.color?.name,
    condition: vehicle?.condition?.name,
    description: vehicle?.description,
    image: primaryImage?.url,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/listings/${slug}`,
    sellerName: listing.seller?.full_name,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={vehicleSchema} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="aspect-[16/10] bg-muted rounded-lg overflow-hidden">
            {primaryImage ? (
              <img src={primaryImage.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
            )}
          </div>
          {vehicle?.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {vehicle.images.map((img: any) => (
                <div key={img.id} className="aspect-[4/3] bg-muted rounded overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">{t('vehicle_details')}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: t('make'), value: vehicle?.make?.name },
                { label: t('model'), value: vehicle?.model?.name },
                { label: t('year'), value: vehicle?.year },
                { label: t('body_type'), value: vehicle?.body_type?.name },
                { label: t('fuel_type'), value: vehicle?.fuel_type?.name },
                { label: t('transmission'), value: vehicle?.transmission?.name },
                { label: t('drivetrain'), value: vehicle?.drivetrain?.name },
                { label: t('mileage'), value: `${vehicle?.mileage?.toLocaleString()} km` },
                { label: t('color'), value: vehicle?.color?.name },
                { label: t('condition'), value: vehicle?.condition?.name },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-muted-foreground">{item.label}: </span>
                  <span className="font-medium">{item.value || '-'}</span>
                </div>
              ))}
            </div>
          </div>
          {vehicle?.description && (
            <div className="border rounded-lg p-6">
              <h3 className="font-bold mb-2">{t('description')}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{vehicle.description}</p>
            </div>
          )}
          <ListingReviews listingId={listing.id} />
          <VehicleDetailClient listing={listing} financePartners={financePartners} insurancePartners={insurancePartners} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <AdBanner placementKey="listing_sidebar" />
          <div className="border rounded-lg p-6 space-y-4 sticky top-20">
            <div>
              <p className="text-3xl font-bold text-primary">{formatPrice(listing.price)}</p>
              {listing.negotiable && (
                <p className="text-sm text-muted-foreground">{t('price_negotiable')}</p>
              )}
            </div>
            <div className="space-y-3">
              <a
                href={`/listings/${slug}/contact`}
                className="flex w-full items-center justify-center h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t('contact_seller')}
              </a>
              <a
                href={`/inspection/book?listing=${listing.id}`}
                className="flex w-full items-center justify-center h-10 rounded-md border border-input bg-background hover:bg-accent"
              >
                {t('book_inspection')}
              </a>
            </div>
            <div className="border-t pt-4">
              <p className="font-semibold mb-2">{t('seller_info')}</p>
              <p className="text-sm">{listing.seller?.full_name || t('anonymous')}</p>
              <p className="text-sm text-muted-foreground">
                {listing.city?.name}{listing.district ? `, ${listing.district.name}` : ''}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('member_since')} {new Date(listing.seller?.created_at).getFullYear()}
              </p>
            </div>
            {listing.dealer && (
              <div className="border-t pt-4">
                <p className="font-semibold mb-2">{t('dealer_info')}</p>
                <p className="text-sm">{listing.dealer.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
