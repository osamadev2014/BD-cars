'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { getAdCampaigns, getAdvertiserDashboard, adminCreateAdvertiser } from '@/lib/actions/ad-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  active: 'success',
  paused: 'warning',
  draft: 'secondary',
  ended: 'destructive',
}

export function AdminAdsClient() {
  const t = useTranslations('ads')
  const loc = useLocale()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewAdvertiser, setShowNewAdvertiser] = useState(false)
  const [newAdv, setNewAdv] = useState({ name: '', name_ar: '', contact_email: '', contact_phone: '' })
  const [creating, setCreating] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [result, dash] = await Promise.all([
        getAdCampaigns({ page, perPage: 20, status: statusFilter }),
        getAdvertiserDashboard(),
      ])
      setCampaigns(result.data)
      setTotalPages(result.totalPages)
      setDashboard(dash)
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => { loadData() }, [loadData])

  const handleCreateAdvertiser = async () => {
    if (!newAdv.name) return
    setCreating(true)
    try {
      await adminCreateAdvertiser(newAdv)
      setShowNewAdvertiser(false)
      setNewAdv({ name: '', name_ar: '', contact_email: '', contact_phone: '' })
    } catch (err: any) {
      alert(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {dashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="border rounded-lg p-4 bg-card">
            <p className="text-sm text-muted-foreground">{t('campaigns')}</p>
            <p className="text-2xl font-bold mt-1">{dashboard.totalCampaigns}</p>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <p className="text-sm text-muted-foreground">{t('impressions')}</p>
            <p className="text-2xl font-bold mt-1">{dashboard.totalImpressions.toLocaleString()}</p>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <p className="text-sm text-muted-foreground">{t('clicks')}</p>
            <p className="text-2xl font-bold mt-1">{dashboard.totalClicks.toLocaleString()}</p>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <p className="text-sm text-muted-foreground">{t('ctr')}</p>
            <p className="text-2xl font-bold mt-1">{dashboard.ctr}%</p>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <p className="text-sm text-muted-foreground">{t('spend')}</p>
            <p className="text-2xl font-bold mt-1">{dashboard.totalSpend.toLocaleString()} SAR</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">{t('allCampaigns')}</option>
            <option value="active">{t('active')}</option>
            <option value="paused">{t('paused')}</option>
            <option value="draft">{t('draft')}</option>
            <option value="ended">{t('ended')}</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/ads/placements" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
            {t('managePlacements')}
          </Link>
          <Link href="/admin/ads/packages" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
            {t('managePackages')}
          </Link>
          <Button onClick={() => setShowNewAdvertiser(true)}>
            {t('advertisers')}
          </Button>
        </div>
      </div>

      {showNewAdvertiser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowNewAdvertiser(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{t('advertisers')}</h3>
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input value={newAdv.name} onChange={(e) => setNewAdv({ ...newAdv, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium">Name (Arabic)</label>
              <Input value={newAdv.name_ar} onChange={(e) => setNewAdv({ ...newAdv, name_ar: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={newAdv.contact_email} onChange={(e) => setNewAdv({ ...newAdv, contact_email: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input value={newAdv.contact_phone} onChange={(e) => setNewAdv({ ...newAdv, contact_phone: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateAdvertiser} disabled={creating || !newAdv.name} className="flex-1">
                {creating ? 'Creating...' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => setShowNewAdvertiser(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      ) : campaigns.length === 0 ? (
        <div className="border rounded-lg bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">{t('noCampaigns')}</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-start p-3 font-medium">{t('campaignName')}</th>
                  <th className="text-start p-3 font-medium">{t('advertiser')}</th>
                  <th className="text-start p-3 font-medium">{t('status')}</th>
                  <th className="text-start p-3 font-medium">{t('budget')}</th>
                  <th className="text-start p-3 font-medium">{t('spend')}</th>
                  <th className="text-start p-3 font-medium">{t('impressions')}</th>
                  <th className="text-start p-3 font-medium">{t('clicks')}</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c: any) => (
                  <tr key={c.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 text-muted-foreground">{c.advertiser?.name || c.advertiser?.name_ar || '-'}</td>
                    <td className="p-3">
                      <Badge variant={statusVariant[c.status] || 'secondary'}>{t(c.status) || c.status}</Badge>
                    </td>
                    <td className="p-3">{c.budget?.toLocaleString()} SAR</td>
                    <td className="p-3">{c.spent?.toLocaleString()} SAR</td>
                    <td className="p-3">-</td>
                    <td className="p-3">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            {t('previous')}
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            {t('next')}
          </Button>
        </div>
      )}
    </div>
  )
}
