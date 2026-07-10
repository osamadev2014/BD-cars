import Link from 'next/link'
import { useLocale } from 'next-intl'
import { formatPrice } from '@/lib/utils'

interface FeaturedVehicleCardProps {
  listing: {
    id: string
    slug: string
    price: number
    vehicle?: {
      year?: number
      make?: { name: string; name_ar: string }
      model?: { name: string; name_ar: string }
      images?: { url: string; is_primary?: boolean }[]
      mileage?: number
      mileage_unit?: string
      fuel_type?: { name: string }
      transmission?: { name: string }
    }
  }
}

export function FeaturedVehicleCard({ listing }: FeaturedVehicleCardProps) {
  const locale = useLocale()
  const vehicle = listing.vehicle
  const primaryImage = vehicle?.images?.find((img: any) => img.is_primary) || vehicle?.images?.[0]
  const isRtl = locale === 'ar'

  const makeName = isRtl ? vehicle?.make?.name_ar : vehicle?.make?.name
  const modelName = isRtl ? vehicle?.model?.name_ar : vehicle?.model?.name

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="flex-shrink-0 w-72 rounded-2xl border border-border/60 bg-card shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden snap-start group"
    >
      <div className="aspect-[16/10] bg-muted relative overflow-hidden">
        {primaryImage ? (
          <img src={primaryImage.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
            {locale === 'ar' ? 'لا توجد صورة' : 'No Image'}
          </div>
        )}
      </div>
      <div className="p-4 space-y-1.5">
        <p className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">
          {vehicle?.year} {makeName} {modelName}
        </p>
        <p className="text-lg font-bold text-accent">{formatPrice(listing.price)}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{vehicle?.mileage?.toLocaleString()} {vehicle?.mileage_unit || 'km'}</span>
          <span>&middot;</span>
          <span>{vehicle?.fuel_type?.name}</span>
          <span>&middot;</span>
          <span>{vehicle?.transmission?.name}</span>
        </div>
      </div>
    </Link>
  )
}
