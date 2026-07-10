'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'
import {
  getAdvertiserDashboard,
  getAdCampaigns,
} from '@/lib/actions/ad-actions'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  active: 'success',
  paused: 'warning',
  draft: 'secondary',
  ended: 'destructive',
}

export function AdvertiserAdsClient() {
  const t = useTranslations('ads')
  const loc = useLocale()
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      getAdvertiserDashboard(user.id),
      getAdCampaigns({ page: 1, perPage: 50 }),
    ]).then(([dash, result]) => {
      setDashboard(dash)
      setCampaigns(result.data)
      setLoading(false)
    })
  }, [user])

  if (!user) return null

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
    )
  }

  const statsCards = dashboard ? [
    { label: t('impressions'), value: dashboard.totalImpressions.toLocaleString() },
    { label: t('clicks'), value: dashboard.totalClicks.toLocaleString() },
    { label: t('ctr'), value: `${dashboard.ctr}%` },
    { label: t('spend'), value: `${dashboard.totalSpend.toLocaleString()} SAR` },
  ] : []

  return (
    <div className="space-y-6">
      {dashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card) => (
            <div key={card.label} className="border rounded-lg p-4 bg-card">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('campaigns')}</h2>
        <Link
          href="/dashboard/ads/campaigns/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t('createCampaign')}
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="border rounded-lg bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">{t('noCampaigns')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('createFirst')}</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-start p-3 font-medium">{t('campaignName')}</th>
                  <th className="text-start p-3 font-medium">{t('status')}</th>
                  <th className="text-start p-3 font-medium">{t('budget')}</th>
                  <th className="text-start p-3 font-medium">{t('spend')}</th>
                  <th className="text-start p-3 font-medium">{t('impressions')}</th>
                  <th className="text-start p-3 font-medium">{t('clicks')}</th>
                  <th className="text-start p-3 font-medium">{t('ctr')}</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign: any) => (
                  <tr key={campaign.id} className="border-t hover:bg-muted/30">
                    <td className="p-3">
                      <Link
                        href={`/dashboard/ads/campaigns/${campaign.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="p-3">
                      <Badge variant={statusVariant[campaign.status] || 'secondary'}>
                        {t(campaign.status) || campaign.status}
                      </Badge>
                    </td>
                    <td className="p-3">{campaign.budget.toLocaleString()} SAR</td>
                    <td className="p-3">{campaign.spent.toLocaleString()} SAR</td>
                    <td className="p-3">-</td>
                    <td className="p-3">-</td>
                    <td className="p-3">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
