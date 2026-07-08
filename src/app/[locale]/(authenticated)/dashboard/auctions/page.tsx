'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { getUserAuctions } from '@/lib/actions/auction-actions'
import Link from 'next/link'

export default function MyAuctionsPage() {
  const t = useTranslations('auctions')
  const loc = useLocale()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'selling'
  const [selling, setSelling] = useState<any[]>([])
  const [bidding, setBidding] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getUserAuctions().then((data: any) => {
      setSelling(data.selling || [])
      setBidding(data.bidding || [])
      setLoading(false)
    })
  }, [user])

  if (!user) return null

  const AuctionItem = ({ auction }: { auction: any }) => {
    const listing = auction.vehicle_listings || auction.listing
    const vehicle = listing?.vehicle || auction.vehicle
    const image = auction.images?.[0]
    return (
      <Link href={`/auctions/${auction.slug}`} className="flex items-center gap-4 border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors">
        <div className="w-20 h-20 flex-shrink-0 bg-muted rounded overflow-hidden">
          {image ? (
            <img src={image.url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">N/A</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">
            {vehicle?.make?.name} {vehicle?.model?.name} ({vehicle?.year})
          </p>
          <p className="text-sm text-muted-foreground">
            {t('starting_bid')}: {Number(auction.starting_price).toLocaleString()} SAR
          </p>
          {auction.current_bid && (
            <p className="text-sm font-medium text-primary">{t('current_bid')}: {Number(auction.current_bid).toLocaleString()} SAR</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <span className={`text-xs px-2 py-1 rounded-full ${auction.status === 'active' ? 'bg-green-100 text-green-700' : auction.status === 'sold' ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'}`}>
            {t(auction.status) || auction.status}
          </span>
          {auction.ends_at && <p className="text-xs text-muted-foreground mt-1">{new Date(auction.ends_at).toLocaleDateString(loc === 'ar' ? 'ar-SA' : 'en-US')}</p>}
        </div>
      </Link>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{t('my_auctions')}</h1>

      {loading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
      ) : (
        <>
          <div className="flex gap-4 mb-6 border-b">
            <Link href="?tab=selling" className={`pb-2 text-sm font-medium border-b-2 transition-colors ${tab === 'selling' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {t('selling')} ({selling.length})
            </Link>
            <Link href="?tab=bidding" className={`pb-2 text-sm font-medium border-b-2 transition-colors ${tab === 'bidding' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {t('bidding')} ({bidding.length})
            </Link>
          </div>

          {tab === 'selling' ? (
            selling.length === 0 ? (
              <div className="border rounded-lg bg-card p-12 text-center"><p className="text-lg text-muted-foreground">{t('no_auctions_selling')}</p></div>
            ) : (
              <div className="space-y-4">{selling.map((a: any) => <AuctionItem key={a.id} auction={a} />)}</div>
            )
          ) : (
            bidding.length === 0 ? (
              <div className="border rounded-lg bg-card p-12 text-center"><p className="text-lg text-muted-foreground">{t('no_bids')}</p></div>
            ) : (
              <div className="space-y-4">{bidding.map((a: any) => <AuctionItem key={a.id} auction={a} />)}</div>
            )
          )}
        </>
      )}
    </>
  )
}
