'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createCoupon, toggleCoupon, updateCoupon, deleteCoupon } from '@/lib/actions/finance-admin-actions'

export function CouponsClient({ coupons }: { coupons: any[] }) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const editCoupon = editingId ? coupons.find((c) => c.id === editingId) : null

  const now = new Date()
  const defaultStart = now.toISOString().slice(0, 16)
  const defaultEnd = new Date(now.getTime() + 30 * 86400000).toISOString().slice(0, 16)

  const handleDelete = async (id: string) => {
    const r = await deleteCoupon(id)
    if (r.success) { setDeletingId(null); router.refresh() }
    else alert(r.error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('coupons')}</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null) }} className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">
          {showForm ? t('cancel') : t('add_coupon')}
        </button>
      </div>

      {showForm && (
        <form action={async (fd) => {
          const r = editingId ? await updateCoupon(editingId, fd) : await createCoupon(fd)
          if (r.success) { setShowForm(false); setEditingId(null); router.refresh() }
          else alert(r.error)
        }} className="border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="code" defaultValue={editCoupon?.code || ''} placeholder={t('coupon_code')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm uppercase" required />
            <select name="discount_type" defaultValue={editCoupon?.discount_type || 'percentage'} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
              <option value="percentage">{t('percentage')}</option>
              <option value="fixed">{t('fixed_amount')}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="discount_value" type="number" step="0.01" defaultValue={editCoupon?.discount_value || ''} placeholder={t('discount_value')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
            <input name="min_order_amount" type="number" step="0.01" defaultValue={editCoupon?.min_order_amount || ''} placeholder={t('min_order')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <textarea name="description" defaultValue={editCoupon?.description || ''} placeholder={t('description')} rows={2} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
          <div className="grid grid-cols-3 gap-3">
            <input name="max_uses" type="number" defaultValue={editCoupon?.max_uses || ''} placeholder={t('max_uses')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input name="max_uses_per_user" type="number" defaultValue={editCoupon?.max_uses_per_user || '1'} placeholder={t('per_user')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_active" value="true" defaultChecked={editCoupon ? editCoupon.is_active : true} /> {t('active')}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-muted-foreground">{t('start_date')}</label><input name="starts_at" type="datetime-local" defaultValue={editCoupon?.starts_at ? editCoupon.starts_at.slice(0, 16) : defaultStart} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" /></div>
            <div><label className="text-xs text-muted-foreground">{t('end_date')}</label><input name="expires_at" type="datetime-local" defaultValue={editCoupon?.expires_at ? editCoupon.expires_at.slice(0, 16) : defaultEnd} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" /></div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">{editingId ? t('save') : t('add_coupon')}</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setShowForm(false) }} className="text-sm text-muted-foreground px-3 py-1.5">{t('cancel')}</button>
            )}
          </div>
        </form>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">{t('code')}</th>
              <th className="text-left p-3">{t('discount')}</th>
              <th className="text-left p-3">{t('usage')}</th>
              <th className="text-left p-3">{t('validity')}</th>
              <th className="text-left p-3">{t('status')}</th>
              <th className="text-left p-3">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-mono font-bold">{c.code}</td>
                <td className="p-3">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `${c.discount_value} SAR`}</td>
                <td className="p-3 text-xs">{c.used_count}/{c.max_uses || '∞'}</td>
                <td className="p-3 text-xs">
                  {c.starts_at && <div>{t('from')}: {new Date(c.starts_at).toLocaleDateString()}</div>}
                  {c.expires_at && <div>{t('to')}: {new Date(c.expires_at).toLocaleDateString()}</div>}
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${c.is_active ? 'text-green-600 bg-green-50' : 'text-muted-foreground bg-muted'}`}>
                    {c.is_active ? t('active') : t('inactive')}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button onClick={async () => { await toggleCoupon(c.id, !c.is_active); router.refresh() }} className="text-xs text-primary hover:underline">
                    {c.is_active ? t('deactivate') : t('activate')}
                  </button>
                  <button onClick={() => { setEditingId(c.id); setShowForm(true) }} className="text-xs text-primary hover:underline">
                    {t('edit')}
                  </button>
                  <button onClick={() => setDeletingId(c.id)} className="text-xs text-destructive hover:underline">
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>}
          </tbody>
        </table>
      </div>

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeletingId(null)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">{t('delete_coupon_confirm')}</h3>
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={() => setDeletingId(null)} className="text-sm px-3 py-1.5 border rounded-md">{t('cancel')}</button>
              <button onClick={() => handleDelete(deletingId)} className="text-sm bg-destructive text-destructive-foreground px-3 py-1.5 rounded-md">{t('delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
