import { getTranslations } from 'next-intl/server'
import { getAdPlacements } from '@/lib/actions/ad-actions'
import { AdBanner } from './ad-banner'

interface SponsorSectionProps {
  placementKey?: string
  className?: string
}

export async function SponsorSection({ placementKey = 'homepage_sponsor', className }: SponsorSectionProps) {
  const t = await getTranslations('ads')
  const placements = await getAdPlacements()
  const placement = placements.find((p) => p.key === placementKey)

  if (!placement) return null

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {t('sponsored')}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <AdBanner placementKey={placementKey} />
    </div>
  )
}
