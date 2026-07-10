import { getTranslations } from 'next-intl/server'
import { getSavedSearches } from '@/lib/actions/saved-search-actions'
import { SavedSearchesList } from './saved-searches-list'

export default async function SavedSearchesPage() {
  const t = await getTranslations('common')
  const searches = await getSavedSearches()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('saved_searches')}</h1>
        <p className="text-sm text-muted-foreground">{t('saved_searches_description')}</p>
      </div>
      <SavedSearchesList searches={searches} />
    </div>
  )
}
