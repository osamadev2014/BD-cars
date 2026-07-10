import { getTranslations } from 'next-intl/server'
import { getDeliveryOrder } from '@/lib/actions/delivery-actions'
import { formatPrice, formatDate } from '@/lib/utils'

export default async function DeliveryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations('delivery')
  const { id } = await params
  const order = await getDeliveryOrder(id)

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        {t('not_found')}
      </div>
    )
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      case 'in_transit': return 'bg-blue-100 text-blue-700'
      default: return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <a href="/dashboard/delivery" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        &larr; {t('back')}
      </a>

      <h1 className="text-2xl font-bold mb-6">{t('order')} #{order.tracking_number || order.id.slice(0, 8)}</h1>

      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-3">{t('order_info')}</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('status')}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                {t(order.status) || order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('fee')}</span>
              <span>{formatPrice(order.delivery_fee || 0)}</span>
            </div>
            {order.provider && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('provider')}</span>
                <span>{order.provider.name || order.provider.name_ar}</span>
              </div>
            )}
            {order.method && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('method')}</span>
                <span>{order.method.name || order.method.name_ar}</span>
              </div>
            )}
            {order.estimated_delivery_date && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('estimated')}</span>
                <span>{formatDate(order.estimated_delivery_date)}</span>
              </div>
            )}
            {order.actual_delivery_date && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('actual')}</span>
                <span>{formatDate(order.actual_delivery_date)}</span>
              </div>
            )}
          </div>
        </div>

        {order.delivery_address && (
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-3">{t('delivery_address')}</h2>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>{order.delivery_address.address}</p>
              {order.delivery_address.city && (
                <p>{order.delivery_address.city.name || order.delivery_address.city.name_ar}</p>
              )}
              {order.delivery_address.phone && <p>{order.delivery_address.phone}</p>}
            </div>
          </div>
        )}

        {order.tracking_events?.length > 0 && (
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-3">{t('tracking')}</h2>
            <div className="space-y-3">
              {(order.tracking_events as any[]).map((event: any) => (
                <div key={event.id} className="flex gap-3 text-sm">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="font-medium">{t(event.status) || event.status}</p>
                    {event.location && <p className="text-muted-foreground">{event.location}</p>}
                    {event.notes && <p className="text-muted-foreground text-xs">{event.notes}</p>}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
