import { getTranslations } from 'next-intl/server'
import { getCrmCustomerDetail } from '@/lib/actions/crm-actions'
import { CrmCustomerDetailClient } from './crm-customer-detail-client'
import { notFound } from 'next/navigation'

export default async function AdminCrmDetailPage({ params }: { params: { userId: string } }) {
  const t = await getTranslations('crm')
  const customer = await getCrmCustomerDetail(params.userId)
  if (!customer) notFound()

  return <CrmCustomerDetailClient customer={customer} />
}
