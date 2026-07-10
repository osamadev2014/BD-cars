'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { updateFinanceRequestStatus, upsertFinancePartner } from '@/lib/actions/finance-actions'

export function AdminFinanceClient({ requests, partners }: { requests: any[]; partners: any[] }) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [tab, setTab] = useState<'requests' | 'partners'>('requests')
  const [statusFilter, setStatusFilter] = useState('')
  const [showPartnerForm, setShowPartnerForm] = useState(false)

  const filtered = statusFilter ? requests.filter((r: any) => r.status === statusFilter) : requests

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('finance')}</h1>

      <div className="flex gap-2 border-b">
        <button onClick={() => setTab('requests')} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>{t('requests')}</button>
        <button onClick={() => setTab('partners')} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'partners' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>{t('partners')}</button>
      </div>

      {tab === 'requests' && (
        <>
          <div className="flex gap-2 flex-wrap">
            {['', 'pending', 'under_review', 'approved', 'rejected', 'cancelled'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs px-2 py-1 rounded ${statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {s || t('all')}
              </button>
            ))}
          </div>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3">{t('customer')}</th>
                  <th className="text-left p-3">{t('partner')}</th>
                  <th className="text-left p-3">{t('amount')}</th>
                  <th className="text-left p-3">{t('status')}</th>
                  <th className="text-left p-3">{t('date')}</th>
                  <th className="text-left p-3">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: any) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">{r.profiles?.full_name || '—'}</td>
                    <td className="p-3 text-xs">{r.partner?.name || '—'}</td>
                    <td className="p-3">{r.requested_amount ? `${r.requested_amount} SAR` : '—'}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded ${r.status === 'approved' ? 'text-green-600 bg-green-50' : r.status === 'rejected' ? 'text-red-600 bg-red-50' : r.status === 'under_review' ? 'text-blue-600 bg-blue-50' : 'text-yellow-600 bg-yellow-50'}`}>{r.status}</span></td>
                    <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="p-3 flex gap-1">
                      {r.status === 'pending' && (
                        <>
                          <button onClick={async () => { await updateFinanceRequestStatus(r.id, 'under_review'); router.refresh() }} className="text-xs text-blue-600 hover:underline">{t('review')}</button>
                          <button onClick={async () => { await updateFinanceRequestStatus(r.id, 'approved'); router.refresh() }} className="text-xs text-green-600 hover:underline">{t('approve')}</button>
                          <button onClick={() => {
                            const notes = prompt(t('rejection_reason'))
                            if (notes !== null) updateFinanceRequestStatus(r.id, 'rejected', notes).then(() => router.refresh())
                          }} className="text-xs text-red-600 hover:underline">{t('reject')}</button>
                        </>
                      )}
                      {r.status === 'under_review' && (
                        <>
                          <button onClick={async () => { await updateFinanceRequestStatus(r.id, 'approved'); router.refresh() }} className="text-xs text-green-600 hover:underline">{t('approve')}</button>
                          <button onClick={() => {
                            const notes = prompt(t('rejection_reason'))
                            if (notes !== null) updateFinanceRequestStatus(r.id, 'rejected', notes).then(() => router.refresh())
                          }} className="text-xs text-red-600 hover:underline">{t('reject')}</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'partners' && (
        <>
          <div className="flex justify-end">
            <button onClick={() => setShowPartnerForm(!showPartnerForm)} className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">
              {showPartnerForm ? t('cancel') : t('add_partner')}
            </button>
          </div>
          {showPartnerForm && (
            <form action={async (fd) => {
              const r = await upsertFinancePartner(fd)
              if (r.success) { setShowPartnerForm(false); router.refresh() }
              else alert(r.error)
            }} className="border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input name="name" placeholder={t('partner_name')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
                <input name="name_ar" placeholder={t('partner_name_ar')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <textarea name="description" placeholder={t('description')} rows={2} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
                <textarea name="description_ar" placeholder={t('description_ar')} rows={2} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <select name="revenue_model" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="per_lead">{t('per_lead')}</option>
                  <option value="percentage">{t('percentage')}</option>
                  <option value="per_approved">{t('per_approved')}</option>
                  <option value="subscription">{t('subscription')}</option>
                </select>
                <input name="revenue_per_lead" type="number" step="0.01" placeholder={t('per_lead_amount')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                <input name="revenue_percentage" type="number" step="0.01" placeholder={t('revenue_percentage')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_active" value="true" defaultChecked /> {t('active')}
              </div>
              <button type="submit" className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">{t('save')}</button>
            </form>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partners.map((p: any) => (
              <div key={p.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{p.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${p.is_active ? 'text-green-600 bg-green-50' : 'text-muted-foreground bg-muted'}`}>{p.is_active ? t('active') : t('inactive')}</span>
                </div>
                <p className="text-xs text-muted-foreground">{p.revenue_model} {p.revenue_per_lead ? `• ${p.revenue_per_lead} SAR/lead` : ''}</p>
              </div>
            ))}
            {partners.length === 0 && <p className="col-span-full text-center text-muted-foreground">{t('no_entries')}</p>}
          </div>
        </>
      )}
    </div>
  )
}
