import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getMyTickets } from '@/lib/actions/support-actions'

const STATUS_LABELS: Record<string, string> = { open: 'status_open', in_progress: 'status_in_progress', waiting_customer: 'status_waiting', resolved: 'status_resolved', closed: 'status_closed' }
const STATUS_COLORS: Record<string, string> = { open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', waiting_customer: 'bg-orange-100 text-orange-800', resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', closed: 'bg-gray-100 text-gray-800' }

export default async function TicketsPage() {
  const t = await getTranslations('support')
  const tickets = await getMyTickets()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('my_tickets')}</h1>
        <Link href="/contact" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">{t('new_ticket')}</Link>
      </div>
      {tickets.length === 0 ? (
        <p className="text-muted-foreground">{t('no_tickets')}</p>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket: any) => (
            <Link key={ticket.id} href={`/dashboard/tickets/${ticket.id}`} className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{ticket.subject}</p>
                  <p className="text-sm text-muted-foreground">{t(`cat_${ticket.category}`)} — {new Date(ticket.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[ticket.status] || STATUS_COLORS.open}`}>{t(STATUS_LABELS[ticket.status] || STATUS_LABELS.open)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
