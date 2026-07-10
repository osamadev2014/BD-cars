'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createCommissionRule, toggleCommissionRule } from '@/lib/actions/finance-admin-actions'

export function CommissionClient({ rules }: { rules: any[] }) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('commission_rules')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">
          {showForm ? t('cancel') : t('add_rule')}
        </button>
      </div>

      {showForm && (
        <form action={async (fd) => {
          const r = await createCommissionRule(fd)
          if (r.success) { setShowForm(false); router.refresh() }
          else alert(r.error)
        }} className="border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="name" placeholder={t('rule_name')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
            <select name="rule_type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
              <option value="listing">{t('type_listing')}</option>
              <option value="sale">{t('type_sale')}</option>
              <option value="subscription">{t('type_subscription')}</option>
              <option value="inspection">{t('type_inspection')}</option>
            </select>
          </div>
          <textarea name="description" placeholder={t('description')} rows={2} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <input name="percentage" type="number" step="0.01" placeholder={t('commission_percentage')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input name="fixed_amount" type="number" step="0.01" placeholder={t('fixed_amount')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="min_amount" type="number" step="0.01" placeholder={t('min_amount')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input name="max_amount" type="number" step="0.01" placeholder={t('max_amount')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <select name="applies_to" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="both">{t('both')}</option>
              <option value="seller">{t('seller')}</option>
              <option value="buyer">{t('buyer')}</option>
            </select>
            <input name="priority" type="number" defaultValue="0" placeholder={t('priority')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_active" value="true" defaultChecked /> {t('active')}
            </label>
          </div>
          <button type="submit" className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">{t('save')}</button>
        </form>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">{t('rule_name')}</th>
              <th className="text-left p-3">{t('type')}</th>
              <th className="text-left p-3">{t('commission')}</th>
              <th className="text-left p-3">{t('min_max')}</th>
              <th className="text-left p-3">{t('applies_to')}</th>
              <th className="text-left p-3">{t('priority')}</th>
              <th className="text-left p-3">{t('status')}</th>
              <th className="text-left p-3">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-xs">{r.rule_type}</td>
                <td className="p-3 text-xs">{r.percentage ? `${r.percentage}%` : ''}{r.fixed_amount ? `${r.fixed_amount} SAR` : ''}</td>
                <td className="p-3 text-xs">{r.min_amount ? `${r.min_amount} - ` : ''}{r.max_amount ? `${r.max_amount} SAR` : '∞'}</td>
                <td className="p-3 text-xs">{r.applies_to}</td>
                <td className="p-3 text-xs">{r.priority}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${r.is_active ? 'text-green-600 bg-green-50' : 'text-muted-foreground bg-muted'}`}>
                    {r.is_active ? t('active') : t('inactive')}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={async () => { await toggleCommissionRule(r.id, !r.is_active); router.refresh() }} className="text-xs text-primary hover:underline">
                    {r.is_active ? t('deactivate') : t('activate')}
                  </button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
