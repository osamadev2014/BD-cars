import { getTranslations } from 'next-intl/server'
import { getMyPartRequests } from '@/lib/actions/part-request-actions'
import { PartRequestsClient } from './part-requests-client'

export default async function PartRequestsPage() {
  const t = await getTranslations('parts')
  const requests = await getMyPartRequests()
  return <PartRequestsClient requests={requests} />
}
