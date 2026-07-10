import { getTranslations } from 'next-intl/server'
import { CampaignDetailClient } from './campaign-detail-client'

export default async function CampaignDetailPage() {
  const t = await getTranslations('ads')
  return (
    <div className="container mx-auto px-4 py-8">
      <CampaignDetailClient />
    </div>
  )
}
