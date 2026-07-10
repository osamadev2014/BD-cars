import { getTranslations } from 'next-intl/server'
import { getAllAuctionsAdmin } from '@/lib/actions/auction-actions'
import { AdminAuctionsClient } from './admin-auctions-client'

export default async function AdminAuctionsPage() {
  const t = await getTranslations('admin')
  const auctions = await getAllAuctionsAdmin()

  return <AdminAuctionsClient auctions={auctions} />
}
