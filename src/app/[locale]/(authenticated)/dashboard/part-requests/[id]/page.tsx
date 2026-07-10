import { getTranslations } from 'next-intl/server'
import { getPartRequestDetail } from '@/lib/actions/part-request-actions'
import { notFound } from 'next/navigation'
import { PartRequestDetailClient } from './detail-client'

export default async function PartRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const request = await getPartRequestDetail(id)
  if (!request) notFound()
  return <PartRequestDetailClient request={request} />
}
