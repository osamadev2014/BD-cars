import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Database } from '@/lib/database.types'

type Listing = Database['public']['Tables']['vehicle_listings']['Row'] & {
  vehicle?: any
  seller?: any
  city?: any
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
            src={primaryImage.url}
            alt={vehicle?.make?.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Image
          </div>
        )}
        {listing.status === 'featured' && (
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
