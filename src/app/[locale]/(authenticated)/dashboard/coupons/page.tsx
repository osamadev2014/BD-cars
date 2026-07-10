import { getTranslations } from 'next-intl/server'
import { getMyRedemptions } from '@/lib/actions/coupon-actions'
import { CouponsClient } from './coupons-client'

export default async function CouponsPage() {
  const t = await getTranslations('common')
  const redemptions = await getMyRedemptions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('my_coupons')}</h1>
        <p className="text-sm text-muted-foreground">{t('my_coupons_description')}</p>
      </div>
      <CouponsClient redemptions={redemptions} />
    </div>
  )
}
