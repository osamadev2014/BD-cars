'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createAdCampaign } from '@/lib/actions/ad-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CreateCampaignFormProps {
  placements: Array<{
    id: string
    key: string
    name: string
    name_ar: string | null
  }>
}

export function CreateCampaignForm({ placements }: CreateCampaignFormProps) {
  const t = useTranslations('ads')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'banner',
    budget: '',
    daily_budget: '',
    placement_id: '',
    target_url: '',
    image_url: '',
    start_date: '',
    end_date: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.budget) return
    setLoading(true)
    try {
      await createAdCampaign({
        name: form.name,
        type: form.type,
        budget: parseFloat(form.budget),
        daily_budget: form.daily_budget ? parseFloat(form.daily_budget) : undefined,
        placement_id: form.placement_id || undefined,
        target_url: form.target_url || undefined,
        image_url: form.image_url || undefined,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
      })
      router.push('/dashboard/ads')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg bg-card p-6">
      <div>
        <label className="text-sm font-medium">{t('campaignName')}</label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          placeholder="e.g. Summer Sale Campaign"
        />
      </div>
      <div>
        <label className="text-sm font-medium">{t('campaignType')}</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="banner">{t('banner')}</option>
          <option value="sponsored">{t('sponsored')}</option>
          <option value="featured">{t('featuredListing')}</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">{t('totalBudget')}</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            required
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t('dailyBudget')}</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.daily_budget}
            onChange={(e) => setForm({ ...form, daily_budget: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">{t('placement')}</label>
        <select
          value={form.placement_id}
          onChange={(e) => setForm({ ...form, placement_id: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select placement</option>
          {placements.map((p) => (
            <option key={p.id} value={p.id}>{p.name || p.name_ar}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">{t('targetUrl')}</label>
        <Input
          type="url"
          value={form.target_url}
          onChange={(e) => setForm({ ...form, target_url: e.target.value })}
          placeholder="https://example.com"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Image URL</label>
        <Input
          type="url"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          placeholder="https://example.com/ad-image.jpg"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">{t('startDate')}</label>
          <Input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t('endDate')}</label>
          <Input
            type="date"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? t('loading') : t('createCampaign')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t('cancel')}
        </Button>
      </div>
    </form>
  )
}
