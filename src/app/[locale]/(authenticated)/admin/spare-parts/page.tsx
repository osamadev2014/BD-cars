import { getTranslations } from 'next-intl/server'
import { getAllPartRequests, getPartSuppliers } from '@/lib/actions/part-request-actions'
import { AdminSparePartsClient } from './admin-spare-parts-client'

export default async function AdminSparePartsPage() {
  const t = await getTranslations('admin')
  const requests = await getAllPartRequests()
  const suppliers = await getPartSuppliers()
  return <AdminSparePartsClient requests={requests} suppliers={suppliers} />
}
