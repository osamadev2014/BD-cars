import { getTranslations } from 'next-intl/server'
import { getTicket, addTicketMessage } from '@/lib/actions/support-actions'
import { TicketDetailClient } from './ticket-detail-client'
import { notFound } from 'next/navigation'

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const t = await getTranslations('support')
  const ticket = await getTicket(params.id)
  if (!ticket) notFound()

  return <TicketDetailClient ticket={ticket} />
}
