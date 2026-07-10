'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createPartQuote } from '@/lib/actions/part-request-actions'

export function AdminPartRequestDetailClient({ request, suppliers }: { request: any; suppliers: any[] }) {
  const t = useTranslations('admin')
  const tr = useTranslations('parts')
  const router = useRouter()
  const [showQuoteForm, setShowQuoteForm] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{request.part_name}</h1>

      <div className="grid grid-cols-2 gap-4 text-sm border rounded-lg p-4">
        <div><span className="text-muted-foreground">{tr('customer')}:</span> {request.profiles?.full_name || '—'}</div>
        <div><span className="text-muted-foreground">{tr('phone')}:</span> {request.profiles?.phone || '—'}</div>
        <div><span className="text-muted-foreground">{tr('make')}:</span> {request.make || '—'}</div>
        <div><span className="text-muted-foreground">{tr('model')}:</span> {request.model || '—'}</div>
        <div><span className="text-muted-foreground">{tr('year')}:</span> {request.year || '—'}</div>
        <div><span className="text-muted-foreground">{tr('status')}:</span> {request.status}</div>
        {request.part_number && <div><span className="text-muted-foreground">{tr('part_number')}:</span> {request.part_number}</div>}
        {request.description && <div className="col-span-2"><span className="text-muted-foreground">{tr('description')}:</span> {request.description}</div>}
        {request.budget_min && <div><span className="text-muted-foreground">{tr('budget')}:</span> {request.budget_min} - {request.budget_max} SAR</div>}
        <div><span className="text-muted-foreground">{tr('urgency')}:</span> {request.urgency}</div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowQuoteForm(!showQuoteForm)} className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">
          {showQuoteForm ? t('cancel') : t('add_quote')}
        </button>
      </div>

      {showQuoteForm && (
        <form action={async (fd) => {
          fd.set('request_id', request.id)
          const r = await createPartQuote(fd)
          if (r.success) { setShowQuoteForm(false); router.refresh() }
          else alert(r.error)
        }} className="border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select name="supplier_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">{t('select_supplier')}</option>
              {suppliers.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input name="availability" placeholder={t('availability')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="price" type="number" step="0.01" placeholder={t('price')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
            <input name="delivery_fee" type="number" step="0.01" placeholder={t('delivery_fee')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input name="estimated_delivery_days" type="number" placeholder={t('est_delivery_days')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input name="warranty_months" type="number" placeholder={t('warranty_months')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input name="valid_until" type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <textarea name="notes" placeholder={t('quote_notes')} rows={2} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
          <button type="submit" className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">{t('save')}</button>
        </form>
      )}

      <h2 className="font-semibold">{tr('quotes')} ({request.spare_part_quotes?.length || 0})</h2>
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
          <div className="grid grid-cols-3 text-xs gap-2">
            <div>{tr('price')}: <strong>{q.price} SAR</strong></div>
            <div>{tr('delivery_fee')}: {q.delivery_fee || 0} SAR</div>
            <div>{tr('total')}: <strong>{q.total_price} SAR</strong></div>
            {q.estimated_delivery_days && <div>{tr('est_delivery')}: {q.estimated_delivery_days} {tr('days')}</div>}
            {q.warranty_months && <div>{tr('warranty')}: {q.warranty_months} {tr('months')}</div>}
            {q.availability && <div>{tr('availability')}: {q.availability}</div>}
          </div>
          {q.notes && <p className="text-xs text-muted-foreground">{q.notes}</p>}
        </div>
      ))}
    </div>
  )
}
