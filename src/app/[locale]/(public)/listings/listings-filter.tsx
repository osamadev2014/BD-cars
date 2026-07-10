'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { LookupItem } from '@/lib/actions/lookups-actions'
import { SaveSearchDialog } from '@/components/listings/save-search-dialog'

interface ListingsFilterProps {
  makes: LookupItem[]
  cities: LookupItem[]
  bodyTypes: LookupItem[]
  fuelTypes: LookupItem[]
  transmissions: LookupItem[]
  conditions: LookupItem[]
}

export function ListingsFilter({ makes, cities, bodyTypes, fuelTypes, transmissions, conditions }: ListingsFilterProps) {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()

  const current: Record<string, string> = {}
  const keys = ['q', 'make', 'model', 'min_price', 'max_price', 'min_year', 'max_year', 'city', 'body_type', 'fuel_type', 'transmission', 'condition', 'sort']
  for (const k of keys) current[k] = searchParams.get(k) || ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/${locale}/listings?${params.toString()}`)
  }

  const label = (item: LookupItem) => locale === 'ar' ? item.name_ar : item.name

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold">{t('filter')}</h3>
      <div className="space-y-3">
        <Input
          placeholder={t('search_placeholder')}
          defaultValue={current.q}
          onChange={(e) => updateFilter('q', e.target.value)}
        />
        <Select
          value={current.make}
          onChange={(e) => { updateFilter('make', e.target.value); updateFilter('model', '') }}
          options={makes.map((m) => ({ value: m.id, label: label(m) }))}
          placeholder={t('all_makes')}
        />
        <Select
          value={current.city}
          onChange={(e) => updateFilter('city', e.target.value)}
          options={cities.map((c) => ({ value: c.id, label: label(c) }))}
          placeholder={t('all_cities')}
        />
        <Select
          value={current.body_type}
          onChange={(e) => updateFilter('body_type', e.target.value)}
          options={bodyTypes.map((b) => ({ value: b.id, label: label(b) }))}
          placeholder={t('all_body_types')}
        />
        <Select
          value={current.fuel_type}
          onChange={(e) => updateFilter('fuel_type', e.target.value)}
          options={fuelTypes.map((f) => ({ value: f.id, label: label(f) }))}
          placeholder={t('all_fuel_types')}
        />
        <Select
          value={current.transmission}
          onChange={(e) => updateFilter('transmission', e.target.value)}
          options={transmissions.map((tr) => ({ value: tr.id, label: label(tr) }))}
          placeholder={t('all_transmissions')}
        />
        <Select
          value={current.condition}
          onChange={(e) => updateFilter('condition', e.target.value)}
          options={conditions.map((c) => ({ value: c.id, label: label(c) }))}
          placeholder={t('all_conditions')}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder={t('min_year')}
            defaultValue={current.min_year}
            onChange={(e) => updateFilter('min_year', e.target.value)}
          />
          <Input
            type="number"
            placeholder={t('max_year')}
            defaultValue={current.max_year}
            onChange={(e) => updateFilter('max_year', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder={t('min_price')}
            defaultValue={current.min_price}
            onChange={(e) => updateFilter('min_price', e.target.value)}
          />
          <Input
            type="number"
            placeholder={t('max_price')}
            defaultValue={current.max_price}
            onChange={(e) => updateFilter('max_price', e.target.value)}
          />
        </div>
        <Select
          value={current.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          options={[
            { value: 'created_at_desc', label: t('newest_first') },
            { value: 'price_asc', label: t('price_low_to_high') },
            { value: 'price_desc', label: t('price_high_to_low') },
            { value: 'year_desc', label: t('newest_year_first') },
            { value: 'year_asc', label: t('oldest_year_first') },
          ]}
          placeholder={t('sort_by')}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/${locale}/listings`)}
        >
          {t('clear')}
        </Button>
        <SaveSearchDialog />
      </div>
    </div>
  )
}
