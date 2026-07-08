'use client'

import { Suspense, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { bookInspection, getInspectionCenterBySlug } from '@/lib/actions/inspection-actions'
import { useAuth } from '@/hooks/use-auth'

function BookForm() {
  const t = useTranslations('inspection')
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const slug = params?.slug as string
  const serviceId = searchParams?.get('service') || ''

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [centerId, setCenterId] = useState('')

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    if (slug) {
      getInspectionCenterBySlug(slug).then((center) => {
        if (center) setCenterId(center.id)
      })
    }
  }, [user, slug, router])

  if (!user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!serviceId) { setError(t('select_service')); return }
    if (!centerId) { setError(t('invalid_center')); return }
    if (!date || !time) { setError(t('select_datetime')); return }

    setIsLoading(true)
    const appointmentDate = new Date(`${date}T${time}`).toISOString()
    const result = await bookInspection({
      serviceId,
      centerId,
      appointmentDate,
      notes: notes || undefined,
    })
    setIsLoading(false)

    if (!result.success) {
      setError(t('booking_error'))
      return
    }

    setSuccess(t('booking_success'))
    setTimeout(() => router.push('/dashboard/inspections'), 2000)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">{t('book_title')}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('date')}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('time')}</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('notes')}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={isLoading || !centerId}
          className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? '...' : t('confirm_booking')}
        </button>
      </form>
    </div>
  )
}

export default function BookInspectionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <BookForm />
    </Suspense>
  )
}
