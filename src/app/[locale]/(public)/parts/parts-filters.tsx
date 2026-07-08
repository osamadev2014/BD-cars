'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function PartsFilters({ categories, brands }: { categories: any[]; brands: any[] }) {
  const t = useTranslations('parts')
  const router = useRouter()
  const searchParams = useSearchParams()

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.set('page', '1')
    router.push(`/parts?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">{t('category')}</h3>
        <select
          value={searchParams.get('category') || ''}
          onChange={(e) => setParam('category', e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t('all_categories')}</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-2">{t('brand')}</h3>
        <select
          value={searchParams.get('brand') || ''}
          onChange={(e) => setParam('brand', e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t('all_brands')}</option>
          {brands.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-2">{t('condition')}</h3>
        <select
          value={searchParams.get('condition') || ''}
          onChange={(e) => setParam('condition', e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t('all')}</option>
          <option value="new">{t('new')}</option>
          <option value="used">{t('used')}</option>
          <option value="refurbished">{t('refurbished')}</option>
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-2">{t('part_type')}</h3>
        <select
          value={searchParams.get('partType') || ''}
          onChange={(e) => setParam('partType', e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t('all')}</option>
          <option value="original">{t('original')}</option>
          <option value="aftermarket">{t('aftermarket')}</option>
          <option value="oem">{t('oem')}</option>
        </select>
      </div>
    </div>
  )
}
