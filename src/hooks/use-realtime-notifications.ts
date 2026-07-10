'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUnreadCount } from '@/lib/actions/notification-actions'

export function useRealtimeNotifications() {
  const [unread, setUnread] = useState(0)

  const refresh = useCallback(async () => {
    const count = await getUnreadCount()
    setUnread(count)
  }, [])

  useEffect(() => {
    refresh()

    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return

      const channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'internal_notifications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            refresh()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    })
  }, [refresh])

  return { unread, setUnread, refresh }
}
