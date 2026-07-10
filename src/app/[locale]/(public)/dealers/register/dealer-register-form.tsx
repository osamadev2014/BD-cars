'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { registerDealer } from '@/lib/actions/dealer-actions'
import { Button } from '@/components/ui/button'

export function DealerRegisterForm({ cities, isLoggedIn }: { cities: any[]; isLoggedIn: boolean }) {
  const t = useTranslations('dealers')
  const router = useRouter()
  const [name, setName] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [phone, setPhone] = useState('')
  const [cityId, setCityId] = useState('')
  const [description, setDescription] = useState('')
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
    fd.set('name', name)
    fd.set('name_ar', nameAr)
    fd.set('phone', phone)
    fd.set('city_id', cityId)
    fd.set('description', description)
    const result = await registerDealer(fd)
    setLoading(false)
    if (result.success) { setDone(true); router.push('/dashboard/dealer') }
    else alert(result.error)
  }

  if (done) return <p className="text-green-600 text-center py-8">{t('register_success')}</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">{t('dealer_name')}</label>
        <input value={name} onChange={e => setName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" required />
      </div>
      <div>
        <label className="text-sm font-medium">{t('dealer_name_ar')}</label>
        <input value={nameAr} onChange={e => setNameAr(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">{t('phone')}</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" required />
      </div>
      <div>
        <label className="text-sm font-medium">{t('city')}</label>
        <select value={cityId} onChange={e => setCityId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
          <option value="">{t('select_city')}</option>
          {cities.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">{t('description')}</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none mt-1" />
      </div>
      <Button type="submit" disabled={loading}>{loading ? t('submitting') : t('register')}</Button>
    </form>
  )
}
