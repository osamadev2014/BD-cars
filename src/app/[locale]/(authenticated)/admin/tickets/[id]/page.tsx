import { getTranslations } from 'next-intl/server'
import { getTicket } from '@/lib/actions/support-actions'
import { AdminTicketDetailClient } from './admin-ticket-detail-client'
import { notFound } from 'next/navigation'

export default async function AdminTicketDetailPage({ params }: { params: { id: string } }) {
  const t = await getTranslations('support')
  const ticket = await getTicket(params.id)
  if (!ticket) notFound()

  return <AdminTicketDetailClient ticket={ticket} />
}
