'use client'

import { useState, type ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { CheckCircle, XCircle, AlertTriangle, Info, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppModal } from './AppModal'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

type StatusType = 'success' | 'error' | 'warning' | 'info'

interface StatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: StatusType
  title: string
  description?: string
  technicalDetails?: string
  primaryLabel?: string
  onPrimary?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  loading?: boolean
}

const statusConfig: Record<StatusType, { icon: ReactNode; iconClass: string }> = {
  success: {
    icon: <CheckCircle className="h-10 w-10" />,
    iconClass: 'text-green-500 dark:text-green-400',
  },
  error: {
    icon: <XCircle className="h-10 w-10" />,
    iconClass: 'text-destructive',
  },
  warning: {
    icon: <AlertTriangle className="h-10 w-10" />,
    iconClass: 'text-amber-500 dark:text-amber-400',
  },
  info: {
    icon: <Info className="h-10 w-10" />,
    iconClass: 'text-blue-500 dark:text-blue-400',
  },
}

function StatusModal({
  open,
  onOpenChange,
  type,
  title,
  description,
  technicalDetails,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  loading = false,
}: StatusModalProps) {
  const locale = useLocale()
  const t = useTranslations('common')
  const isRtl = locale === 'ar'
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { icon, iconClass } = statusConfig[type]

  return (
    <AppModal open={open} onOpenChange={onOpenChange} loading={loading}>
      <div className="flex flex-col items-center gap-4 py-4">
        <div className={cn(iconClass)}>{icon}</div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {technicalDetails && (
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors',
              )}
            >
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform',
                  detailsOpen && 'rotate-180',
                )}
              />
              <span>{isRtl ? 'التفاصيل التقنية' : 'Technical Details'}</span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="mt-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
              {technicalDetails}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      )}

      <div className={cn('flex gap-3', isRtl ? 'flex-row-reverse' : 'flex-row')}>
        {onPrimary && (
          <Button
            variant={type === 'error' ? 'destructive' : 'primary'}
            onClick={onPrimary}
            className="flex-1"
            loading={loading}
          >
            {primaryLabel || t('confirm')}
          </Button>
        )}
        {onSecondary && (
          <Button variant="secondary" onClick={onSecondary} className="flex-1">
            {secondaryLabel || t('cancel')}
          </Button>
        )}
      </div>
    </AppModal>
  )
}

export { StatusModal, type StatusModalProps, type StatusType }
