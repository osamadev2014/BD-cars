'use client'

import { useTranslations } from 'next-intl'

const statusColors: Record<string, string> = {
  pending_payment: 'text-yellow-600 bg-yellow-50',
  paid: 'text-blue-600 bg-blue-50',
  preparing: 'text-purple-600 bg-purple-50',
  shipped: 'text-cyan-600 bg-cyan-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
}

export function PartOrderDetailClient({ order }: { order: any }) {
  const t = useTranslations('parts')

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{t('order')} #{order.id.slice(0, 8)}</h1>

      <div className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('status')}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${statusColors[order.status] || ''}`}>{order.status}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('payment_status')}</span>
          <span>{order.payment_status}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('supplier')}</span>
          <span>{order.spare_part_suppliers?.name || '—'}</span>
        </div>
        <hr className="my-2" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('total_amount')}</span>
          <span>{order.total_amount} SAR</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('delivery_fee')}</span>
          <span>{order.delivery_fee || 0} SAR</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('vat')}</span>
          <span>{order.vat_amount || 0} SAR</span>
        </div>
        <div className="flex items-center justify-between font-medium">
          <span>{t('grand_total')}</span>
          <span>{order.grand_total} SAR</span>
        </div>
      </div>

      {order.spare_part_order_items?.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">{t('items')}</h2>
          <div className="border rounded-lg divide-y">
            {order.spare_part_order_items.map((item: any) => (
              <div key={item.id} className="p-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{t('quantity')}: {item.quantity}</p>
                </div>
                <p>{item.total_price} SAR</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.notes && <div className="border rounded-lg p-4 text-sm"><span className="text-muted-foreground">{t('notes')}:</span> {order.notes}</div>}
    </div>
  )
}
