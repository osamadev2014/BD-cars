'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

const STATUS_LABELS: Record<string, string> = { open: 'status_open', in_progress: 'status_in_progress', waiting_customer: 'status_waiting', resolved: 'status_resolved', closed: 'status_closed' }
const PRIORITY_COLORS: Record<string, string> = { low: 'bg-gray-100 text-gray-800', normal: 'bg-blue-100 text-blue-800', high: 'bg-orange-100 text-orange-800', urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
const STATUS_COLORS: Record<string, string> = { open: 'bg-blue-100 text-blue-800', in_progress: 'bg-yellow-100 text-yellow-800', waiting_customer: 'bg-orange-100 text-orange-800', resolved: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800' }

export function AdminTicketList({ tickets }: { tickets: any[] }) {
  const t = useTranslations('support')

  return (
    <div className="space-y-3">
      {tickets.length === 0 ? (
        <p className="text-muted-foreground">{t('no_tickets')}</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">{t('subject')}</th>
                <th className="text-left p-3 font-medium">{t('customer')}</th>
                <th className="text-left p-3 font-medium">{t('category')}</th>
                <th className="text-left p-3 font-medium">{t('priority')}</th>
                <th className="text-left p-3 font-medium">{t('status')}</th>
                <th className="text-left p-3 font-medium">{t('date')}</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket: any) => (
                <tr key={ticket.id} className="border-t hover:bg-muted/50">
                  <td className="p-3"><Link href={`/admin/tickets/${ticket.id}`} className="font-medium hover:underline">{ticket.subject}</Link></td>
                  <td className="p-3 text-muted-foreground">{ticket.customer?.full_name || ticket.customer?.phone || '-'}</td>
                  <td className="p-3 text-muted-foreground">{t(`cat_${ticket.category}`)}</td>
                  <td className="p-3"><span className={`text-xs px-1.5 py-0.5 rounded ${PRIORITY_COLORS[ticket.priority]}`}>{ticket.priority}</span></td>
                  <td className="p-3"><span className={`text-xs px-1.5 py-0.5 rounded ${STATUS_COLORS[ticket.status]}`}>{t(STATUS_LABELS[ticket.status] || 'status_open')}</span></td>
                  <td className="p-3 text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
