'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createVehicleRequest } from '@/lib/actions/request-actions'
import { Button } from '@/components/ui/button'

export function RequestForm({ makes, bodyTypes, isLoggedIn }: { makes: any[]; bodyTypes: any[]; isLoggedIn: boolean }) {
  const t = useTranslations('vehicle_requests')
  const router = useRouter()
  const [makeId, setMakeId] = useState('')
  const [modelName, setModelName] = useState('')
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [bodyTypeId, setBodyTypeId] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{t('login_required')}</p>
        <Button onClick={() => router.push('/login')}>{t('login')}</Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const fd = new FormData()
    fd.set('make_id', makeId)
    fd.set('model_name', modelName)
    if (yearFrom) fd.set('year_from', yearFrom)
    if (yearTo) fd.set('year_to', yearTo)
    if (budgetMin) fd.set('budget_min', budgetMin)
    if (budgetMax) fd.set('budget_max', budgetMax)
    fd.set('body_type_id', bodyTypeId)
    fd.set('notes', notes)

    const result = await createVehicleRequest(fd)
    setLoading(false)
    if (result.success) {
      setDone(true)
      router.push('/dashboard/vehicle-requests')
    } else {
      alert(result.error)
    }
  }

  if (done) {
    return <p className="text-center text-green-600 py-8">{t('request_created')}</p>
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">{t('make')}</label>
          <select value={makeId} onChange={e => setMakeId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
            <option value="">{t('any')}</option>
            {makes.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">{t('model')}</label>
          <input value={modelName} onChange={e => setModelName(e.target.value)} placeholder={t('model_placeholder')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">{t('year_from')}</label>
          <select value={yearFrom} onChange={e => setYearFrom(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
            <option value="">{t('any')}</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">{t('year_to')}</label>
          <select value={yearTo} onChange={e => setYearTo(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
            <option value="">{t('any')}</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">{t('budget_min')}</label>
          <input type="number" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} placeholder="SAR" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">{t('budget_max')}</label>
          <input type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} placeholder="SAR" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">{t('body_type')}</label>
        <select value={bodyTypeId} onChange={e => setBodyTypeId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
          <option value="">{t('any')}</option>
          {bodyTypes.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">{t('notes')}</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('notes_placeholder')} className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none mt-1" />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? t('sending') : t('submit_request')}
      </Button>
    </form>
  )
}
