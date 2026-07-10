import Link from 'next/link'
import { formatPrice, getThumbnailUrl, getOptimizedImageUrl } from '@/lib/utils'
import type { Database } from '@/lib/database.types'
import { CompareButton } from '@/components/compare/compare-button'

type Listing = Database['public']['Tables']['vehicle_listings']['Row'] & {
  vehicle?: any
  seller?: any
  city?: any
  avg_rating?: number
  review_count?: number
}

export function VehicleCard({ listing }: { listing: Listing }) {
  const vehicle = listing.vehicle
  const primaryImage = vehicle?.images?.find((img: any) => img.is_primary) || vehicle?.images?.[0]

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {primaryImage ? (
          <img
            src={getThumbnailUrl(primaryImage.url)}
            alt={vehicle?.make?.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2">
          <CompareButton listingId={listing.id} />
        </div>
        {listing.is_featured && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold truncate">
              {vehicle?.make?.name} {vehicle?.model?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {vehicle?.year} &middot; {vehicle?.body_type?.name}
            </p>
          </div>
        </div>
        <p className="text-lg font-bold text-primary">
          {formatPrice(listing.price)}
        </p>
        {(listing.avg_rating ?? 0) > 0 && (
          <p className="text-sm text-yellow-500">
            {'★'.repeat(Math.round(listing.avg_rating ?? 0))}{'☆'.repeat(5 - Math.round(listing.avg_rating ?? 0))}
            <span className="text-muted-foreground ml-1">({listing.review_count ?? 0})</span>
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{vehicle?.mileage_text || `${vehicle?.mileage?.toLocaleString()} km`}</span>
          <span>{vehicle?.transmission?.name}</span>
          <span>{vehicle?.fuel_type?.name}</span>
        </div>
        {listing.city && (
          <p className="text-xs text-muted-foreground">{listing.city.name}</p>
        )}
      </div>
    </Link>
  )
}
