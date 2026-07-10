'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AdBannerProps {
  placementKey: string
  className?: string
}

export function AdBanner({ placementKey, className }: AdBannerProps) {
  const [ad, setAd] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAd() {
      try {
        const res = await fetch('/api/v1/ads/placements')
        const json = await res.json()
        if (json.success) {
          const placements = json.data?.placements || []
          const placement = placements.find((p: any) => p.key === placementKey)
          if (placement?.campaigns?.length > 0) {
            const activeCampaign = placement.campaigns.find((c: any) => c.status === 'active')
            if (activeCampaign) {
              setAd(activeCampaign)
            }
          }
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchAd()
  }, [placementKey])

  if (loading) return <div className={cn('bg-muted/50 rounded-lg animate-pulse', className)} style={{ minHeight: 90 }} />

  if (!ad) return null

  const handleClick = async () => {
    try {
      await fetch('/api/v1/ads/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign_id: ad.id }),
      })
    } catch { /* silent */ }
    if (ad.target_url) {
      window.open(ad.target_url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleImpression = async () => {
    try {
      await fetch('/api/v1/ads/impression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign_id: ad.id }),
      })
    } catch { /* silent */ }
  }

  return (
    <div className={cn('relative group', className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        className="block cursor-pointer overflow-hidden rounded-lg"
        onMouseEnter={handleImpression}
      >
        {ad.image_url ? (
          <img
            src={ad.image_url}
            alt={ad.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center">
            <span className="text-lg font-semibold text-muted-foreground">{ad.name}</span>
          </div>
        )}
      </div>
      <span className="absolute top-1 start-1 text-[10px] uppercase tracking-wider bg-background/80 text-muted-foreground px-1.5 py-0.5 rounded">
        Ad
      </span>
    </div>
  )
}
