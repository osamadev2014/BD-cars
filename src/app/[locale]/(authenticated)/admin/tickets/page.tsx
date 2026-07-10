import { getTranslations } from 'next-intl/server'
import { getAllTickets } from '@/lib/actions/support-actions'
import { AdminTicketList } from './admin-ticket-list'

export default async function AdminTicketsPage() {
  const t = await getTranslations('support')
  const tickets = await getAllTickets()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin_tickets')}</h1>
      <AdminTicketList tickets={tickets} />
    </div>
  )
}
