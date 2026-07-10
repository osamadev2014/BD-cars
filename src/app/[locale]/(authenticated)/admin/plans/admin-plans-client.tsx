'use client'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { upsertPlan, togglePlan } from '@/lib/actions/dealer-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

interface Plan {
  id: string
  name: string
  name_ar: string | null
  slug: string
  description: string | null
  price_monthly: number
  price_yearly: number | null
  max_listings: number | null
  max_staff: number | null
  max_branches: number | null
  has_analytics: boolean
  has_wholesale: boolean
  has_auctions: boolean
  has_parts: boolean
  has_delivery: boolean
  has_featured: boolean
  has_api: boolean
  is_active: boolean
}

const EMPTY_FORM: Partial<Plan> = {
  name: '',
  name_ar: '',
  slug: '',
  description: '',
  price_monthly: 0,
  price_yearly: 0,
  max_listings: 0,
  max_staff: 0,
  max_branches: 0,
  has_analytics: false,
  has_wholesale: false,
  has_auctions: false,
  has_parts: false,
  has_delivery: false,
  has_featured: false,
  has_api: false,
  is_active: true,
}

const FEATURE_KEYS = [
  { key: 'has_analytics', label_key: 'analytics' },
  { key: 'has_wholesale', label_key: 'wholesale' },
  { key: 'has_auctions', label_key: 'auctions' },
  { key: 'has_parts', label_key: 'parts_access' },
  { key: 'has_delivery', label_key: 'delivery' },
  { key: 'has_featured', label_key: 'featured' },
  { key: 'has_api', label_key: 'api_access' },
] as const

export function AdminPlansClient({ plans: initialPlans }: { plans: Plan[] }) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [plans, setPlans] = useState(initialPlans)
  const [editing, setEditing] = useState<Plan | null>(null)
  const [form, setForm] = useState<Partial<Plan>>(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)

  const handleToggle = async (id: string) => {
    const result = await togglePlan(id)
    if (result.success) {
      setPlans(plans.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p))
    }
  }

  const handleEdit = (plan: Plan) => {
    setForm({ ...plan })
    setEditing(plan)
    setShowForm(true)
  }

  const handleNew = () => {
    setForm({ ...EMPTY_FORM })
    setEditing(null)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    if (editing) fd.set('id', editing.id)
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        if (value) fd.set(key, 'on')
      } else if (value !== null && value !== undefined) {
        fd.set(key, String(value))
      }
    })
    const result = await upsertPlan(fd)
    if (result.success) {
      setShowForm(false)
      setEditing(null)
      router.refresh()
    }
  }

  const displayVal = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '-'
    if (val === -1) return t('unlimited')
    return val.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('plans')}</h1>
        <Button onClick={handleNew}>{t('add_plan')}</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-6 space-y-6 bg-card">
          <h2 className="text-lg font-semibold">
            {editing ? t('edit_plan') : t('add_plan')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('name')}</Label>
              <Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>{t('name_ar')}</Label>
              <Input value={form.name_ar || ''} onChange={e => setForm({ ...form, name_ar: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('slug')}</Label>
              <Input value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>{t('description')}</Label>
              <Input value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('price_monthly')}</Label>
              <Input type="number" min="0" step="0.01"
                value={form.price_monthly ?? 0}
                onChange={e => setForm({ ...form, price_monthly: parseFloat(e.target.value) || 0 })} required />
            </div>
            <div className="space-y-2">
              <Label>{t('price_yearly')}</Label>
              <Input type="number" min="0" step="0.01"
                value={form.price_yearly ?? ''}
                onChange={e => setForm({ ...form, price_yearly: e.target.value ? parseFloat(e.target.value) : null })} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch checked={form.is_active ?? true} onCheckedChange={(c: boolean) => setForm({ ...form, is_active: c })} />
                <span className="text-sm">{t('active')}</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('max_listings')}</Label>
              <Input type="number" min="-1"
                value={form.max_listings ?? ''}
                onChange={e => setForm({ ...form, max_listings: e.target.value ? parseInt(e.target.value) : null })} />
              <p className="text-xs text-muted-foreground">-1 = {t('unlimited')}</p>
            </div>
            <div className="space-y-2">
              <Label>{t('max_staff')}</Label>
              <Input type="number" min="-1"
                value={form.max_staff ?? ''}
                onChange={e => setForm({ ...form, max_staff: e.target.value ? parseInt(e.target.value) : null })} />
              <p className="text-xs text-muted-foreground">-1 = {t('unlimited')}</p>
            </div>
            <div className="space-y-2">
              <Label>{t('max_branches')}</Label>
              <Input type="number" min="-1"
                value={form.max_branches ?? ''}
                onChange={e => setForm({ ...form, max_branches: e.target.value ? parseInt(e.target.value) : null })} />
              <p className="text-xs text-muted-foreground">-1 = {t('unlimited')}</p>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">{t('features')}</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FEATURE_KEYS.map(fk => (
                <label key={fk.key} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox
                    checked={!!(form as any)[fk.key]}
                    onCheckedChange={(c: boolean) => setForm({ ...form, [fk.key]: c })}
                  />
                  {t(fk.label_key)}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit">{t('save')}</Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null) }}>
              {t('cancel')}
            </Button>
          </div>
        </form>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">{t('name')}</th>
              <th className="text-left p-3">{t('slug')}</th>
              <th className="text-right p-3">{t('price_monthly')}</th>
              <th className="text-center p-3">{t('max_listings')}</th>
              <th className="text-center p-3">{t('max_staff')}</th>
              <th className="text-center p-3">{t('features')}</th>
              <th className="text-center p-3">{t('status')}</th>
              <th className="text-center p-3">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id} className="border-t hover:bg-accent/50">
                <td className="p-3">
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-xs text-muted-foreground">{plan.name_ar}</div>
                </td>
                <td className="p-3 text-muted-foreground">{plan.slug}</td>
                <td className="p-3 text-right">
                  {plan.price_monthly === 0 ? t('free') : `${plan.price_monthly} ${t('sar_month')}`}
                </td>
                <td className="p-3 text-center">{displayVal(plan.max_listings)}</td>
                <td className="p-3 text-center">{displayVal(plan.max_staff)}</td>
                <td className="p-3 text-center">
                  <span className="inline-flex gap-1 flex-wrap justify-center">
                    {FEATURE_KEYS.filter(fk => (plan as any)[fk.key]).map(fk => (
                      <span key={fk.key} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs">
                        {t(fk.label_key)}
                      </span>
                    ))}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${plan.is_active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                    {plan.is_active ? t('active') : t('inactive')}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(plan)}>
                      {t('edit')}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleToggle(plan.id)}>
                      {plan.is_active ? t('deactivate') : t('activate')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
