'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Switch } from '@/components/ui/switch'
import {
  updateNotificationPreferences,
  getNotificationPreferences,
  getPushSubscriptions,
  removePushSubscription,
  sendTestNotification,
} from '@/lib/actions/notification-actions'
import type { NotificationPreferences } from '@/types'

interface Props {
  preferences: NotificationPreferences | null
}

export function NotificationPreferencesClient({ preferences: initialPrefs }: Props) {
  const t = useTranslations('notification_preferences')
  const tc = useTranslations('common')
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(initialPrefs)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const [pushSupported, setPushSupported] = useState(true)
  const [hasPushSubscription, setHasPushSubscription] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    setPushSupported('serviceWorker' in navigator && 'PushManager' in window)
    getPushSubscriptions().then((subs) => setHasPushSubscription(subs.length > 0))
    if (!initialPrefs) {
      getNotificationPreferences().then((p) => p && setPrefs(p))
    }
  }, [initialPrefs])

  const updatePref = useCallback(
    (key: keyof NotificationPreferences, value: boolean) => {
      setPrefs((prev) => (prev ? { ...prev, [key]: value } : prev))
      setSaved(false)
    },
    []
  )

  const handleSave = async () => {
    if (!prefs) return
    setLoading(true)
    const { channel_in_app, channel_push, channel_email, channel_sms, pref_listing_updates, pref_messages, pref_inspection, pref_auctions, pref_purchase_requests, pref_finance, pref_spare_parts, pref_delivery, pref_admin_alerts, pref_marketing } = prefs
    await updateNotificationPreferences({
      channel_in_app, channel_push, channel_email, channel_sms,
      pref_listing_updates, pref_messages, pref_inspection, pref_auctions,
      pref_purchase_requests, pref_finance, pref_spare_parts, pref_delivery,
      pref_admin_alerts, pref_marketing,
    })
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSubscribePush = async () => {
    if (!pushSupported || !('serviceWorker' in navigator)) return
    setSubscribing(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) return

      const applicationServerKey = urlBase64ToUint8Array(vapidKey)
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })

      const subJson = subscription.toJSON()
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: {
            endpoint: subJson.endpoint,
            keys: subJson.keys,
          },
        }),
      })

      setHasPushSubscription(true)
    } catch (err) {
      console.error('Push subscription failed:', err)
    }
    setSubscribing(false)
  }

  const handleUnsubscribePush = async () => {
    try {
      const reg = await navigator.serviceWorker.ready
      const subscription = await reg.pushManager.getSubscription()
      if (subscription) {
        await fetch('/api/notifications/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
        await subscription.unsubscribe()
        setHasPushSubscription(false)
      }
    } catch (err) {
      console.error('Push unsubscribe failed:', err)
    }
  }

  const handleSendTest = async () => {
    setTestSent(false)
    await sendTestNotification()
    setTestSent(true)
    setTimeout(() => setTestSent(false), 3000)
  }

  if (!prefs) {
    return <div className="text-center py-12 text-muted-foreground">{tc('loading')}</div>
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-muted-foreground mb-4">{t('channelDescription')}</p>
        <div className="rounded-lg border divide-y">
          <ToggleRow label={t('inApp')} checked={prefs.channel_in_app} onChange={(v) => updatePref('channel_in_app', v)} />
          <ToggleRow label={t('push')} checked={prefs.channel_push} onChange={(v) => updatePref('channel_push', v)} disabled={!pushSupported} />
          <ToggleRow label={t('email')} checked={prefs.channel_email} onChange={(v) => updatePref('channel_email', v)} />
          <ToggleRow label={t('sms')} checked={prefs.channel_sms} onChange={(v) => updatePref('channel_sms', v)} />
        </div>
      </section>

      <section>
        <p className="text-sm text-muted-foreground mb-4">{t('toggleDescription')}</p>
        <div className="rounded-lg border divide-y">
          <ToggleRow label={t('listingUpdates')} checked={prefs.pref_listing_updates} onChange={(v) => updatePref('pref_listing_updates', v)} />
          <ToggleRow label={t('messages')} checked={prefs.pref_messages} onChange={(v) => updatePref('pref_messages', v)} />
          <ToggleRow label={t('inspections')} checked={prefs.pref_inspection} onChange={(v) => updatePref('pref_inspection', v)} />
          <ToggleRow label={t('auctions')} checked={prefs.pref_auctions} onChange={(v) => updatePref('pref_auctions', v)} />
          <ToggleRow label={t('purchaseRequests')} checked={prefs.pref_purchase_requests} onChange={(v) => updatePref('pref_purchase_requests', v)} />
          <ToggleRow label={t('finance')} checked={prefs.pref_finance} onChange={(v) => updatePref('pref_finance', v)} />
          <ToggleRow label={t('spareParts')} checked={prefs.pref_spare_parts} onChange={(v) => updatePref('pref_spare_parts', v)} />
          <ToggleRow label={t('delivery')} checked={prefs.pref_delivery} onChange={(v) => updatePref('pref_delivery', v)} />
          <ToggleRow label={t('adminAlerts')} checked={prefs.pref_admin_alerts} onChange={(v) => updatePref('pref_admin_alerts', v)} />
          <ToggleRow label={t('marketing')} checked={prefs.pref_marketing} onChange={(v) => updatePref('pref_marketing', v)} />
        </div>
      </section>

      <section>
        {!pushSupported ? (
          <p className="text-sm text-muted-foreground">{t('unsupportedPush')}</p>
        ) : hasPushSubscription ? (
          <button onClick={handleUnsubscribePush} className="text-sm text-destructive hover:underline">
            {t('unsubscribePush')}
          </button>
        ) : (
          <button
            onClick={handleSubscribePush}
            disabled={subscribing}
            className="text-sm text-primary hover:underline disabled:opacity-50"
          >
            {t('subscribePush')}
          </button>
        )}
      </section>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? tc('loading') : tc('save')}
        </button>
        {saved && <span className="text-sm text-green-600">{t('saved')}</span>}

        <button
          onClick={handleSendTest}
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          {t('sendTest')}
        </button>
        {testSent && <span className="text-sm text-green-600">{t('testSent')}</span>}
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className={`text-sm ${disabled ? 'text-muted-foreground' : ''}`}>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} className={disabled ? 'opacity-50' : ''} />
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray.buffer
}
