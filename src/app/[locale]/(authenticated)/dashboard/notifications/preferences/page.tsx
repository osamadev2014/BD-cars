import { getTranslations } from 'next-intl/server'
import { getNotificationPreferences } from '@/lib/actions/notification-actions'
import { NotificationPreferencesClient } from './notification-preferences-client'

export default async function NotificationPreferencesPage() {
  const t = await getTranslations('notification_preferences')
  const prefs = await getNotificationPreferences()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t('pageTitle')}</h1>
      <NotificationPreferencesClient preferences={prefs} />
    </div>
  )
}
