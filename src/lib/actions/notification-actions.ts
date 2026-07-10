'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'
import { dispatchNotification } from '@/lib/notifications'
import { sendPushToUser } from '@/lib/notifications/push'
import type { NotificationPreferences } from '@/types'

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export async function getNotifications(page = 1, pageSize = 20) {
  return safeDb(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) return { data: [], unreadCount: 0 }
    const supabase = await createServerSupabaseClient()

    const { data, count, error } = await (supabase as any)
      .from('internal_notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    const { count: unreadCount } = await (supabase as any)
      .from('internal_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', auth.userId)
      .eq('is_read', false)

    if (error) throw new Error(error.message)
    return { data: data || [], unreadCount: unreadCount || 0, count: count || 0 }
  }, { data: [], unreadCount: 0, count: 0 })
}

export async function getUnreadCount() {
  return safeDb(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) return 0
    const supabase = await createServerSupabaseClient()

    const { count } = await (supabase as any)
      .from('internal_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', auth.userId)
      .eq('is_read', false)

    return count || 0
  }, 0)
}

export async function markNotificationRead(notificationId: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return

  const supabase = await createServerSupabaseClient()
  await (supabase as any)
    .from('internal_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', auth.userId)

  revalidatePath('/dashboard/notifications')
}

export async function markAllNotificationsRead() {
  const auth = await requireAuth()
  if (!auth.allowed) return

  const supabase = await createServerSupabaseClient()
  await (supabase as any)
    .from('internal_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', auth.userId)
    .eq('is_read', false)

  revalidatePath('/dashboard/notifications')
}

export async function createNotification(
  userId: string,
  title: string,
  body: string,
  type = 'info',
  referenceType?: string,
  referenceId?: string,
  titleAr?: string,
  bodyAr?: string,
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('internal_notifications')
      .insert({
        user_id: userId,
        title,
        title_ar: titleAr || title,
        body,
        body_ar: bodyAr || body,
        type,
        reference_type: referenceType || null,
        reference_id: referenceId || null,
      })
      .select()
      .single()

    if (data) {
      dispatchNotification({
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        body: data.body,
        type: data.type,
        reference_type: data.reference_type,
        reference_id: data.reference_id,
      })
    }
  } catch {
    // silently fail - notification failure shouldn't break the main action
  }
}

export async function getNotificationPreferences(userId?: string) {
  return safeDb(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) return null
    const uid = userId || auth.userId!
    const supabase = await createServerSupabaseClient()

    const { data, error } = await (supabase as any)
      .from('notification_preferences')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data as NotificationPreferences | null
  }, null)
}

export async function updateNotificationPreferences(
  data: Partial<Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: auth.error }

  const supabase = await createServerSupabaseClient()

  const { error } = await (supabase as any)
    .from('notification_preferences')
    .upsert(
      { user_id: auth.userId, ...data, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/notifications/preferences')
  return { success: true }
}

export async function getPushSubscriptions(userId?: string) {
  return safeDb(async () => {
    const auth = await requireAuth()
    if (!auth.allowed) return []
    const uid = userId || auth.userId!
    const supabase = await createServerSupabaseClient()

    const { data, error } = await (supabase as any)
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }, [])
}

export async function removePushSubscription(endpoint: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: auth.error }

  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any)
    .from('push_subscriptions')
    .delete()
    .eq('user_id', auth.userId)
    .eq('endpoint', endpoint)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function registerPushSubscription(subscription: {
  endpoint: string
  keys: { p256dh: string; auth: string }
  userAgent?: string
}) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: auth.error }

  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any)
    .from('push_subscriptions')
    .upsert(
      {
        user_id: auth.userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth_key: subscription.keys.auth,
        user_agent: subscription.userAgent || null,
      },
      { onConflict: 'user_id,endpoint' }
    )

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function sendTestNotification(userId?: string) {
  const auth = await requireAuth()
  if (!auth.allowed) return { success: false, error: auth.error }

  const uid = userId || auth.userId!
  const result = await sendPushToUser(uid, 'Test Notification', 'This is a test notification from BD.', { type: 'test' })
  return { success: true, sent: result.sent, failed: result.failed }
}
