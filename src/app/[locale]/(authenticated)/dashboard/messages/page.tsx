'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { getUserConversations } from '@/lib/actions/message-actions'
import { useAuth } from '@/hooks/use-auth'

export default function MessagesPage() {
  const t = useTranslations('messages')
  const router = useRouter()
  const { user } = useAuth()
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getUserConversations().then(setConversations).finally(() => setLoading(false))
  }, [user])

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('inbox')}</h1>

      {loading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
      ) : conversations.length === 0 ? (
        <div className="border rounded-lg bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">{t('empty')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((c: any) => (
            <button
              key={c.conversation_id}
              onClick={() => router.push(`/dashboard/messages/${c.conversation_id}`)}
              className="w-full text-left border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
            >
              <p className="font-medium truncate">
                {c.conversations?.subject || c.conversations?.vehicle_listings?.title || t('conversation')}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {c.conversations?.vehicle_listings?.title || c.conversations?.vehicle_listings?.title_ar || ''}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
