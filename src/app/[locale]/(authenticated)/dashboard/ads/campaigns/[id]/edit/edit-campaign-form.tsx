'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { getAdCampaignById, updateAdCampaign, getAdPlacements } from '@/lib/actions/ad-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function EditCampaignForm() {
  const t = useTranslations('ads')
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [placements, setPlacements] = useState<any[]>([])
  const [form, setForm] = useState({
    name: '',
    type: 'banner',
    status: 'draft',
    budget: '',
    daily_budget: '',
    placement_id: '',
    target_url: '',
    image_url: '',
    start_date: '',
    end_date: '',
  })

  useEffect(() => {
    if (!id) return
    Promise.all([
      getAdCampaignById(id),
      getAdPlacements(),
    ]).then(([campaign, pl]) => {
      setForm({
        name: campaign.name || '',
        type: campaign.type || 'banner',
        status: campaign.status || 'draft',
        budget: campaign.budget?.toString() || '',
        daily_budget: campaign.daily_budget?.toString() || '',
        placement_id: campaign.placement_id || '',
        target_url: campaign.target_url || '',
        image_url: campaign.image_url || '',
        start_date: campaign.start_date ? campaign.start_date.slice(0, 10) : '',
        end_date: campaign.end_date ? campaign.end_date.slice(0, 10) : '',
      })
      setPlacements(pl)
      setFetching(false)
    }).catch(() => setFetching(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.budget) return
    setLoading(true)
    try {
      await updateAdCampaign(id, {
        name: form.name,
        type: form.type,
        status: form.status,
        budget: parseFloat(form.budget),
        daily_budget: form.daily_budget ? parseFloat(form.daily_budget) : undefined,
        placement_id: form.placement_id || undefined,
        target_url: form.target_url || undefined,
        image_url: form.image_url || undefined,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
      })
      router.push(`/dashboard/ads/campaigns/${id}`)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="h-64 bg-muted rounded-lg animate-pulse" />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg bg-card p-6">
      <div>
        <label className="text-sm font-medium">{t('campaignName')}</label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
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
      <div>
        <label className="text-sm font-medium">{t('status')}</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="draft">{t('draft')}</option>
          <option value="active">{t('active')}</option>
          <option value="paused">{t('paused')}</option>
          <option value="ended">{t('ended')}</option>
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
          {placements.map((p: any) => (
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
        />
      </div>
      <div>
        <label className="text-sm font-medium">Image URL</label>
        <Input
          type="url"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
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
          {loading ? t('loading') : t('editCampaign')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t('cancel')}
        </Button>
      </div>
    </form>
  )
}
