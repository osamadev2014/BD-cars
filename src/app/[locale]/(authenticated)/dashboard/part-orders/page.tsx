import { getTranslations } from 'next-intl/server'
import { getMyPartOrders } from '@/lib/actions/part-request-actions'
import { PartOrdersClient } from './part-orders-client'

export default async function PartOrdersPage() {
  const t = await getTranslations('parts')
  const orders = await getMyPartOrders()
  return <PartOrdersClient orders={orders} />
}
