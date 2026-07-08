'use client'

import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'

export default function AuctionsPage() {
  const t = useTranslations('common')
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('my_auctions')}</h1>
      <div className="border rounded-lg bg-card p-12 text-center">
        <p className="text-lg text-muted-foreground">
          {t('no_auctions') || 'No auctions yet'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {t('auctions_empty') || 'Auctions you create or participate in will appear here.'}
        </p>
      </div>
    </div>
  )
}
