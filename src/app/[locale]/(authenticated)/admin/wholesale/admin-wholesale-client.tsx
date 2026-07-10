'use client'

import { useTranslations } from 'next-intl'
import { updateWholesaleStatus } from '@/lib/actions/wholesale-actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STATUS_LABELS: Record<string, string> = { open: 'status_open', negotiation: 'status_negotiation', closed: 'status_closed', awarded: 'status_awarded' }
const STATUS_COLORS: Record<string, string> = { open: 'bg-blue-100 text-blue-800', negotiation: 'bg-yellow-100 text-yellow-800', closed: 'bg-gray-100 text-gray-800', awarded: 'bg-green-100 text-green-800' }

export function AdminWholesaleClient({ requests }: { requests: any[] }) {
  const t = useTranslations('wholesale')
  const router = useRouter()

  const handleStatus = async (id: string, status: string) => {
    const result = await updateWholesaleStatus(id, status)
    if (!result.success) alert(result.error)
    else router.refresh()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('wholesale')}</h1>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">{t('title')}</th>
              <th className="text-left p-3">{t('dealer')}</th>
              <th className="text-left p-3">{t('offers')}</th>
              <th className="text-left p-3">{t('status')}</th>
              <th className="text-left p-3">{t('created')}</th>
              <th className="text-left p-3">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req: any) => (
              <tr key={req.id} className="border-t">
                <td className="p-3"><Link href={`/dashboard/wholesale/${req.id}`} className="hover:underline font-medium">{req.title}</Link></td>
                <td className="p-3 text-muted-foreground">{req.dealer?.name || req.dealer?.owner?.full_name}</td>
                <td className="p-3">{req.offers?.[0]?.count || 0}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[req.status] || STATUS_COLORS.open}`}>{t(STATUS_LABELS[req.status] || STATUS_LABELS.open)}</span>
                </td>
                <td className="p-3 text-muted-foreground text-xs">{new Date(req.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <select
                    defaultValue={req.status}
                    onChange={e => handleStatus(req.id, e.target.value)}
                    className="h-8 rounded border border-input bg-background px-2 text-xs"
                  >
                    <option value="open">{t('status_open')}</option>
                    <option value="negotiation">{t('status_negotiation')}</option>
                    <option value="awarded">{t('status_awarded')}</option>
                    <option value="closed">{t('status_closed')}</option>
                  </select>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">{t('no_requests')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
