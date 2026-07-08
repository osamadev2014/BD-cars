'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { getConversation, getMessages, sendMessage, markConversationRead } from '@/lib/actions/message-actions'
import { useAuth } from '@/hooks/use-auth'

export default function ConversationPage() {
  const t = useTranslations('messages')
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const conversationId = params?.id as string
  const [conv, setConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    Promise.all([
      getConversation(conversationId).then(setConv),
      getMessages(conversationId).then(setMessages),
    ]).then(() => {
      markConversationRead(conversationId)
      setLoading(false)
    })
  }, [user, conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!user) return null

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
      </div>
    )
  }

  if (!conv) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">{t('not_found')}</p>
      </div>
    )
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sending) return
    setSending(true)
    const result = await sendMessage(conversationId, input.trim())
    setSending(false)
    if (result.success) {
      setInput('')
      const updated = await getMessages(conversationId)
      setMessages(updated)
      markConversationRead(conversationId)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        onClick={() => router.push('/dashboard/messages')}
        className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
      >
        &larr; {t('back')}
      </button>

      <h1 className="text-xl font-bold mb-4 truncate">
        {conv.subject || conv.vehicle_listings?.title || conv.vehicle_listings?.title_ar || t('conversation')}
      </h1>

      <div className="border rounded-lg bg-card mb-4 max-h-[60vh] overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground py-8">{t('no_messages')}</p>
        )}
        {messages.map((msg: any) => {
          const isOwn = msg.sender_id === user.id
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {sending ? '...' : t('send')}
        </button>
      </form>
    </div>
  )
}
