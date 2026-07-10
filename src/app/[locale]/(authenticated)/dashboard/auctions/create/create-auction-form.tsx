'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createAuction } from '@/lib/actions/auction-actions'

export function CreateAuctionForm({ listings }: { listings: any[] }) {
  const t = useTranslations('auctions')
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const now = new Date()
  const defaultStart = now.toISOString().slice(0, 16)
  const defaultEnd = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 16)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const result = await createAuction(fd)
    setLoading(false)
    if (result.success) {
      router.push(`/auctions/${result.data.slug}`)
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('create_auction')}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">{t('select_listing')}</label>
          <select name="listing_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" required>
            <option value="">{t('select_listing')}</option>
            {listings.map((l: any) => (
              <option key={l.id} value={l.id}>
                {l.vehicle?.make?.name} {l.vehicle?.model?.name} ({l.vehicle?.year}) - {l.price} SAR
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">{t('title')}</label>
            <input name="title" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" required />
          </div>
          <div>
            <label className="text-sm font-medium">{t('title_ar')}</label>
            <input name="title_ar" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">{t('auction_type')}</label>
          <select name="auction_type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
            <option value="public">{t('public')}</option>
            <option value="private">{t('private')}</option>
            <option value="wholesale">{t('wholesale')}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">{t('start_price')}</label>
            <input name="start_price" type="number" step="0.01" min="1" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" required />
          </div>
          <div>
            <label className="text-sm font-medium">{t('bid_increment')} (SAR)</label>
            <input name="bid_increment" type="number" step="0.01" defaultValue="100" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">{t('buy_now_price')} ({t('optional')})</label>
            <input name="buy_now_price" type="number" step="0.01" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">{t('reserve_price')} ({t('optional')})</label>
            <input name="reserve_price" type="number" step="0.01" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">{t('start_time')}</label>
            <input name="start_time" type="datetime-local" defaultValue={defaultStart} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" required />
          </div>
          <div>
            <label className="text-sm font-medium">{t('end_time')}</label>
            <input name="end_time" type="datetime-local" defaultValue={defaultEnd} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" required />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">{t('terms')}</label>
          <textarea name="terms" rows={3} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm mt-1 resize-none" />
        </div>
        <div>
          <label className="text-sm font-medium">{t('terms_ar')}</label>
          <textarea name="terms_ar" rows={3} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm mt-1 resize-none" />
        </div>

        <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full">
          {loading ? t('creating') : t('create_auction')}
        </button>
      </form>
    </div>
  )
}
