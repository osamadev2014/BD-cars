'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'
import { toggleWatchAuction } from '@/lib/actions/auction-actions'

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 0 }).format(amount)
}

function formatTimer(ms: number, locale: string): string {
  if (ms <= 0) return locale === 'ar' ? 'انتهى' : 'Ended'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 48) {
    const days = Math.floor(hours / 24)
    return locale === 'ar' ? `${days} يوم` : `${days}d`
  }
  if (hours > 0) return locale === 'ar' ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : `${hours}h ${minutes}m ${seconds}s`
  return locale === 'ar' ? `${minutes}:${String(seconds).padStart(2, '0')}` : `${minutes}m ${seconds}s`
}

export function AuctionDetailClient({
  auction,
  strings,
}: {
  auction: any
  strings: Record<string, string>
}) {
  const loc = useLocale()
  const { user } = useAuth()
  const [remainingMs, setRemainingMs] = useState(auction.remaining_ms)
  const [bidAmount, setBidAmount] = useState(auction.highest_bid + auction.bid_increment)
  const [bids, setBids] = useState(auction.sorted_bids || [])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPlacingBid, setIsPlacingBid] = useState(false)
  const [isWatching, setIsWatching] = useState(false)
  const [showBidHistory, setShowBidHistory] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs((prev: number) => Math.max(0, prev - 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const endTime = new Date(auction.end_time).getTime()
  const isEnded = remainingMs <= 0
  const isSeller = user?.id === auction.seller_id
  const minBid = auction.highest_bid + auction.bid_increment

  const handleBid = useCallback(async () => {
    setError('')
    setSuccess('')

    if (!user) {
      setError(strings.bid_error_auth)
      return
    }

    if (bidAmount < minBid) {
      setError(strings.bid_error_low)
      return
    }

    setIsPlacingBid(true)
    const result = await import('@/lib/actions/auction-actions').then(m =>
      m.placeBid(auction.id, bidAmount)
    )
    setIsPlacingBid(false)

    if (!result.success) {
      setError(strings[`bid_error_${result.error}` as keyof typeof strings] || strings.bid_error_generic)
      return
    }

    setSuccess(strings.bid_success)
    const bidResult = result as { success: true; data?: any }
    const newBid = bidResult.data
    setBids((prev: any[]) => [
      { ...newBid, bidder: { id: user.id, full_name: user.full_name } },
      ...prev.map((b: any) => ({ ...b, is_winning: false })),
    ])
    setBidAmount(auction.buy_now_price && bidAmount >= auction.buy_now_price ? bidAmount : bidAmount + auction.bid_increment)
    setTimeout(() => setSuccess(''), 3000)
  }, [user, bidAmount, minBid, auction.id, auction.bid_increment, auction.buy_now_price, strings])

  const handleWatch = async () => {
    const result = await toggleWatchAuction(auction.id)
    if (result.success) {
      setIsWatching((result as { success: boolean; watching: boolean }).watching)
    }
  }

  const mainVehicle = auction.vehicles?.[0]?.listing
  const vehicle = mainVehicle?.vehicle
  const images = vehicle?.images || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden">
          {images[0] ? (
            <img src={images[0].url} alt={auction.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">{strings.no_image}</div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{auction.title}</h1>

          {vehicle && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vehicle.make?.name && (
                <div><p className="text-xs text-muted-foreground">{strings.make}</p><p className="font-medium">{vehicle.make.name}</p></div>
              )}
              {vehicle.model?.name && (
                <div><p className="text-xs text-muted-foreground">{strings.model}</p><p className="font-medium">{vehicle.model.name}</p></div>
              )}
              {vehicle.year && (
                <div><p className="text-xs text-muted-foreground">{strings.year}</p><p className="font-medium">{vehicle.year}</p></div>
              )}
              {vehicle.mileage && (
                <div><p className="text-xs text-muted-foreground">{strings.mileage}</p><p className="font-medium" dir="ltr">{vehicle.mileage.toLocaleString()} km</p></div>
              )}
            </div>
          )}

          {auction.terms && (
            <div>
              <p className="text-sm font-medium mb-1">{strings.terms}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{auction.terms}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => setShowBidHistory(!showBidHistory)}
              className="text-sm text-primary hover:underline"
            >
              {strings.bid_history} ({bids.length})
            </button>
            {showBidHistory && (
              <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                {bids.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">{strings.no_bids}</p>
                ) : (
                  bids.map((bid: any, i: number) => (
                    <div key={bid.id || i} className="flex items-center justify-between p-3 text-sm">
                      <span className="font-medium">{bid.bidder?.full_name || strings.anonymous}</span>
                      <span className="text-right">{formatPrice(bid.amount)} SAR</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border rounded-lg p-6 bg-card space-y-4">
          <div className={`text-center ${isEnded ? 'text-muted-foreground' : remainingMs < 3600000 ? 'text-destructive' : ''}`}>
            <p className="text-xs uppercase tracking-wider mb-1">{isEnded ? strings.ended : strings.end_time}</p>
            <p className="text-3xl font-mono font-bold">{formatTimer(remainingMs, loc)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{strings.starting_price}</span>
              <span className="font-medium">{formatPrice(auction.start_price)} SAR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{strings.current_bid}</span>
              <span className="font-bold text-lg">{formatPrice(auction.highest_bid)} SAR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{strings.bid_increment}</span>
              <span>{formatPrice(auction.bid_increment)} SAR</span>
            </div>
            {auction.buy_now_price && (
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">{strings.buy_now}</span>
                <span className="font-semibold text-primary">{formatPrice(auction.buy_now_price)} SAR</span>
              </div>
            )}
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{bids.length} {strings.bids_label}</span>
            <span>0 {strings.watchers}</span>
          </div>

          {!isEnded && !isSeller && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">{strings.bid_placeholder}</label>
                <div className="flex rounded-md border">
                  <span className="inline-flex items-center px-3 bg-muted text-sm rounded-l-md border-r">SAR</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={minBid}
                    step={auction.bid_increment}
                    className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded-r-md"
                    dir="ltr"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{strings.place_bid}</p>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <button
                onClick={handleBid}
                disabled={isPlacingBid || bidAmount < minBid}
                className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isPlacingBid ? '...' : strings.place_bid_btn}
              </button>

              <button
                onClick={handleWatch}
                className={`w-full rounded-md border py-2 text-sm font-medium transition-colors ${
                  isWatching ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-accent'
                }`}
              >
                {isWatching ? strings.watching : strings.watch}
              </button>
            </div>
          )}

          {isSeller && (
            <p className="text-sm text-muted-foreground text-center">{strings.seller_cannot_bid}</p>
          )}
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground mb-1">{strings.seller}</p>
          <p className="font-medium">{auction.seller?.full_name || strings.anonymous}</p>
        </div>
      </div>
    </div>
  )
}
