'use client'

import { useTranslations } from 'next-intl'

interface Redemption {
  id: string
  coupon_id: string
  discount_amount: number
  created_at: string
  coupon: {
    code: string
    discount_type: string
    discount_value: number
    description: string | null
  }
}

export function CouponsClient({ redemptions }: { redemptions: Redemption[] }) {
  const t = useTranslations('common')

  if (redemptions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t('no_coupon_usage')}
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">{t('coupon')}</th>
            <th className="text-left p-3">{t('description')}</th>
            <th className="text-left p-3">{t('discount')}</th>
            <th className="text-left p-3">{t('date')}</th>
          </tr>
        </thead>
        <tbody>
          {redemptions.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3 font-mono font-bold">{r.coupon.code}</td>
              <td className="p-3 text-muted-foreground">{r.coupon.description || '-'}</td>
              <td className="p-3 text-green-600">-{r.discount_amount.toFixed(2)} SAR</td>
              <td className="p-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
