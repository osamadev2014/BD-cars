import { getTranslations } from 'next-intl/server'
import { getAllWholesaleRequests } from '@/lib/actions/wholesale-actions'
import { AdminWholesaleClient } from './admin-wholesale-client'

export default async function AdminWholesalePage() {
  const t = await getTranslations('wholesale')
  const requests = await getAllWholesaleRequests()

  return <AdminWholesaleClient requests={requests} />
}
