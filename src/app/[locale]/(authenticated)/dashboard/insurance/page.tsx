import { getTranslations } from 'next-intl/server'
import { getInsuranceRequests } from '@/lib/actions/insurance-actions'
import { formatPrice } from '@/lib/utils'

export default async function InsuranceRequestsPage() {
  const t = await getTranslations('insurance')
  const requests = await getInsuranceRequests()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('my_requests')}</h1>
      <div className="space-y-3">
        {requests.map((req: any) => {
          const vehicle = req.listing?.vehicle
          const img = vehicle?.images?.find((i: any) => i.is_primary) || vehicle?.images?.[0]
          return (
            <div key={req.id} className="rounded-lg border p-4 flex gap-4 items-start">
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
                <p className="text-sm text-muted-foreground">{t('vehicle_price')}: {formatPrice(req.vehicle_price || 0)}</p>
                {req.insurance_type && <p className="text-sm text-muted-foreground">{t('type')}: {req.insurance_type}</p>}
                {req.partner && <p className="text-xs text-muted-foreground">{req.partner.name || req.partner.name_ar}</p>}
                <p className="text-sm mt-1">{t('status')}: {t(req.status)}</p>
              </div>
            </div>
          )
        })}
        {requests.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">{t('no_requests')}</p>
        )}
      </div>
    </div>
  )
}
