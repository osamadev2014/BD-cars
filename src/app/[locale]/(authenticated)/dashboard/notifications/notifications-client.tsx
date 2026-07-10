'use client'

import { useTranslations } from 'next-intl'
import { markAllNotificationsRead } from '@/lib/actions/notification-actions'
import { useRouter } from 'next/navigation'

export function NotificationsClient() {
  const t = useTranslations('notifications')
  const router = useRouter()

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
    router.refresh()
  }

  return (
    <button
      onClick={handleMarkAllRead}
      className="text-sm text-primary hover:underline"
    >
      {t('mark_all_read')}
    </button>
  )
}
