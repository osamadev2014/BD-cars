'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { AiService } from '@/lib/ai'
import { formatPrice } from '@/lib/utils'

interface AiPriceEstimateProps {
  make: string
  model: string
  year: number
  mileage: number
  condition: string
  locale?: 'ar' | 'en'
}

export function AiPriceEstimate({
  make,
  model,
  year,
  mileage,
  condition,
  locale = 'ar',
}: AiPriceEstimateProps) {
  const t = useTranslations('ai')
  const [price, setPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const service = new AiService()

    service.estimatePrice(make, model, year, mileage, condition, locale).then((result) => {
      if (result.success && result.data) {
        setPrice(result.data.estimatedPrice)
      } else {
        setError(result.error || t('error'))
      }
      setLoading(false)
    })
  }, [make, model, year, mileage, condition, locale, t])

  if (loading) return <Spinner size="sm" />

  if (error || price === null) return null

  return (
    <Badge variant="secondary" className="gap-1">
      <span className="text-xs">{t('priceEstimate')}:</span>
      <span className="font-semibold">{formatPrice(price)}</span>
      <span className="text-[10px] opacity-70">({t('forReferenceOnly')})</span>
    </Badge>
  )
}
