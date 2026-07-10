'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { approveListing, rejectListing } from '@/lib/actions/admin-actions'
import { useRouter } from 'next/navigation'

export function ApprovalsClient({
  requestId,
  listingId,
}: {
  requestId: string
  listingId: string
}) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handleApprove = async () => {
    setLoading(true)
    try {
      await approveListing(requestId)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return
    setLoading(true)
    try {
      await rejectListing(requestId, rejectReason)
      setShowReject(false)
      setRejectReason('')
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shrink-0 space-y-2">
      <div className="flex gap-1">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {t('approve')}
        </button>
        <button
          onClick={() => setShowReject(true)}
          disabled={loading}
          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {t('reject')}
        </button>
      </div>
      <a
        href={`/listings/${listingId}`}
        className="block text-center text-xs text-primary hover:underline"
      >
        {t('preview')}
      </a>

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowReject(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold">{t('reject_title')}</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('reject_placeholder')}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={loading || !rejectReason.trim()}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? t('loading') : t('reject')}
              </button>
              <button
                onClick={() => setShowReject(false)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
