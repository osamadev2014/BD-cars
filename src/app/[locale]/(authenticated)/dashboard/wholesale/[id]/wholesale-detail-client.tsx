'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createWholesaleOffer } from '@/lib/actions/wholesale-actions'

const STATUS_LABELS: Record<string, string> = { open: 'status_open', negotiation: 'status_negotiation', closed: 'status_closed', awarded: 'status_awarded' }
const STATUS_COLORS: Record<string, string> = { open: 'bg-blue-100 text-blue-800', negotiation: 'bg-yellow-100 text-yellow-800', closed: 'bg-gray-100 text-gray-800', awarded: 'bg-green-100 text-green-800' }

export function WholesaleDetailClient({ request }: { request: any }) {
  const t = useTranslations('wholesale')
  const router = useRouter()
  const [showOffer, setShowOffer] = useState(false)
  const [totalPrice, setTotalPrice] = useState('')
  const [validityDays, setValidityDays] = useState('7')
  const [offerNotes, setOfferNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const fd = new FormData()
    fd.set('total_price', totalPrice)
    fd.set('validity_days', validityDays)
    fd.set('notes', offerNotes)
    const result = await createWholesaleOffer(request.id, fd)
    setLoading(false)
    if (result.success) { setShowOffer(false); router.refresh() }
    else alert(result.error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{request.title}</h1>
          <p className="text-sm text-muted-foreground">{request.dealer?.name} &middot; {new Date(request.created_at).toLocaleDateString()}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[request.status] || STATUS_COLORS.open}`}>{t(STATUS_LABELS[request.status] || STATUS_LABELS.open)}</span>
      </div>

      {request.description && <p className="text-muted-foreground">{request.description}</p>}

      {(request.budget_min || request.budget_max) && (
        <p className="text-sm">{t('budget')}: {request.budget_min ? `${request.budget_min} SAR` : ''} - {request.budget_max ? `${request.budget_max} SAR` : ''}</p>
      )}

      {request.items?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">{t('items')}</h3>
          {request.items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{item.make?.name || 'Any'} {item.model?.name || ''}</span>
              <span>x{item.quantity}</span>
              {item.year_from && <span>({item.year_from}-{item.year_to})</span>}
            </div>
          ))}
        </div>
      )}

      {/* Offers */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{t('offers')} ({request.offers?.length || 0})</h3>
          <button onClick={() => setShowOffer(!showOffer)} className="text-sm text-primary hover:underline">{t('make_offer')}</button>
        </div>

        {showOffer && (
          <form onSubmit={handleOffer} className="mb-4 p-3 border rounded space-y-2">
            <input value={totalPrice} onChange={e => setTotalPrice(e.target.value)} type="number" placeholder={t('total_price')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
            <input value={validityDays} onChange={e => setValidityDays(e.target.value)} type="number" placeholder={t('validity_days')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <textarea value={offerNotes} onChange={e => setOfferNotes(e.target.value)} placeholder={t('notes')} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
            <button type="submit" disabled={loading} className="text-sm text-primary hover:underline">{t('submit_offer')}</button>
          </form>
        )}

        <div className="space-y-2">
          {(request.offers || []).map((offer: any) => (
            <div key={offer.id} className="p-3 border rounded">
              <div className="flex items-center justify-between">
                <p className="font-medium">{offer.total_price} SAR</p>
                <span className="text-xs text-muted-foreground">{offer.offerer?.full_name || 'Anonymous'}</span>
              </div>
              {offer.notes && <p className="text-sm text-muted-foreground mt-1">{offer.notes}</p>}
              <p className="text-xs text-muted-foreground mt-1">{t('valid_until')}: {new Date(Date.now() + offer.validity_days * 86400000).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
