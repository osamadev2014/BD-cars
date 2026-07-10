'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { approveDealer } from '@/lib/actions/dealer-actions'

export function AdminDealersClient({ dealers }: { dealers: any[] }) {
  const t = useTranslations('dealers')
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (id: string, approve: boolean) => {
    setLoading(id)
    await approveDealer(id, approve)
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin_dealers')}</h1>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">{t('dealer_name')}</th>
              <th className="text-left p-3 font-medium">{t('owner')}</th>
              <th className="text-left p-3 font-medium">{t('plan')}</th>
              <th className="text-left p-3 font-medium">{t('status')}</th>
              <th className="text-left p-3 font-medium">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((d: any) => (
              <tr key={d.id} className="border-t hover:bg-muted/50">
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3 text-muted-foreground">{d.owner?.full_name || 'Unknown'}<br /><span className="text-xs">{d.owner?.phone}</span></td>
                <td className="p-3 text-xs">{d.plan?.[0]?.plan?.name || t('free')}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${d.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {d.is_approved ? t('approved') : t('pending')}
                  </span>
                </td>
                <td className="p-3">
                  {!d.is_approved && (
                    <button
                      onClick={() => handleApprove(d.id, true)}
                      disabled={loading === d.id}
                      className="text-xs text-primary hover:underline disabled:opacity-50"
                    >
                      {loading === d.id ? '...' : t('approve')}
                    </button>
                  )}
                  {d.is_approved && (
                    <button
                      onClick={() => handleApprove(d.id, false)}
                      disabled={loading === d.id}
                      className="text-xs text-red-500 hover:underline disabled:opacity-50"
                    >
                      {loading === d.id ? '...' : t('deactivate')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
