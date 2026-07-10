'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  pending_payment: 'text-yellow-600 bg-yellow-50',
  paid: 'text-blue-600 bg-blue-50',
  preparing: 'text-purple-600 bg-purple-50',
  shipped: 'text-cyan-600 bg-cyan-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
}

export function PartOrdersClient({ orders }: { orders: any[] }) {
  const t = useTranslations('parts')

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t('my_orders')}</h1>
      {orders.length === 0 && <p className="text-muted-foreground text-sm">{t('no_orders')}</p>}
      {orders.map((o: any) => (
        <Link key={o.id} href={`/dashboard/part-orders/${o.id}`} className="block border rounded-lg p-4 hover:bg-accent transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t('order')} #{o.id.slice(0, 8)}</p>
              <p className="text-xs text-muted-foreground">{o.grand_total} SAR</p>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-0.5 rounded ${statusColors[o.status] || 'text-muted-foreground bg-muted'}`}>{o.status}</span>
              <p className="text-xs text-muted-foreground mt-1">{new Date(o.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
