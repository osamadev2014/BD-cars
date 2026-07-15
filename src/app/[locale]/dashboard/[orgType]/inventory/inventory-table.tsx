'use client'

import { cn } from '@/lib/utils'
import { Eye, Edit, Car } from 'lucide-react'
import Link from 'next/link'

interface Props {
  rows: Record<string, any>[]
  locale: string
  orgType: string
  emptyMessage?: string
}

export function InventoryTable({ rows, locale, orgType, emptyMessage }: Props) {
  const isRtl = locale === 'ar'

  if (!rows || rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-gray-100 dark:border-gray-800">
        <Car className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-sm text-gray-400 dark:text-gray-500">{emptyMessage || (isRtl ? 'لا توجد مركبات' : 'No vehicles')}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
      <table className="w-full text-sm" dir={isRtl ? 'rtl' : 'ltr'}>
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <th className={cn('px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider', isRtl ? 'text-right' : 'text-left')}>{isRtl ? 'المركبة' : 'Vehicle'}</th>
            <th className={cn('px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider', isRtl ? 'text-right' : 'text-left')}>{isRtl ? 'السعر' : 'Price'}</th>
            <th className={cn('px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider', isRtl ? 'text-right' : 'text-left')}>{isRtl ? 'الحالة' : 'Status'}</th>
            <th className={cn('px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider', isRtl ? 'text-right' : 'text-left')}>{isRtl ? 'تاريخ الإضافة' : 'Added'}</th>
            <th className={cn('px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider', isRtl ? 'text-right' : 'text-left')}><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {rows.map((row: any, i: number) => (
            <tr key={row.id || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"><Car className="h-5 w-5 text-gray-400" /></div>
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">{row.vehicle}</p><p className="text-xs text-gray-400 dark:text-gray-500">{row.year || ''}</p></div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{row.price || '—'}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  row.status === 'active' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                  row.status === 'sold' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' :
                  row.status === 'reserved' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
                  row.status === 'pending' || row.status === 'pending_approval' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
                  'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400')}>
                  {isRtl ? (
                    row.status === 'active' ? 'نشط' : row.status === 'sold' ? 'مباع' : row.status === 'reserved' ? 'محجوز' : row.status === 'pending' || row.status === 'pending_approval' ? 'قيد الانتظار' : row.status
                  ) : row.status === 'pending_approval' ? 'pending' : row.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.created_at ? new Date(row.created_at).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US') : '—'}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <Link href={`/${locale}/dashboard/${orgType}/inventory/${row.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><Eye className="h-4 w-4" /></Link>
                  <Link href={`/${locale}/dashboard/${orgType}/inventory/${row.id}/edit`} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><Edit className="h-4 w-4" /></Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}