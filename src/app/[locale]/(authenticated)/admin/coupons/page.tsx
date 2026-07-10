import { getTranslations } from 'next-intl/server'
import { getCoupons } from '@/lib/actions/finance-admin-actions'
import { CouponsClient } from './coupons-client'

export default async function CouponsPage() {
  const t = await getTranslations('admin')
  const coupons = await getCoupons()
  return <CouponsClient coupons={coupons} />
}
