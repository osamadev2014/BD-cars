'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'

interface AiSummaryBadgeProps {
  isSummarized: boolean
}

export function AiSummaryBadge({ isSummarized }: AiSummaryBadgeProps) {
  const t = useTranslations('ai')

  if (!isSummarized) return null

  return (
    <Badge variant="success" className="gap-1">
      <Sparkles className="h-3 w-3" />
      {t('summarizeReport')}
    </Badge>
  )
}
