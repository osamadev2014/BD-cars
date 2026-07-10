'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { updatePartQuoteStatus } from '@/lib/actions/part-request-actions'

export function PartRequestDetailClient({ request }: { request: any }) {
  const t = useTranslations('parts')
  const router = useRouter()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{request.part_name}</h1>

      <div className="grid grid-cols-2 gap-4 text-sm border rounded-lg p-4">
        <div><span className="text-muted-foreground">{t('make')}:</span> {request.make || '—'}</div>
        <div><span className="text-muted-foreground">{t('model')}:</span> {request.model || '—'}</div>
        <div><span className="text-muted-foreground">{t('year')}:</span> {request.year || '—'}</div>
        <div><span className="text-muted-foreground">{t('status')}:</span> {request.status}</div>
        {request.description && <div className="col-span-2"><span className="text-muted-foreground">{t('description')}:</span> {request.description}</div>}
        {request.budget_min && <div><span className="text-muted-foreground">{t('budget')}:</span> {request.budget_min} - {request.budget_max} SAR</div>}
        <div><span className="text-muted-foreground">{t('urgency')}:</span> {request.urgency}</div>
      </div>

      <h2 className="font-semibold">{t('quotes')} ({request.spare_part_quotes?.length || 0})</h2>
      {(!request.spare_part_quotes || request.spare_part_quotes.length === 0) && (
        <p className="text-sm text-muted-foreground">{t('no_quotes')}</p>
      )}
      {request.spare_part_quotes?.map((q: any) => (
        <div key={q.id} className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">{q.spare_part_suppliers?.name || t('supplier')}</p>
            <span className={`text-xs px-2 py-0.5 rounded ${
              q.status === 'sent' ? 'text-blue-600 bg-blue-50' :
              q.status === 'accepted' ? 'text-green-600 bg-green-50' :
              q.status === 'rejected' ? 'text-red-600 bg-red-50' :
              'text-muted-foreground bg-muted'
            }`}>{q.status}</span>
          </div>
          <div className="grid grid-cols-2 text-sm">
            <div>{t('price')}: {q.price} SAR</div>
            <div>{t('delivery_fee')}: {q.delivery_fee || 0} SAR</div>
            <div>{t('total')}: {q.total_price} SAR</div>
            {q.estimated_delivery_days && <div>{t('estimated_delivery')}: {q.estimated_delivery_days} {t('days')}</div>}
            {q.warranty_months && <div>{t('warranty')}: {q.warranty_months} {t('months')}</div>}
          </div>
          {q.notes && <p className="text-xs text-muted-foreground">{q.notes}</p>}
          {q.status === 'sent' && (
            <div className="flex gap-2 pt-2">
              <button onClick={async () => { await updatePartQuoteStatus(q.id, 'accepted'); router.refresh() }} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">{t('accept_quote')}</button>
              <button onClick={async () => { await updatePartQuoteStatus(q.id, 'rejected'); router.refresh() }} className="text-xs border border-input px-3 py-1.5 rounded-md hover:bg-accent">{t('reject_quote')}</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
