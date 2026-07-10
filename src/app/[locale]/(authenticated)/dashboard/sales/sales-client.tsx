'use client'

import { updatePurchaseRequestStatus } from '@/lib/actions/buy-actions'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export function SalesClient({
  requestId,
  status,
}: {
  requestId: string
  status: string
}) {
  const t = useTranslations('common')
  const router = useRouter()

  if (status !== 'pending' && status !== 'under_review') return null

  const handleAction = async (newStatus: string) => {
    await updatePurchaseRequestStatus(requestId, newStatus)
    router.refresh()
  }

  return (
    <div className="shrink-0 flex gap-1">
      <button
        onClick={() => handleAction('accepted')}
        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
      >
        {t('accepted')}
      </button>
      <button
        onClick={() => handleAction('rejected')}
        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
      >
        {t('rejected')}
      </button>
    </div>
  )
}
