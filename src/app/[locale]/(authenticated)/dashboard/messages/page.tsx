'use client'

import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'

export default function MessagesPage() {
  const t = useTranslations('common')
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('messages')}</h1>
      <div className="border rounded-lg bg-card p-12 text-center">
        <p className="text-lg text-muted-foreground">
          {t('no_messages') || 'No messages yet'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {t('messages_empty') || 'When you contact a seller or receive inquiries, your conversations will appear here.'}
        </p>
      </div>
    </div>
  )
}
