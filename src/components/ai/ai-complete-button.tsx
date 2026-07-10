'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { AiService } from '@/lib/ai'
import type { CarDataResult } from '@/lib/ai'

interface AiCompleteButtonProps {
  make: string
  model: string
  year: number
  onComplete: (data: CarDataResult) => void
  locale?: 'ar' | 'en'
}

export function AiCompleteButton({ make, model, year, onComplete, locale = 'ar' }: AiCompleteButtonProps) {
  const t = useTranslations('ai')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)

    const service = new AiService()
    const result = await service.completeCarData(make, model, year, locale)

    if (result.success && result.data) {
      onComplete(result.data)
    } else {
      setError(result.error || t('noData'))
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-1">
      <Button type="button" variant="outline" size="sm" onClick={handleClick} disabled={loading}>
        {loading ? <Spinner size="sm" /> : null}
        {loading ? t('loading') : t('completeData')}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
