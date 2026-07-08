'use client'

import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'

export default function InspectionsPage() {
  const t = useTranslations('common')
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('inspections')}</h1>
      <div className="border rounded-lg bg-card p-12 text-center">
        <p className="text-lg text-muted-foreground">
          {t('no_inspections') || 'No inspections yet'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {t('inspections_empty') || 'When you book a vehicle inspection, it will appear here.'}
        </p>
      </div>
    </div>
  )
}
