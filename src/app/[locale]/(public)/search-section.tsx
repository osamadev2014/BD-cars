'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface Make {
  id: string
  name: string
  name_ar: string
}

export function SearchSection({ makes }: { makes: Make[] }) {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [makeId, setMakeId] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (makeId) params.set('make', makeId)
    if (minPrice) params.set('min_price', minPrice)
    if (maxPrice) params.set('max_price', maxPrice)
    const qs = params.toString()
    router.push(`/${locale}/listings${qs ? `?${qs}` : ''}`)
  }

  return (
    <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-2">
          {t('hero_title')}
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          {t('hero_subtitle')}
        </p>
        <div className="max-w-4xl mx-auto bg-card border rounded-lg p-4 md:p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              placeholder={t('search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Select
              value={makeId}
              onChange={(e) => setMakeId(e.target.value)}
              options={makes.map((m) => ({
                value: m.id,
                label: locale === 'ar' ? m.name_ar : m.name,
              }))}
              placeholder={t('all_makes')}
            />
            <Input
              type="number"
              placeholder={t('min_price')}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder={t('max_price')}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <Button className="w-full mt-3" size="lg" onClick={handleSearch}>
            {t('search')}
          </Button>
        </div>
      </div>
    </section>
  )
}
