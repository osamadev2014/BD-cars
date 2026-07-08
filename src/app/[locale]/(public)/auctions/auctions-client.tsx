'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

function formatEndTime(ms: number, locale: string) {
  if (ms <= 0) return locale === 'ar' ? 'انتهى' : 'Ended'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 48) {
    const days = Math.floor(hours / 24)
    return locale === 'ar' ? `${days} يوم` : `${days}d`
  }
  if (hours > 0) return locale === 'ar' ? `${hours} س ${minutes} د` : `${hours}h ${minutes}m`
  return locale === 'ar' ? `${minutes} د ${seconds} ث` : `${minutes}m ${seconds}s`
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 0 }).format(amount)
}

const SORT_OPTIONS = ['end_time_asc', 'end_time_desc', 'price_asc', 'price_desc'] as const

export function AuctionsClient({
  initialAuctions,
  initialCount,
  locale,
  strings,
}: {
  initialAuctions: any[]
  initialCount: number
  locale: string
  strings: Record<string, string>
}) {
  const t = useTranslations('auctions')
  const loc = useLocale()
  const [sort, setSort] = useState('end_time_asc')

  const sorted = [...initialAuctions].sort((a: any, b: any) => {
    switch (sort) {
      case 'end_time_asc': return a.remaining_ms - b.remaining_ms
      case 'end_time_desc': return b.remaining_ms - a.remaining_ms
      case 'price_asc': return a.start_price - b.start_price
      case 'price_desc': return b.start_price - a.start_price
      default: return 0
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {initialCount} {strings.bids}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="end_time_asc">{strings.sort_ending}</option>
          <option value="end_time_desc">{strings.sort_latest}</option>
          <option value="price_asc">{strings.sort_price_low}</option>
          <option value="price_desc">{strings.sort_price_high}</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <div className="border rounded-lg bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">{strings.no_auctions}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((auction: any) => {
            const vehicle = auction.main_vehicle?.vehicle
            const mainImage = vehicle?.images?.[0]?.url

            return (
              <Link
                key={auction.id}
                href={`/${loc}/auctions/${auction.slug}`}
                className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
              >
                <div className="aspect-[16/10] bg-muted relative">
                  {mainImage ? (
                    <img src={mainImage} alt={vehicle?.make?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      {t('no_image')}
                    </div>
                  )}
                  {auction.remaining_ms < 3600000 && auction.remaining_ms > 0 && (
                    <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                      {strings.ending_soon}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold truncate">{auction.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {vehicle?.make?.name} {vehicle?.model?.name} {vehicle?.year}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('starting_price')}</p>
                      <p className="font-bold text-lg">{formatPrice(auction.start_price)} SAR</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{t('current_bid')}</p>
                      <p className="font-semibold">{formatPrice(auction.highest_bid)} SAR</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>{auction.bid_count} {strings.bids}</span>
                    <span>{formatEndTime(auction.remaining_ms, loc)}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
