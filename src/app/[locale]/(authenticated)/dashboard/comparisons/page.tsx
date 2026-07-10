import { getTranslations } from 'next-intl/server'
import { getMyComparisons } from '@/lib/actions/compare-actions'
import { ComparisonsList } from './comparisons-list'

export default async function ComparisonsPage() {
  const t = await getTranslations('common')
  const comparisons = await getMyComparisons()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('saved_comparisons')}</h1>
        <p className="text-sm text-muted-foreground">{t('saved_comparisons_description')}</p>
      </div>
      <ComparisonsList comparisons={comparisons} />
    </div>
  )
}
