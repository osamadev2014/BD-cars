'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { addTicketMessage, updateTicketStatus } from '@/lib/actions/support-actions'
import { Button } from '@/components/ui/button'

const STATUS_LABELS: Record<string, string> = { open: 'status_open', in_progress: 'status_in_progress', waiting_customer: 'status_waiting', resolved: 'status_resolved', closed: 'status_closed' }
const STATUS_COLORS: Record<string, string> = { open: 'bg-blue-100 text-blue-800', in_progress: 'bg-yellow-100 text-yellow-800', waiting_customer: 'bg-orange-100 text-orange-800', resolved: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800' }
const ALL_STATUSES = ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed']

export function AdminTicketDetailClient({ ticket }: { ticket: any }) {
  const t = useTranslations('support')
  const router = useRouter()
  const [reply, setReply] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [sending, setSending] = useState(false)
  const [newStatus, setNewStatus] = useState(ticket.status)
  const [updating, setUpdating] = useState(false)

  const messages = ticket.messages || []

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim() || sending) return
    setSending(true)
    const formData = new FormData()
    formData.set('content', reply)
    // For simplicity, we send as regular message; internal note via separate toggle could be enhanced
    await addTicketMessage(ticket.id, formData)
    setSending(false)
    setReply('')
    router.refresh()
  }

  const handleStatusChange = async (status: string) => {
    setUpdating(true)
    await updateTicketStatus(ticket.id, status)
    setNewStatus(status)
    setUpdating(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <p className="text-sm text-muted-foreground">{t(`cat_${ticket.category}`)}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[ticket.status] || STATUS_COLORS.open}`}>{t(STATUS_LABELS[ticket.status] || STATUS_LABELS.open)}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{t('update_status')}:</span>
        <select
          value={newStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{t(STATUS_LABELS[s])}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {messages.map((msg: any) => (
          <div key={msg.id} className={`border rounded-lg p-4 ${msg.is_internal ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">{msg.sender?.full_name || 'User'}</span>
              <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</span>
              {msg.is_internal && <span className="text-xs text-yellow-600 font-medium">{t('internal_note')}</span>}
            </div>
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleReply} className="space-y-3 border-t pt-4">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder={t('reply_placeholder')}
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none"
          maxLength={5000}
        />
        <Button type="submit" disabled={sending || !reply.trim()}>
          {sending ? t('sending') : t('send_reply')}
        </Button>
      </form>
    </div>
  )
}
