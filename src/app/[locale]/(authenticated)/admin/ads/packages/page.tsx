import { getTranslations } from 'next-intl/server'
import { PackagesManager } from './packages-manager'

export default async function PackagesPage() {
  const t = await getTranslations('ads')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('managePackages')}</h1>
      <PackagesManager />
    </div>
  )
}
