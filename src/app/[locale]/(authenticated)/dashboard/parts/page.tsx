'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'
import { getParts } from '@/lib/actions/part-actions'
import Link from 'next/link'

export default function MyPartsPage() {
  const t = useTranslations('parts')
  const loc = useLocale()
  const { user } = useAuth()
  const [parts, setParts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getParts({ perPage: 50 }).then((result) => {
      setParts(result.data)
      setLoading(false)
    })
  }, [user])

  if (!user) return null

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('my_parts')}</h1>
        <Link
          href="/dashboard/parts/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t('add_part')}
        </Link>
      </div>

      {loading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
      ) : parts.length === 0 ? (
        <div className="border rounded-lg bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">{t('no_parts')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {parts.map((part: any) => {
            const name = loc === 'ar' && part.title_ar ? part.title_ar : part.title
            return (
              <Link
                key={part.id}
                href={`/parts/${part.slug}`}
                className="flex items-center gap-4 border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="w-16 h-16 flex-shrink-0 bg-muted rounded overflow-hidden">
                  {part.spare_part_images?.[0] ? (
                    <img src={part.spare_part_images[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">N/A</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{name}</p>
                  {part.part_number && <p className="text-xs text-muted-foreground font-mono">{part.part_number}</p>}
                </div>
                <div className="text-right">
                  <p className="font-bold">{Number(part.price).toLocaleString()} SAR</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    part.stock_status === 'in_stock' ? 'bg-green-100 text-green-700' :
                    part.stock_status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {t(part.stock_status)}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
