'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { AiService } from '@/lib/ai'

interface AiDescriptionSuggestionProps {
  make: string
  model: string
  year: number
  specs: Record<string, unknown>
  locale?: 'ar' | 'en'
  value: string
  onChange: (value: string) => void
}

export function AiDescriptionSuggestion({
  make,
  model,
  year,
  specs,
  locale = 'ar',
  value,
  onChange,
}: AiDescriptionSuggestionProps) {
  const t = useTranslations('ai')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  async function handleSuggest() {
    setLoading(true)
    setStatus(null)

    const service = new AiService()
    const result = await service.suggestDescription(make, model, year, specs, locale)

    if (result.success && result.data) {
      onChange(result.data.description)
      setStatus(t('descriptionGenerated'))
    } else {
      setStatus(result.error || t('error'))
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleSuggest} disabled={loading}>
          {loading ? <Spinner size="sm" /> : null}
          {loading ? t('generating') : t('suggestDescription')}
        </Button>
        {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
      </div>
    </div>
  )
}
