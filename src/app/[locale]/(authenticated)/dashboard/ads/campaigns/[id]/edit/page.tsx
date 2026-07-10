import { getTranslations } from 'next-intl/server'
import { EditCampaignForm } from './edit-campaign-form'

export default async function EditCampaignPage() {
  const t = await getTranslations('ads')
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t('editCampaign')}</h1>
      <EditCampaignForm />
    </div>
  )
}
