'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface Make {
  id: string
  name: string
  name_ar: string
}

interface HeroSearchProps {
  makes: Make[]
}

export function HeroSearch({ makes }: HeroSearchProps) {
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

  const makeOptions = makes.map((m) => ({
    value: m.id,
    label: locale === 'ar' ? m.name_ar : m.name,
  }))

  const priceOptions = [
    { value: '', label: locale === 'ar' ? 'أي سعر' : 'Any Price' },
    { value: '0-50000', label: locale === 'ar' ? 'أقل من 50,000' : 'Under 50,000 SAR' },
    { value: '50000-100000', label: locale === 'ar' ? '50,000 - 100,000' : '50,000 - 100,000 SAR' },
    { value: '100000-200000', label: locale === 'ar' ? '100,000 - 200,000' : '100,000 - 200,000 SAR' },
    { value: '200000-500000', label: locale === 'ar' ? '200,000 - 500,000' : '200,000 - 500,000 SAR' },
    { value: '500000+', label: locale === 'ar' ? 'أكثر من 500,000' : 'Over 500,000 SAR' },
  ]

  return (
    <section className="rounded-2xl border border-border/60 bg-muted/30 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-2">
          {t('hero_title')}
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mx-auto mb-6">
          {t('hero_subtitle')}
        </p>

        <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <input
                placeholder={t('search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-11 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground pl-9 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
              />
            </div>
            <select
              value={makeId}
              onChange={(e) => setMakeId(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-background text-foreground px-3 text-sm shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
            >
              <option value="">{locale === 'ar' ? 'جميع الماركات' : 'All Makes'}</option>
              {makeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={`${minPrice}-${maxPrice}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-')
                setMinPrice(min)
                setMaxPrice(max || '')
              }}
              className="w-full h-11 rounded-xl border border-border bg-background text-foreground px-3 text-sm shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
            >
              {priceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSearch}
              iconLeft={<Search className="h-4 w-4" />}
              className="w-full h-11"
            >
              {t('search')}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">{locale === 'ar' ? 'روابط سريعة:' : 'Quick links:'}</span>
            {[
              { label: 'Toyota', href: '/listings?make=toyota' },
              { label: locale === 'ar' ? 'الرياض' : 'Riyadh', href: '/listings?city=riyadh' },
              { label: locale === 'ar' ? 'أقل من 50,000' : 'Under 50K', href: '/listings?max_price=50000' },
            ].map((link) => (
              <a
                key={link.href}
                href={`/${locale}${link.href}`}
                className="text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-2.5 py-1 rounded-full transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
