import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import PartsGrid from './parts-grid'
import PartsFilters from './parts-filters'

export const dynamic = 'force-dynamic'

export default async function PartsPage() {
  const t = await getTranslations('parts')
  const [categories, brands] = await Promise.all([
    import('@/lib/actions/part-actions').then(m => m.getPartCategories()),
    import('@/lib/actions/part-actions').then(m => m.getPartBrands()),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
      <p className="text-muted-foreground mb-8">{t('subtitle')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <PartsFilters categories={categories} brands={brands} />
        </aside>
        <div className="lg:col-span-3">
          <Suspense fallback={<div className="h-32 w-full animate-pulse rounded-lg bg-muted" />}>
            <PartsGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
