'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppModal } from './AppModal'
import { Button } from '@/components/ui/button'

interface DeleteConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  onConfirm: () => void
  onCancel?: () => void
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}

function DeleteConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  loading = false,
}: DeleteConfirmationModalProps) {
  const locale = useLocale()
  const t = useTranslations('common')
  const isRtl = locale === 'ar'

  return (
    <AppModal open={open} onOpenChange={onOpenChange} loading={loading}>
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <Trash2 className="h-7 w-7 text-destructive" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            {title || t('delete')}
          </h3>
          {description && (
            <p className="mt-1.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className={cn('flex gap-3', isRtl ? 'flex-row-reverse' : 'flex-row')}>
        <Button
          variant="destructive"
          onClick={onConfirm}
          className="flex-1"
          loading={loading}
        >
          {confirmLabel || t('delete')}
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel || (() => onOpenChange(false))}
          className="flex-1"
        >
          {cancelLabel || t('cancel')}
        </Button>
      </div>
    </AppModal>
  )
}

export { DeleteConfirmationModal }
export type { DeleteConfirmationModalProps }
