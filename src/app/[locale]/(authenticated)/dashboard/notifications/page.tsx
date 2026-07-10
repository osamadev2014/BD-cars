import { getTranslations } from 'next-intl/server'
import { getNotifications } from '@/lib/actions/notification-actions'
import { NotificationsClient } from './notifications-client'

export default async function NotificationsPage() {
  const t = await getTranslations('notifications')
  const { data: notifications, unreadCount } = await getNotifications()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        {unreadCount > 0 && <NotificationsClient />}
      </div>

      <div className="space-y-1">
        {notifications.map((n: any) => (
          <div
            key={n.id}
            className={`rounded-lg border p-4 transition-colors ${
              !n.is_read ? 'bg-primary/5 border-primary/20' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(n.created_at).toLocaleDateString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              {!n.is_read && (
                <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
              )}
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">{t('empty')}</div>
        )}
      </div>
    </div>
  )
}
