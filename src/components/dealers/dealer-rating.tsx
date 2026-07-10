'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'
import { rateDealer, getDealerRatings, getMyDealerRating } from '@/lib/actions/rating-actions'

export function DealerRating({ dealer }: { dealer: any }) {
  const t = useTranslations('dealers')
  const { user } = useAuth()
  const [ratings, setRatings] = useState<any[]>([])
  const [myRating, setMyRating] = useState<any>(null)
  const [selectedRating, setSelectedRating] = useState(0)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    const [r, mr] = await Promise.all([getDealerRatings(dealer.id), getMyDealerRating(dealer.id)])
    setRatings(r as any[])
    setMyRating(mr as any)
    if (mr) { setSelectedRating(mr.rating); setReview(mr.review || '') }
  }

  useEffect(() => { load() }, [dealer.id])

  const handleSubmit = async () => {
    if (selectedRating === 0 || loading) return
    setLoading(true)
    await rateDealer(dealer.id, selectedRating, review)
    setLoading(false)
    setShowForm(false)
    load()
  }

  const avg = ratings.length > 0 ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length) : 0
  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{t('ratings')}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-yellow-500">{avg.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({ratings.length} {t('reviews')})</span>
        </div>
      </div>

      {user && (
        <div className="mb-4">
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="text-sm text-primary hover:underline">
              {myRating ? t('update_review') : t('write_review')}
            </button>
          ) : (
            <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
              <div className="flex gap-1 text-2xl">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setSelectedRating(n)} className={`${n <= selectedRating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500 transition-colors`}>
                    {n <= selectedRating ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder={t('review_placeholder')}
                rows={3}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
              <div className="flex gap-2">
                <button onClick={handleSubmit} disabled={loading} className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">{t('submit')}</button>
                <button onClick={() => setShowForm(false)} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5">{t('cancel')}</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {ratings.map(r => (
          <div key={r.id} className="border-b pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {r.user?.full_name?.[0] || '?'}
                </div>
                <span className="text-sm font-medium">{r.user?.full_name || t('anonymous')}</span>
              </div>
              <span className="text-yellow-500">{stars(r.rating)}</span>
            </div>
            {r.review && <p className="text-sm text-muted-foreground mt-1">{r.review}</p>}
            <p className="text-xs text-muted-foreground mt-0.5">{new Date(r.created_at).toLocaleDateString()}</p>
          </div>
        ))}
        {ratings.length === 0 && <p className="text-sm text-muted-foreground">{t('no_ratings')}</p>}
      </div>
    </div>
  )
}
