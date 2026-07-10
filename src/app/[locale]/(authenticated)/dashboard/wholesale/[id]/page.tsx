import { getTranslations } from 'next-intl/server'
import { getWholesaleRequest } from '@/lib/actions/wholesale-actions'
import { WholesaleDetailClient } from './wholesale-detail-client'
import { notFound } from 'next/navigation'

export default async function WholesaleDetailPage({ params }: { params: { id: string } }) {
  const t = await getTranslations('wholesale')
  const request = await getWholesaleRequest(params.id)
  if (!request) notFound()

  return <WholesaleDetailClient request={request} />
}
