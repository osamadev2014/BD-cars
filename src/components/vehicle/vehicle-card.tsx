import Link from 'next/link'
import { useLocale } from 'next-intl'
import { formatPrice, getThumbnailUrl } from '@/lib/utils'
import type { Database } from '@/lib/database.types'
import { CompareButton } from '@/components/compare/compare-button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Fuel, Gauge } from 'lucide-react'

type Listing = Database['public']['Tables']['vehicle_listings']['Row'] & {
  vehicle?: any
  seller?: any
  city?: any
  avg_rating?: number
  review_count?: number
}

export function VehicleCard({ listing }: { listing: Listing }) {
  const locale = useLocale()
  const vehicle = listing.vehicle
  const primaryImage = vehicle?.images?.find((img: any) => img.is_primary) || vehicle?.images?.[0]

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group block rounded-2xl border border-border/60 bg-card shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {primaryImage ? (
          <img
            src={getThumbnailUrl(primaryImage.url)}
            alt={vehicle?.make?.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            {locale === 'ar' ? 'لا توجد صورة' : 'No Image'}
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <CompareButton listingId={listing.id} />
        </div>

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {listing.is_featured && (
            <Badge variant="premium" size="sm">
              {locale === 'ar' ? 'مميز' : 'Featured'}
            </Badge>
          )}
          {vehicle?.condition?.slug === 'new' && (
            <Badge variant="success" size="sm">
              {locale === 'ar' ? 'جديد' : 'New'}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2.5">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">
            {vehicle?.year} {vehicle?.make?.name} {vehicle?.model?.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {vehicle?.body_type?.name}
          </p>
        </div>

        <p className="text-lg font-bold text-accent">
          {formatPrice(listing.price)}
        </p>

        {(listing.avg_rating ?? 0) > 0 && (
          <p className="text-sm text-yellow-500 flex items-center gap-1">
            <span>{'★'.repeat(Math.round(listing.avg_rating ?? 0))}</span>
            <span className="text-muted-foreground">({listing.review_count ?? 0})</span>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            {vehicle?.mileage?.toLocaleString()} {vehicle?.mileage_unit || 'km'}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" />
            {vehicle?.fuel_type?.name}
          </span>
          <span>{vehicle?.transmission?.name}</span>
        </div>

        {listing.city && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {listing.city.name}
          </p>
        )}
      </div>
    </Link>
  )
}
