'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { startConversation } from '@/lib/actions/message-actions'
import { getVehicleDetail } from '@/lib/actions/vehicle-actions'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export default function ContactSellerPage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations('common')
  const { user } = useAuth()
  const slug = params?.slug as string

  const [listingId, setListingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (slug) {
      getVehicleDetail(slug).then((listing) => {
        if (listing?.id) setListingId(listing.id)
      })
    }
  }, [slug])

  if (!user) {
    router.push(`/login`)
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading || !listingId) return
    setLoading(true)

    try {
      const result = await startConversation({
        listingId,
        content: message.trim(),
        subject: 'inquiry',
      })
      if (result.success && result.conversation_id) {
        router.push(`/dashboard/messages/${result.conversation_id}`)
      } else {
        alert(result.error || 'Failed to send message')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <button
        onClick={() => router.back()}
        className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
      >
        &larr; {t('back')}
      </button>

      <h1 className="text-2xl font-bold mb-2">{t('contact_seller')}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('your_message')}</p>

      {!listingId && (
        <p className="text-sm text-muted-foreground animate-pulse">{t('loading')}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('message_placeholder')}
          className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none"
          required
          maxLength={2000}
          disabled={!listingId}
        />
        <p className="text-xs text-muted-foreground text-right">
          {message.length}/2000
        </p>
        <Button type="submit" disabled={loading || !message.trim() || !listingId} className="w-full">
          {loading ? t('loading') : t('send')}
        </Button>
      </form>
    </div>
  )
}
