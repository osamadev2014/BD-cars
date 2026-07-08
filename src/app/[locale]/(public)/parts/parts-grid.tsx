'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { getParts } from '@/lib/actions/part-actions'
import Link from 'next/link'

export default function PartsGrid() {
  const t = useTranslations('parts')
  const loc = useLocale()
  const searchParams = useSearchParams()
  const [parts, setParts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    setLoading(true)
    getParts({
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      condition: searchParams.get('condition') || undefined,
      partType: searchParams.get('partType') || undefined,
      search: searchParams.get('search') || undefined,
      page,
    }).then((result) => {
      setParts(result.data)
      setTotal(result.total)
      setLoading(false)
    })
  }, [searchParams, page])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (parts.length === 0) {
    return (
      <div className="border rounded-lg bg-card p-12 text-center">
        <p className="text-lg text-muted-foreground">{t('no_parts')}</p>
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">{total} {t('parts_found')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parts.map((part: any) => {
          const primaryImage = part.spare_part_images?.find((img: any) => img.is_primary) || part.spare_part_images?.[0]
          const name = loc === 'ar' && part.title_ar ? part.title_ar : part.title
          const catName = loc === 'ar' && part.part_categories?.name_ar ? part.part_categories.name_ar : part.part_categories?.name

          return (
            <Link key={part.id} href={`/parts/${part.slug}`} className="border rounded-lg bg-card overflow-hidden hover:border-primary transition-colors">
              <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm">
                {primaryImage ? (
                  <img src={primaryImage.url} alt={name} className="w-full h-full object-cover" />
                ) : (
                  t('no_image')
                )}
              </div>
              <div className="p-4 space-y-1">
                <p className="font-semibold truncate">{name}</p>
                {catName && <p className="text-xs text-muted-foreground">{catName}</p>}
                {part.part_number && <p className="text-xs text-muted-foreground font-mono">{part.part_number}</p>}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold">{Number(part.price).toLocaleString()} SAR</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    part.stock_status === 'in_stock' ? 'bg-green-100 text-green-700' :
                    part.stock_status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {t(part.stock_status)}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
