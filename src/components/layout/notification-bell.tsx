'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { markNotificationRead, getNotifications } from '@/lib/actions/notification-actions'
import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  title_ar: string | null
  body: string
  body_ar: string | null
  type: string
  is_read: boolean
  created_at: string
  reference_type: string | null
  reference_id: string | null
}

export function NotificationBell() {
  const { unread, setUnread, refresh } = useRealtimeNotifications()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()

  useEffect(() => {
    if (open) {
      getNotifications(1, 5).then(({ data }) => setNotifications(data as Notification[]))
    }
  }, [open])

  const handleToggle = async () => {
    setOpen(!open)
  }

  const handleClick = async (n: Notification) => {
    if (!n.is_read) {
      await markNotificationRead(n.id)
      setUnread((prev: number) => Math.max(0, prev - 1))
      setNotifications((prev: Notification[]) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
      )
    }
    if (n.reference_type === 'listing' && n.reference_id) {
      router.push(`/listings/${n.reference_id}`)
    } else {
      router.push('/dashboard/notifications')
    }
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute end-0 z-50 mt-2 w-80 rounded-xl border border-border/60 bg-card shadow-lg animate-fade-in">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60">
              <p className="text-sm font-semibold">Notifications</p>
              <a href="/dashboard/notifications" className="text-xs text-accent hover:underline">
                View all
              </a>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No notifications
                </p>
              )}
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={cn(
                    'w-full text-start px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0',
                    !n.is_read && 'bg-muted/30'
                  )}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
