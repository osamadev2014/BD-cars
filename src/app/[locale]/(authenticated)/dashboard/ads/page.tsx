import { getTranslations } from 'next-intl/server'
import { AdvertiserAdsClient } from './advertiser-ads-client'

export default async function AdsDashboardPage() {
  const t = await getTranslations('ads')
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
      </div>
      <AdvertiserAdsClient />
    </div>
  )
}
