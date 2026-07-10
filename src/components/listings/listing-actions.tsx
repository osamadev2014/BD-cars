'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { featureListing, unfeatureListing } from '@/lib/actions/vehicle-actions'
import { Button } from '@/components/ui/button'

export function ListingActions({ listing, hasFeatured }: { listing: any; hasFeatured: boolean }) {
  const t = useTranslations('common')
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const isFeatured = listing.is_featured && listing.featured_until && new Date(listing.featured_until) > new Date()

  const handleFeature = async () => {
    setLoading(true)
    try {
      if (isFeatured) {
        await unfeatureListing(listing.id)
      } else {
        await featureListing(listing.id, 7)
      }
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const vehicle = listing.vehicle

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {listing.vehicle?.images?.[0] && (
          <img src={listing.vehicle.images[0].url} className="w-12 h-10 rounded object-cover" alt="" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {vehicle?.make?.name} {vehicle?.model?.name} ({vehicle?.year})
          </p>
          <p className="text-xs text-muted-foreground">
            {listing.price} SAR
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {hasFeatured && (
          <Button
            size="sm"
            variant={isFeatured ? 'primary' : 'outline'}
            onClick={handleFeature}
            disabled={loading}
          >
            {isFeatured ? t('featured') : t('promote')}
          </Button>
        )}
        <a href={`/listings/${listing.slug}`} className="text-xs text-primary hover:underline">
          {t('view')}
        </a>
      </div>
    </div>
  )
}
