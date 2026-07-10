import { getTranslations } from 'next-intl/server'
import { getAdPlacements } from '@/lib/actions/ad-actions'
import { CreateCampaignForm } from './create-campaign-form'

export default async function CreateCampaignPage() {
  const t = await getTranslations('ads')
  const placements = await getAdPlacements()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t('createCampaign')}</h1>
      <CreateCampaignForm placements={placements} />
    </div>
  )
}
