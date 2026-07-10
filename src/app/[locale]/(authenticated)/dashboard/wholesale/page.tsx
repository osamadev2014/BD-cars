import { getTranslations } from 'next-intl/server'
import { getMyWholesaleRequests } from '@/lib/actions/wholesale-actions'
import { WholesaleListClient } from './wholesale-list-client'

export default async function WholesalePage() {
  const t = await getTranslations('wholesale')
  const requests = await getMyWholesaleRequests()

  return <WholesaleListClient requests={requests} />
}
