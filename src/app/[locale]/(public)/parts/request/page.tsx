import { getTranslations } from 'next-intl/server'
import { PartRequestForm } from './part-request-form'

export default async function RequestPartPage() {
  const t = await getTranslations('parts')
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">{t('request_part')}</h1>
      <PartRequestForm />
    </div>
  )
}
