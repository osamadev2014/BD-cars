import webPush from 'web-push'
import { getAdminClient } from '@/lib/supabase/admin'

export function isPushConfigured(): boolean {
  const pubKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privKey = process.env.VAPID_PRIVATE_KEY
  return !!pubKey && !!privKey && pubKey !== 'VAPID_placeholder'
}

export function getVapidPublicKey(): string {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
}

function getPushClient() {
  if (!isPushConfigured()) return null
  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:support@bd.evico.sa',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  )
  return webPush
}

export async function sendPushNotification(
  subscription: { endpoint: string; keys: { auth: string; p256dh: string } },
  payload: { title: string; body: string; icon?: string; url?: string },
) {
  const client = getPushClient()
  if (!client) return { success: false, error: 'Push not configured' }

  try {
    await client.sendNotification(
      subscription as any,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icon.png',
        data: { url: payload.url },
      }),
    )
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function sendPushToUser(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<{ sent: number; failed: number }> {
  const admin = getAdminClient() as any
  const { data: subscriptions, error } = await admin
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)

  if (error || !subscriptions || subscriptions.length === 0) {
    return { sent: 0, failed: 0 }
  }

  let sent = 0
  let failed = 0
  const expiredEndpoints: string[] = []

  for (const sub of subscriptions) {
    const result = await sendPushNotification(
      { endpoint: sub.endpoint, keys: { auth: sub.auth_key, p256dh: sub.p256dh } },
      { title, body, url: data?.url },
    )

    if (result.success) {
      sent++
    } else {
      failed++
      if (result.error?.includes('410') || result.error?.includes('expired')) {
        expiredEndpoints.push(sub.endpoint)
      }
    }
  }

  for (const endpoint of expiredEndpoints) {
    await admin
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId)
      .eq('endpoint', endpoint)
  }

  return { sent, failed }
}
