'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { upsertPartSupplier } from '@/lib/actions/part-request-actions'

export function AdminSparePartsClient({ requests, suppliers }: { requests: any[]; suppliers: any[] }) {
  const t = useTranslations('admin')
  const tr = useTranslations('parts')
  const router = useRouter()
  const [tab, setTab] = useState<'requests' | 'suppliers'>('requests')
  const [statusFilter, setStatusFilter] = useState('')
  const [showSupplierForm, setShowSupplierForm] = useState(false)

  const filtered = statusFilter ? requests.filter((r: any) => r.status === statusFilter) : requests

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('spare_parts')}</h1>

      <div className="flex gap-2 border-b">
        <button onClick={() => setTab('requests')} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>{t('requests')}</button>
        <button onClick={() => setTab('suppliers')} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'suppliers' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>{t('suppliers')}</button>
      </div>

      {tab === 'requests' && (
        <>
          <div className="flex gap-2">
            {['', 'submitted', 'under_review', 'sent_to_suppliers', 'quotes_received', 'order_created', 'fulfilled', 'cancelled'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs px-2 py-1 rounded ${statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {s || t('all')}
              </button>
            ))}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3">{tr('part_name')}</th>
                  <th className="text-left p-3">{tr('customer')}</th>
                  <th className="text-left p-3">{tr('vehicle')}</th>
                  <th className="text-left p-3">{t('status')}</th>
                  <th className="text-left p-3">{t('date')}</th>
                  <th className="text-left p-3">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: any) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3 font-medium">{r.part_name}</td>
                    <td className="p-3 text-xs">{r.profiles?.full_name || '—'}</td>
                    <td className="p-3 text-xs">{r.make} {r.model} {r.year}</td>
                    <td className="p-3"><span className="text-xs px-2 py-0.5 rounded bg-muted">{r.status}</span></td>
                    <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="p-3"><Link href={`/admin/spare-parts/${r.id}`} className="text-xs text-primary hover:underline">{t('view')}</Link></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'suppliers' && (
        <>
          <div className="flex justify-end">
            <button onClick={() => setShowSupplierForm(!showSupplierForm)} className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">
              {showSupplierForm ? t('cancel') : t('add_supplier')}
            </button>
          </div>

          {showSupplierForm && (
            <form action={async (fd) => {
              const r = await upsertPartSupplier(fd)
              if (r.success) { setShowSupplierForm(false); router.refresh() }
              else alert(r.error)
            }} className="border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input name="name" placeholder={t('supplier_name')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
                <input name="name_ar" placeholder={t('supplier_name_ar')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="phone" placeholder={t('phone')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                <input name="email" type="email" placeholder={t('email')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <textarea name="description" placeholder={t('description')} rows={2} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
                <textarea name="description_ar" placeholder={t('description_ar')} rows={2} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_active" value="true" defaultChecked /> {t('active')}
              </div>
              <button type="submit" className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">{t('save')}</button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suppliers.map((s: any) => (
              <div key={s.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{s.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${s.is_active ? 'text-green-600 bg-green-50' : 'text-muted-foreground bg-muted'}`}>{s.is_active ? t('active') : t('inactive')}</span>
                </div>
                <p className="text-xs text-muted-foreground">{s.phone || '—'} {s.email ? `• ${s.email}` : ''}</p>
              </div>
            ))}
            {suppliers.length === 0 && <p className="col-span-full text-center text-muted-foreground">{t('no_entries')}</p>}
          </div>
        </>
      )}
    </div>
  )
}
