import { getAuctions } from '@/lib/actions/auction-actions'
import { getTranslations } from 'next-intl/server'
import { AuctionsClient } from './auctions-client'
import { getLocale } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function AuctionsPage() {
  const t = await getTranslations('auctions')
  const c = await getTranslations('common')
  const locale = await getLocale()

  const result = await getAuctions({ pageSize: 12 })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
      </div>

      <AuctionsClient
        initialAuctions={result.data}
        initialCount={result.count}
        locale={locale}
        strings={{
          ending_soon: t('ending_soon'),
          no_auctions: t('no_auctions'),
          bids: t('bids'),
          watchers: t('watchers'),
          place_bid: t('place_bid'),
          view_details: c('view_all'),
          sort_latest: t('sort_latest'),
          sort_ending: t('sort_ending'),
          sort_price_low: t('sort_price_low'),
          sort_price_high: t('sort_price_high'),
          buy_now: t('buy_now'),
          reserve_met: t('reserve_met'),
          reserve_not_met: t('reserve_not_met'),
        }}
      />
    </div>
  )
}
