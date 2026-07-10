import { getTranslations } from 'next-intl/server'
import { AdminAdsClient } from './admin-ads-client'

export default async function AdminAdsPage() {
  const t = await getTranslations('ads')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('allCampaigns')}</h1>
      <AdminAdsClient />
    </div>
  )
}
