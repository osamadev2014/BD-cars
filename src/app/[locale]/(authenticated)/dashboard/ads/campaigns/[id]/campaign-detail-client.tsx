'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { getAdCampaignById, deleteAdCampaign } from '@/lib/actions/ad-actions'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  active: 'success',
  paused: 'warning',
  draft: 'secondary',
  ended: 'destructive',
}

export function CampaignDetailClient() {
  const t = useTranslations('ads')
  const ct = useTranslations('common')
  const loc = useLocale()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getAdCampaignById(id).then((data) => {
      setCampaign(data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return
    try {
      await deleteAdCampaign(id)
      router.push('/dashboard/ads')
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return <div className="h-64 bg-muted rounded-lg animate-pulse" />
  }

  if (!campaign) {
    return <div className="text-center py-12 text-muted-foreground">{t('noCampaigns')}</div>
  }

  const totalImpressions = campaign.impressions?.length || 0
  const totalClicks = campaign.clicks?.length || 0
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/ads" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; {t('backToDashboard')}
          </Link>
          <h1 className="text-2xl font-bold mt-1">{campaign.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/ads/campaigns/${id}/edit`}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            {ct('edit')}
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            {t('deleteCampaign')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground">{t('impressions')}</p>
          <p className="text-2xl font-bold mt-1">{totalImpressions.toLocaleString()}</p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground">{t('clicks')}</p>
          <p className="text-2xl font-bold mt-1">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground">{t('ctr')}</p>
          <p className="text-2xl font-bold mt-1">{ctr}%</p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground">{t('spend')}</p>
          <p className="text-2xl font-bold mt-1">{campaign.spent.toLocaleString()} SAR</p>
        </div>
      </div>

      <div className="border rounded-lg bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">{t('campaignDetail')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">{t('status')}: </span>
            <Badge variant={statusVariant[campaign.status] || 'secondary'}>
              {t(campaign.status) || campaign.status}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">{t('adType')}: </span>
            <span className="font-medium">{t(campaign.type) || campaign.type}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t('totalBudget')}: </span>
            <span className="font-medium">{campaign.budget.toLocaleString()} SAR</span>
          </div>
          {campaign.daily_budget && (
            <div>
              <span className="text-muted-foreground">{t('dailyBudget')}: </span>
              <span className="font-medium">{campaign.daily_budget.toLocaleString()} SAR</span>
            </div>
          )}
          {campaign.target_url && (
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">{t('targetUrl')}: </span>
              <a href={campaign.target_url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                {campaign.target_url}
              </a>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">{t('startDate')}: </span>
            <span className="font-medium">{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : '-'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t('endDate')}: </span>
            <span className="font-medium">{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : '-'}</span>
          </div>
        </div>
      </div>

      <div className="border rounded-lg bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">{t('performance')}</h2>
        {totalImpressions === 0 ? (
          <p className="text-sm text-muted-foreground">{t('noData')}</p>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t('impressions')} Over Time</p>
              <div className="flex items-end gap-1 h-24">
                {campaign.impressions.slice(0, 30).reverse().map((imp: any, i: number) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/20 rounded-t"
                    style={{ height: `${Math.max(4, (i % 5 + 1) * 16)}px` }}
                    title={new Date(imp.created_at).toLocaleDateString()}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
