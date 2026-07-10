import { getTranslations } from 'next-intl/server'
import { getPartOrderDetail } from '@/lib/actions/part-request-actions'
import { notFound } from 'next/navigation'
import { PartOrderDetailClient } from './order-detail-client'

export default async function PartOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getPartOrderDetail(id)
  if (!order) notFound()
  return <PartOrderDetailClient order={order} />
}
