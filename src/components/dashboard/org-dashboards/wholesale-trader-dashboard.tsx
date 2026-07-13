'use client'

import { useState, useEffect } from 'react'
import { Warehouse, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'
import { getWholesaleTraderStats } from '@/lib/actions/dashboard-actions'

interface Props { orgName: string; orgNameAr: string; locale: string; orgId: string }

const ICONS = [Warehouse, ShoppingCart, DollarSign, TrendingUp]
const COLORS = ['text-blue-600', 'text-amber-600', 'text-green-600', 'text-purple-600']
const BGS = ['bg-blue-100', 'bg-amber-100', 'bg-green-100', 'bg-purple-100']

export function WholesaleTraderDashboard({ orgName, orgNameAr, locale, orgId }: Props) {
  const isRtl = locale === 'ar'
  const t = (en: string, ar: string) => isRtl ? ar : en
  const [data, setData] = useState<{ stats: any[]; recent: any[] }>({ stats: [], recent: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => { getWholesaleTraderStats(orgId).then((res) => { setData(res); setLoading(false) }) }, [orgId])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">{isRtl ? orgNameAr : orgName}</h1><p className="text-muted-foreground">{t('Wholesale Dashboard', 'لوحة تحكم تجارة الجملة')}</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((s, i) => {
          const Icon = ICONS[i] || Warehouse
          return (
            <div key={s.label} className="border rounded-xl p-5 bg-card">
              <div className="flex items-center justify-between">
                <div className={`${BGS[i] || 'bg-blue-100'} p-2.5 rounded-lg`}><Icon className={`h-5 w-5 ${COLORS[i] || 'text-blue-600'}`} /></div>
                <span className={`text-lg font-bold ${COLORS[i] || 'text-blue-600'}`}>{s.value}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">{s.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
