import { getTranslations } from 'next-intl/server'
import { PlacementsManager } from './placements-manager'

export default async function PlacementsPage() {
  const t = await getTranslations('ads')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('managePlacements')}</h1>
      <PlacementsManager />
    </div>
  )
}
