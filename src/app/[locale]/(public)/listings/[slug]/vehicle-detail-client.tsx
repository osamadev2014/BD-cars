'use client'
import { toggleFavorite, recordView } from '@/lib/actions/vehicle-actions'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

export function VehicleDetailClient({ listing }: { listing: any }) {
  const t = useTranslations('common')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    recordView(listing.id)
  }, [listing.id])

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push(`/login`)
      return
    }
    await toggleFavorite(listing.id)
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleToggleFavorite}>
        {t('save_listing')}
      </Button>
    </div>
  )
}
