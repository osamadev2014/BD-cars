'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createTicket } from '@/lib/actions/support-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const CATEGORIES = ['general', 'technical', 'report', 'account', 'other']

export function ContactForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const t = useTranslations('support')
  const router = useRouter()
  const [category, setCategory] = useState('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{t('login_required')}</p>
        <Button onClick={() => router.push('/login')}>{t('login')}</Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim() || loading) return
    setLoading(true)
    const formData = new FormData()
    formData.set('subject', subject)
    formData.set('category', category)
    formData.set('message', message)
    const result = await createTicket(formData)
    setLoading(false)
    if (result.success) {
      setDone(true)
      router.push(`/dashboard/tickets/${result.ticket_id}`)
    } else {
      alert(result.error)
    }
  }

  if (done) {
    return <p className="text-center text-green-600 py-8">{t('ticket_created')}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">{t('category')}</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{t(`cat_${c}`)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">{t('subject')}</label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t('subject_placeholder')}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">{t('message')}</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('message_placeholder')}
          className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none mt-1"
          required
          maxLength={5000}
        />
      </div>
      <Button type="submit" disabled={loading || !subject.trim() || !message.trim()}>
        {loading ? t('sending') : t('submit')}
      </Button>
    </form>
  )
}
