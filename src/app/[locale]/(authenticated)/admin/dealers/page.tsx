import { getTranslations } from 'next-intl/server'
import { getAllDealers } from '@/lib/actions/dealer-actions'
import { AdminDealersClient } from './admin-dealers-client'

export default async function AdminDealersPage() {
  const t = await getTranslations('dealers')
  const dealers = await getAllDealers()
  return <AdminDealersClient dealers={dealers} />
}
