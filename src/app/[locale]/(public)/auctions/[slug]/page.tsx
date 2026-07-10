import type { Metadata } from 'next'
import { getAuctionBySlug, placeBid, toggleWatchAuction } from '@/lib/actions/auction-actions'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { AuctionDetailClient } from './auction-detail-client'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const auction = await getAuctionBySlug(slug)
  if (!auction) return {}
  const vehicle = auction.vehicle
  const title = `Auction: ${vehicle?.year} ${vehicle?.make?.name} ${vehicle?.model?.name}`
  const desc = vehicle?.description || `Auction for ${vehicle?.year} ${vehicle?.make?.name} ${vehicle?.model?.name}`
  return buildMetadata({
    title,
    description: desc.slice(0, 160),
    path: `/auctions/${slug}`,
  })
}

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug } = await params
  const t = await getTranslations('auctions')
  const c = await getTranslations('common')

  const auction = await getAuctionBySlug(slug)
  if (!auction) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <AuctionDetailClient
        auction={auction}
        strings={{
          starting_price: t('starting_price'),
          current_bid: t('current_bid'),
          buy_now: t('buy_now'),
          bid_increment: t('bid_increment'),
          place_bid: t('place_bid'),
          place_bid_btn: t('place_bid_btn'),
          watch: t('watch'),
          watching: t('watching'),
          bid_history: t('bid_history'),
          no_bids: t('no_bids'),
          bid_placeholder: t('bid_placeholder'),
          ending_soon: t('ending_soon'),
          reserve_met: t('reserve_met'),
          reserve_not_met: t('reserve_not_met'),
          seller: t('seller'),
          bids_label: t('bids_label'),
          watchers: t('watchers'),
          end_time: t('end_time'),
          ended: t('ended'),
          bid_success: t('bid_success'),
          bid_error_auth: t('bid_error_auth'),
          bid_error_self: t('bid_error_self'),
          bid_error_low: t('bid_error_low'),
          bid_error_ended: t('bid_error_ended'),
          bid_error_generic: t('bid_error_generic'),
          no_image: t('no_image'),
          make: t('make'),
          model: t('model'),
          year: t('year'),
          mileage: t('mileage'),
          anonymous: t('anonymous'),
          terms: t('terms'),
          seller_cannot_bid: t('seller_cannot_bid'),
        }}
      />
    </div>
  )
}
