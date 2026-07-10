import { getTranslations } from 'next-intl/server'
import { getIncomingPurchaseRequests, getIncomingViewingAppointments } from '@/lib/actions/buy-actions'
import { formatPrice } from '@/lib/utils'
import { SalesClient } from './sales-client'

export default async function SalesPage() {
  const t = await getTranslations('common')
  const { data: requests } = await getIncomingPurchaseRequests()
  const { data: viewings } = await getIncomingViewingAppointments()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('sales')}</h1>

      <h2 className="text-lg font-semibold mb-3">{t('purchase_requests')}</h2>
      <div className="space-y-3 mb-8">
        {requests.map((req: any) => {
          const vehicle = req.listing?.vehicle
          const img = vehicle?.images?.find((i: any) => i.is_primary) || vehicle?.images?.[0]
          return (
            <div key={req.id} className="border rounded-lg p-4 flex gap-4 items-start">
              <div className="w-20 h-20 rounded-md bg-muted overflow-hidden shrink-0">
                {img ? (
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground">{t('no_image')}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {vehicle?.make?.name} {vehicle?.model?.name} {vehicle?.year}
                </p>
                <p className="text-sm text-muted-foreground">{t('buyer')}: {req.buyer?.full_name || t('anonymous')}</p>
                <p className="text-sm text-muted-foreground">{t('proposed_price')}: {req.proposed_price ? formatPrice(req.proposed_price) : '-'}</p>
                <p className="text-sm mt-1">{t('status')}: {t(req.status)}</p>
                {req.message && (
                  <p className="text-sm text-muted-foreground mt-1 italic">&ldquo;{req.message}&rdquo;</p>
                )}
              </div>
              <SalesClient requestId={req.id} status={req.status} />
            </div>
          )
        })}
        {requests.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">{t('no_requests')}</p>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-3">{t('viewing_appointments')}</h2>
      <div className="space-y-3">
        {viewings.map((v: any) => {
          const vehicle = v.listing?.vehicle
          const img = vehicle?.images?.find((i: any) => i.is_primary) || vehicle?.images?.[0]
          return (
            <div key={v.id} className="border rounded-lg p-4 flex gap-4 items-start">
              <div className="w-20 h-20 rounded-md bg-muted overflow-hidden shrink-0">
                {img ? (
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground">{t('no_image')}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {vehicle?.make?.name} {vehicle?.model?.name} {vehicle?.year}
                </p>
                <p className="text-sm text-muted-foreground">{t('buyer')}: {v.requester?.full_name || t('anonymous')}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(v.appointment_date).toLocaleDateString('en-SA', { dateStyle: 'full' })} - {new Date(v.appointment_date).toLocaleTimeString('en-SA', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-muted-foreground">{v.location}</p>
                <p className="text-sm mt-1">{t('status')}: {t(v.status)}</p>
              </div>
            </div>
          )
        })}
        {viewings.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">{t('no_viewings')}</p>
        )}
      </div>
    </div>
  )
}
