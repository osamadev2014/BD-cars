import { getAdminClient } from '@/lib/supabase/admin'
import { sendEmail, isEmailConfigured } from './email'
import { sendSms, isSmsConfigured } from './sms'
import { sendPushNotification, sendPushToUser, isPushConfigured } from './push'

interface NotificationPayload {
  id: string
  user_id: string
  title: string
  body: string
  type: string
  reference_type?: string | null
  reference_id?: string | null
}

interface UserChannel {
  email?: string
  phone?: string
}

interface UserPreferences {
  channel_in_app: boolean
  channel_push: boolean
  channel_email: boolean
  channel_sms: boolean
  pref_listing_updates: boolean
  pref_messages: boolean
  pref_inspection: boolean
  pref_auctions: boolean
  pref_purchase_requests: boolean
  pref_finance: boolean
  pref_spare_parts: boolean
  pref_delivery: boolean
  pref_admin_alerts: boolean
  pref_marketing: boolean
}

const NOTIFICATION_TYPE_MAP: Record<string, keyof Omit<UserPreferences, 'channel_in_app' | 'channel_push' | 'channel_email' | 'channel_sms'>> = {
  listing: 'pref_listing_updates',
  message: 'pref_messages',
  inspection: 'pref_inspection',
  auction: 'pref_auctions',
  purchase_request: 'pref_purchase_requests',
  finance: 'pref_finance',
  spare_part: 'pref_spare_parts',
  delivery: 'pref_delivery',
  admin: 'pref_admin_alerts',
  marketing: 'pref_marketing',
}

async function getUserChannels(userId: string): Promise<UserChannel | null> {
  try {
    const admin = getAdminClient() as any
    const { data: profile } = await admin
      .from('profiles')
      .select('email, phone')
      .eq('id', userId)
      .single()

    if (!profile) return null

    return {
      email: profile.email || undefined,
      phone: profile.phone || undefined,
    }
  } catch {
    return null
  }
}

async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  try {
    const admin = getAdminClient() as any
    const { data: prefs } = await admin
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (!prefs) {
      return {
        channel_in_app: true,
        channel_push: false,
        channel_email: false,
        channel_sms: false,
        pref_listing_updates: true,
        pref_messages: true,
        pref_inspection: true,
        pref_auctions: true,
        pref_purchase_requests: true,
        pref_finance: true,
        pref_spare_parts: true,
        pref_delivery: true,
        pref_admin_alerts: true,
        pref_marketing: false,
      }
    }

    return prefs as UserPreferences
  } catch {
    return null
  }
}

function isNotificationTypeEnabled(prefs: UserPreferences, type: string): boolean {
  const prefKey = NOTIFICATION_TYPE_MAP[type]
  if (!prefKey) return true
  return prefs[prefKey] !== false
}

async function recordDelivery(
  notificationId: string,
  channel: string,
  status: 'sent' | 'failed',
  error?: string,
) {
  try {
    const admin = getAdminClient() as any
    await admin.from('notification_deliveries').insert({
      notification_id: notificationId,
      channel,
      status,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
      error: error || null,
    })
  } catch {
    // silently fail
  }
}

export async function dispatchNotification(notification: NotificationPayload) {
  const userPrefs = await getUserPreferences(notification.user_id)
  if (!userPrefs) return

  if (!isNotificationTypeEnabled(userPrefs, notification.type)) return

  const user = await getUserChannels(notification.user_id)
  if (!user) return

  const channels: string[] = []
  if (userPrefs.channel_email && isEmailConfigured()) channels.push('email')
  if (userPrefs.channel_sms && isSmsConfigured()) channels.push('sms')
  if (userPrefs.channel_push && isPushConfigured()) channels.push('push')

  if (channels.length === 0) return

  for (const channel of channels) {
    switch (channel) {
      case 'email': {
        if (!user.email) continue
        const result = await sendEmail({
          to: user.email,
          subject: notification.title,
          html: buildEmailHtml(notification),
        })
        await recordDelivery(
          notification.id,
          'email',
          result.success ? 'sent' : 'failed',
          result.error,
        )
        break
      }
      case 'sms': {
        if (!user.phone) continue
        const result = await sendSms({
          to: user.phone,
          body: `${notification.title}: ${notification.body}`,
        })
        await recordDelivery(
          notification.id,
          'sms',
          result.success ? 'sent' : 'failed',
          result.error,
        )
        break
      }
      case 'push': {
        const result = await sendPushToUser(
          notification.user_id,
          notification.title,
          notification.body,
          notification.reference_type === 'listing' && notification.reference_id
            ? { url: `/listings/${notification.reference_id}` }
            : { url: '/dashboard/notifications' },
        )
        await recordDelivery(
          notification.id,
          'push',
          result.sent > 0 ? 'sent' : 'failed',
          result.failed > 0 ? `${result.failed} subscriptions failed` : undefined,
        )
        break
      }
    }
  }
}

function buildEmailHtml(notification: NotificationPayload): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bd.evico.sa'
  const refUrl = notification.reference_id
    ? `${appUrl}/listings/${notification.reference_id}`
    : `${appUrl}/dashboard/notifications`

  return `
<!DOCTYPE html>
<html dir="auto">
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden">
    <div style="background:#0066CC;padding:20px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:20px">${escapeHtml(notification.title)}</h1>
    </div>
    <div style="padding:24px">
      <p style="font-size:16px;line-height:1.5;color:#333">${escapeHtml(notification.body)}</p>
      <a href="${refUrl}" style="display:inline-block;padding:10px 20px;background:#0066CC;color:#fff;text-decoration:none;border-radius:4px;margin-top:16px">
        View Details
      </a>
    </div>
    <div style="padding:16px 24px;background:#f9f9f9;font-size:12px;color:#999;text-align:center">
      <p>&copy; ${new Date().getFullYear()} BD. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
