'use client'

import { useState } from 'react'
import { Bell, Truck, PackageCheck, UserCheck, Info, AlertTriangle, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS: Record<string, typeof Bell> = {
  shipment: Truck, delivery: PackageCheck, driver: UserCheck, system: Info, alert: AlertTriangle,
}

const COLORS: Record<string, string> = {
  shipment: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  delivery: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  driver: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  system: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  alert: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
}

const FILTERS = [
  { key: 'all', en: 'All', ar: 'الكل' },
  { key: 'unread', en: 'Unread', ar: 'غير مقروء' },
  { key: 'shipment', en: 'Shipments', ar: 'الشحنات' },
  { key: 'delivery', en: 'Deliveries', ar: 'التسليم' },
  { key: 'driver', en: 'Drivers', ar: 'السائقون' },
  { key: 'system', en: 'System', ar: 'النظام' },
] as const

type Filter = typeof FILTERS[number]['key']

const ITEMS = [
  { id: '1', type: 'shipment' as const, en: { title: 'New Transport Request', desc: 'Transport request #TR-1025 from Riyadh to Jeddah', time: '2 min ago' }, ar: { title: 'طلب نقل جديد', desc: 'طلب نقل #TR-1025 من الرياض إلى جدة', time: 'منذ دقيقتين' }, read: false },
  { id: '2', type: 'delivery' as const, en: { title: 'Shipment Delivered', desc: 'Shipment #TR-1018 delivered successfully', time: '1 hour ago' }, ar: { title: 'تم تسليم الشحنة', desc: 'تم تسليم الشحنة #TR-1018 بنجاح', time: 'منذ ساعة' }, read: false },
  { id: '3', type: 'driver' as const, en: { title: 'Driver Assigned', desc: 'Driver Ahmed assigned to shipment #TR-1024', time: '3 hours ago' }, ar: { title: 'تم تعيين سائق', desc: 'تم تعيين السائق أحمد للشحنة #TR-1024', time: 'منذ 3 ساعات' }, read: false },
  { id: '4', type: 'shipment' as const, en: { title: 'Route Updated', desc: 'Route for shipment #TR-1015 updated', time: '5 hours ago' }, ar: { title: 'تم تحديث المسار', desc: 'تم تحديث مسار الشحنة #TR-1015', time: 'منذ 5 ساعات' }, read: true },
  { id: '5', type: 'system' as const, en: { title: 'System Maintenance', desc: 'Scheduled maintenance Sunday 2:00-4:00 AM', time: '1 day ago' }, ar: { title: 'صيانة النظام', desc: 'صيانة مجدولة الأحد ٢-٤ صباحاً', time: 'منذ يوم' }, read: true },
  { id: '6', type: 'delivery' as const, en: { title: 'Delivery Completed', desc: 'Shipment #TR-1018 delivered in Jeddah', time: '2 days ago' }, ar: { title: 'اكتمال التسليم', desc: 'تم تسليم الشحنة #TR-1018 في جدة', time: 'منذ يومين' }, read: true },
  { id: '7', type: 'system' as const, en: { title: 'New Feature Available', desc: 'Live tracking available for all shipments', time: '3 days ago' }, ar: { title: 'ميزة جديدة متاحة', desc: 'التتبع المباشر متاح لجميع الشحنات', time: 'منذ 3 أيام' }, read: true },
  { id: '8', type: 'shipment' as const, en: { title: 'Route Changed', desc: 'Shipment #TR-1015 route changed due to traffic', time: '4 days ago' }, ar: { title: 'تغيير المسار', desc: 'تغيير مسار الشحنة #TR-1015', time: 'منذ 4 أيام' }, read: true },
]

export function NotificationsList({ locale }: { locale: string }) {
  const isRtl = locale === 'ar'
  const [filter, setFilter] = useState<Filter>('all')
  const [items, setItems] = useState(ITEMS)
  const unread = items.filter(i => !i.read).length
  const filtered = filter === 'all' ? items : filter === 'unread' ? items.filter(i => !i.read) : items.filter(i => i.type === filter)

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                filter === f.key
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}>
              {isRtl ? f.ar : f.en}
            </button>
          ))}
        </div>
        {unread > 0 && (
          <button onClick={() => setItems(p => p.map(i => ({ ...i, read: true })))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <CheckCheck className="h-3.5 w-3.5" />
            {isRtl ? 'تحديد الكل مقروء' : 'Mark All Read'}
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {isRtl ? 'لا توجد إشعارات' : 'No Notifications'}
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {isRtl ? 'لا توجد إشعارات جديدة' : 'No new notifications'}
            </p>
          </div>
        ) : filtered.map(item => {
          const txt = isRtl ? item.ar : item.en
          const Icon = ICONS[item.type] || Bell
          return (
            <div key={item.id}
              className={cn('flex items-start gap-4 p-4 transition-colors',
                !item.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
              )}>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', COLORS[item.type])}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={cn('text-sm', !item.read ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300')}>
                      {txt.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{txt.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{txt.time}</span>
                    {!item.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}