'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface Make {
  id: string
  name: string
  name_ar: string
}

export function ListingsFilter({ makes }: { makes: Make[] }) {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') || ''
  const make = searchParams.get('make') || ''
  const minPrice = searchParams.get('min_price') || ''
  const maxPrice = searchParams.get('max_price') || ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/${locale}/listings?${params.toString()}`)
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold">{t('filter')}</h3>
      <div className="space-y-3">
        <Input
          placeholder={t('search_placeholder')}
          defaultValue={q}
          onChange={(e) => updateFilter('q', e.target.value)}
        />
        <Select
          value={make}
          onChange={(e) => updateFilter('make', e.target.value)}
          options={makes.map((m) => ({
            value: m.id,
            label: locale === 'ar' ? m.name_ar : m.name,
          }))}
          placeholder={t('all_makes')}
        />
        <Input
          type="number"
          placeholder={t('min_price')}
          defaultValue={minPrice}
          onChange={(e) => updateFilter('min_price', e.target.value)}
        />
        <Input
          type="number"
          placeholder={t('max_price')}
          defaultValue={maxPrice}
          onChange={(e) => updateFilter('max_price', e.target.value)}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/${locale}/listings`)}
        >
          {t('clear')}
        </Button>
      </div>
    </div>
  )
}
