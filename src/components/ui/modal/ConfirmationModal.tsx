'use client'

import { useLocale, useTranslations } from 'next-intl'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppModal } from './AppModal'
import { Button } from '@/components/ui/button'

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  onConfirm: () => void
  onCancel?: () => void
  confirmLabel?: string
  cancelLabel?: string
  secondaryLabel?: string
  onSecondary?: () => void
  danger?: boolean
  loading?: boolean
}

function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  secondaryLabel,
  onSecondary,
  danger = false,
  loading = false,
}: ConfirmationModalProps) {
  const locale = useLocale()
  const t = useTranslations('common')
  const isRtl = locale === 'ar'

  return (
    <AppModal open={open} onOpenChange={onOpenChange} loading={loading}>
      <div className="flex flex-col items-center gap-4 py-4">
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-full',
            danger
              ? 'bg-destructive/10'
              : 'bg-amber-500/10 dark:bg-amber-500/20',
          )}
        >
          {danger ? (
            <Trash2 className="h-7 w-7 text-destructive" />
          ) : (
            <AlertTriangle className="h-7 w-7 text-amber-500 dark:text-amber-400" />
          )}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className={cn('flex flex-col sm:flex-row gap-3', isRtl ? 'sm:flex-row-reverse' : 'sm:flex-row')}>
        {onSecondary && secondaryLabel && (
          <Button variant="outline" onClick={onSecondary} className="sm:flex-1 order-1">
            {secondaryLabel}
          </Button>
        )}
        <Button
          variant={danger ? 'destructive' : 'primary'}
          onClick={onConfirm}
          className="sm:flex-1 order-2"
          loading={loading}
        >
          {confirmLabel || t('confirm')}
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel || (() => onOpenChange(false))}
          className="sm:flex-1 order-3"
        >
          {cancelLabel || t('cancel')}
        </Button>
      </div>
    </AppModal>
  )
}

export { ConfirmationModal }
export type { ConfirmationModalProps }
