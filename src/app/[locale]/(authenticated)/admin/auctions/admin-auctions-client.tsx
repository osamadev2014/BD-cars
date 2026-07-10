'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { updateAuctionStatus } from '@/lib/actions/auction-actions'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  draft: 'text-muted-foreground bg-muted',
  active: 'text-green-600 bg-green-50',
  paused: 'text-yellow-600 bg-yellow-50',
  ended: 'text-blue-600 bg-blue-50',
  cancelled: 'text-red-600 bg-red-50',
}

export function AdminAuctionsClient({ auctions }: { auctions: any[] }) {
  const t = useTranslations('admin')
  const loc = useLocale()
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState('')

  const handleStatus = async (id: string, status: string) => {
    await updateAuctionStatus(id, status)
    router.refresh()
  }

  const filtered = statusFilter ? auctions.filter((a: any) => a.status === statusFilter) : auctions

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('auctions')}</h1>

      <div className="flex gap-2 flex-wrap">
        {['', 'draft', 'active', 'paused', 'ended', 'cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs px-3 py-1 rounded-full border ${statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">{t('title')}</th>
              <th className="text-left p-3">{t('seller')}</th>
              <th className="text-left p-3">{t('vehicle')}</th>
              <th className="text-left p-3">{t('start_price')}</th>
              <th className="text-left p-3">{t('bids')}</th>
              <th className="text-left p-3">{t('status')}</th>
              <th className="text-left p-3">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a: any) => {
              const mainVehicle = a.vehicles?.[0]?.listing?.vehicle
              return (
                <tr key={a.id} className="border-t">
                  <td className="p-3">
                    <Link href={`/${loc}/auctions/${a.slug}`} className="hover:underline font-medium">{a.title}</Link>
                  </td>
                  <td className="p-3 text-muted-foreground">{a.seller?.full_name || '—'}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {mainVehicle ? `${mainVehicle.make?.name} ${mainVehicle.model?.name} (${mainVehicle.year})` : '—'}
                  </td>
                  <td className="p-3">{Number(a.start_price).toLocaleString()} SAR</td>
                  <td className="p-3">{a.bids?.[0]?.count || 0}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${statusColors[a.status] || ''}`}>{a.status}</span>
                  </td>
                  <td className="p-3">
                    <select
                      defaultValue={a.status}
                      onChange={e => handleStatus(a.id, e.target.value)}
                      className="h-8 rounded border border-input bg-background px-2 text-xs"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="ended">Ended</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
