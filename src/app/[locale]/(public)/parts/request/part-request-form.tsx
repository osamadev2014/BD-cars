'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createPartRequest } from '@/lib/actions/part-request-actions'

export function PartRequestForm() {
  const t = useTranslations('parts')
  const router = useRouter()

  return (
    <form action={async (fd) => {
      const r = await createPartRequest(fd)
      if (r.success) router.push('/dashboard/part-requests')
      else alert(r.error)
    }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input name="make" placeholder={t('make')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <input name="model" placeholder={t('model')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <input name="year" type="number" placeholder={t('year')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <input name="trim" placeholder={t('trim')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <input name="part_name" placeholder={t('part_name')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
      <input name="part_number" placeholder={t('part_number')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      <textarea name="description" placeholder={t('description')} rows={3} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
      <div className="grid grid-cols-2 gap-4">
        <select name="urgency" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="low">{t('urgency_low')}</option>
          <option value="normal">{t('urgency_normal')}</option>
          <option value="high">{t('urgency_high')}</option>
          <option value="emergency">{t('urgency_emergency')}</option>
        </select>
        <select name="city_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">{t('select_city')}</option>
          <option value="riyadh">{t('riyadh')}</option>
          <option value="jeddah">{t('jeddah')}</option>
          <option value="dammam">{t('dammam')}</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input name="budget_min" type="number" step="0.01" placeholder={t('budget_min')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <input name="budget_max" type="number" step="0.01" placeholder={t('budget_max')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90">
        {t('submit_request')}
      </button>
    </form>
  )
}
