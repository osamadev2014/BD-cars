'use client'

import { useState, useEffect } from 'react'
import { Car, Eye, DollarSign, ShoppingCart } from 'lucide-react'
import { getCarDealerStats } from '@/lib/actions/dashboard-actions'

interface Props { orgName: string; orgNameAr: string; locale: string; orgId: string }

export function CarDealerDashboard({ orgName, orgNameAr, locale, orgId }: Props) {
  const isRtl = locale === 'ar'
  const t = (en: string, ar: string) => isRtl ? ar : en
  const [data, setData] = useState<{ stats: any[]; recent: any[] }>({ stats: [], recent: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCarDealerStats(orgId).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [orgId])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{isRtl ? orgNameAr : orgName}</h1>
        <p className="text-muted-foreground">{t('Car Dealer Dashboard', 'لوحة تحكم معرض السيارات')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((s, i) => {
          const icons = [Car, Eye, ShoppingCart, DollarSign]
          const Icon = icons[i] || Car
          const colors = ['text-blue-600', 'text-green-600', 'text-amber-600', 'text-purple-600']
          const bgs = ['bg-blue-100', 'bg-green-100', 'bg-amber-100', 'bg-purple-100']
          return (
            <div key={s.label} className="border rounded-xl p-5 bg-card">
              <div className="flex items-center justify-between">
                <div className={`${bgs[i] || 'bg-blue-100'} p-2.5 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${colors[i] || 'text-blue-600'}`} />
                </div>
                <span className={`text-lg font-bold ${colors[i] || 'text-blue-600'}`}>{s.value}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">{s.label}</p>
            </div>
          )
        })}
      </div>
      {data.recent.length > 0 && (
        <div className="border rounded-xl bg-card p-5">
          <h2 className="font-semibold mb-4">{t('Recent Activity', 'آخر النشاطات')}</h2>
          <div className="space-y-3">
            {data.recent.map((r, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{r.action}</p>
                  <p className="text-xs text-muted-foreground">{r.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
