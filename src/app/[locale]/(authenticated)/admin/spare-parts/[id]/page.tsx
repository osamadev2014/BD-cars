import { getTranslations } from 'next-intl/server'
import { getPartRequestDetail, getPartSuppliers } from '@/lib/actions/part-request-actions'
import { notFound } from 'next/navigation'
import { AdminPartRequestDetailClient } from './admin-request-detail-client'

export default async function AdminPartRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const request = await getPartRequestDetail(id)
  if (!request) notFound()
  const suppliers = await getPartSuppliers()
  return <AdminPartRequestDetailClient request={request} suppliers={suppliers} />
}
