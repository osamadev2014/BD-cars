import { getTranslations } from 'next-intl/server'
import { getMyDeliveryOrders } from '@/lib/actions/delivery-actions'
import { formatPrice } from '@/lib/utils'

export default async function DeliveryOrdersPage() {
  const t = await getTranslations('delivery')
  const orders = await getMyDeliveryOrders()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('orders_title')}</h1>
        <a
          href="/dashboard/delivery-addresses"
          className="text-sm text-primary hover:underline"
        >
          {t('manage_addresses')}
        </a>
      </div>

      <div className="space-y-3">
        {orders.map((order: any) => (
          <a
            key={order.id}
            href={`/dashboard/delivery/${order.id}`}
            className="block rounded-lg border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm">{t('order')} #{order.tracking_number || order.id.slice(0, 8)}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                order.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {t(order.status) || order.status}
              </span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              {order.delivery_address && (
                <p>{order.delivery_address.address}</p>
              )}
              <p>{t('fee')}: {formatPrice(order.delivery_fee || 0)}</p>
              {order.estimated_delivery_date && (
                <p>{t('estimated')}: {new Date(order.estimated_delivery_date).toLocaleDateString()}</p>
              )}
            </div>
          </a>
        ))}
        {orders.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">{t('no_orders')}</p>
        )}
      </div>
    </div>
  )
}
