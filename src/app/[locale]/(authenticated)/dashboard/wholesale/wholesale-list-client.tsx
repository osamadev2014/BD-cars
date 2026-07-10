'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createWholesaleRequest } from '@/lib/actions/wholesale-actions'
import Link from 'next/link'

const STATUS_LABELS: Record<string, string> = { open: 'status_open', negotiation: 'status_negotiation', closed: 'status_closed', awarded: 'status_awarded' }
const STATUS_COLORS: Record<string, string> = { open: 'bg-blue-100 text-blue-800', negotiation: 'bg-yellow-100 text-yellow-800', closed: 'bg-gray-100 text-gray-800', awarded: 'bg-green-100 text-green-800' }

export function WholesaleListClient({ requests }: { requests: any[] }) {
  const t = useTranslations('wholesale')
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const fd = new FormData()
    fd.set('title', title)
    fd.set('description', description)
    if (budgetMin) fd.set('budget_min', budgetMin)
    if (budgetMax) fd.set('budget_max', budgetMax)
    fd.set('notes', notes)
    const result = await createWholesaleRequest(fd)
    setLoading(false)
    if (result.success) { setShowForm(false); router.push(`/dashboard/wholesale/${result.id}`) }
    else alert(result.error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('wholesale')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          {t('new_request')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border rounded-lg p-4 space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('title')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t('description')} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <input value={budgetMin} onChange={e => setBudgetMin(e.target.value)} type="number" placeholder={t('budget_min')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input value={budgetMax} onChange={e => setBudgetMax(e.target.value)} type="number" placeholder={t('budget_max')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('notes')} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
          <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{t('submit')}</button>
        </form>
      )}

      <div className="space-y-3">
        {requests.map((req: any) => (
          <Link key={req.id} href={`/dashboard/wholesale/${req.id}`} className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <p className="font-medium">{req.title}</p>
              <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[req.status] || STATUS_COLORS.open}`}>{t(STATUS_LABELS[req.status] || STATUS_LABELS.open)}</span>
            </div>
            {req.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{req.description}</p>}
            <div className="flex gap-3 text-xs text-muted-foreground mt-2">
              <span>{t('offers')}: {req.offers?.[0]?.count || 0}</span>
              <span>{new Date(req.created_at).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
        {requests.length === 0 && <p className="text-muted-foreground">{t('no_requests')}</p>}
      </div>
    </div>
  )
}
