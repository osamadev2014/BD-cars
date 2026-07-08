'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { getPartCategories, getPartBrands, createPart } from '@/lib/actions/part-actions'

export default function NewPartPage() {
  const t = useTranslations('parts')
  const router = useRouter()
  const { user } = useAuth()
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    title_ar: '',
    category_id: '',
    brand_id: '',
    part_number: '',
    oem_number: '',
    description: '',
    description_ar: '',
    condition: 'new',
    part_type: 'original',
    price: '',
    stock_quantity: '1',
    warranty_months: '',
    return_days: '',
  })

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    Promise.all([getPartCategories(), getPartBrands()]).then(([cats, brds]) => {
      setCategories(cats)
      setBrands(brds)
    })
  }, [user, router])

  if (!user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.title || !form.category_id || !form.price) {
      setError(t('required_fields'))
      return
    }
    setSaving(true)
    const result = await createPart({
      title: form.title,
      title_ar: form.title_ar || undefined,
      category_id: form.category_id,
      brand_id: form.brand_id || undefined,
      part_number: form.part_number || undefined,
      oem_number: form.oem_number || undefined,
      description: form.description || undefined,
      description_ar: form.description_ar || undefined,
      condition: form.condition,
      part_type: form.part_type,
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
      warranty_months: form.warranty_months ? Number(form.warranty_months) : undefined,
      return_days: form.return_days ? Number(form.return_days) : undefined,
    })
    setSaving(false)
    if (result.success) {
      router.push(`/parts/${(result as any).data?.slug}`)
    } else {
      setError(result.error || t('save_error'))
    }
  }

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{t('new_part')}</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('title')} *</label>
            <input value={form.title} onChange={(e) => update('title', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('title_ar')}</label>
            <input value={form.title_ar} onChange={(e) => update('title_ar', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('category')} *</label>
            <select value={form.category_id} onChange={(e) => update('category_id', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" required>
              <option value="">{t('select_category')}</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('brand')}</label>
            <select value={form.brand_id} onChange={(e) => update('brand_id', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="">{t('select_brand')}</option>
              {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('part_number')}</label>
            <input value={form.part_number} onChange={(e) => update('part_number', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('oem_number')}</label>
            <input value={form.oem_number} onChange={(e) => update('oem_number', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('description')}</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('description_ar')}</label>
          <textarea value={form.description_ar} onChange={(e) => update('description_ar', e.target.value)} rows={3} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('condition')} *</label>
            <select value={form.condition} onChange={(e) => update('condition', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="new">{t('new')}</option>
              <option value="used">{t('used')}</option>
              <option value="refurbished">{t('refurbished')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('part_type')}</label>
            <select value={form.part_type} onChange={(e) => update('part_type', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="original">{t('original')}</option>
              <option value="aftermarket">{t('aftermarket')}</option>
              <option value="oem">{t('oem')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('price')} (SAR) *</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('stock_quantity')}</label>
            <input type="number" min="0" value={form.stock_quantity} onChange={(e) => update('stock_quantity', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('warranty_months')}</label>
            <input type="number" min="0" value={form.warranty_months} onChange={(e) => update('warranty_months', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('return_days')}</label>
            <input type="number" min="0" value={form.return_days} onChange={(e) => update('return_days', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? '...' : t('save_part')}
        </button>
      </form>
    </>
  )
}
