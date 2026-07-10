import { getTranslations } from 'next-intl/server'
import { getUserPurchaseRequests } from '@/lib/actions/buy-actions'
import { formatPrice } from '@/lib/utils'

export default async function MyRequestsPage() {
  const t = await getTranslations('common')
  const { data: requests } = await getUserPurchaseRequests()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('purchase_requests')}</h1>
      <div className="space-y-3">
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
                <p className="text-sm text-muted-foreground">{t('price')}: {formatPrice(req.listing?.price)}</p>
                <p className="text-sm text-muted-foreground">{t('proposed_price')}: {req.proposed_price ? formatPrice(req.proposed_price) : '-'}</p>
                <p className="text-sm mt-1">{t('status')}: {t(req.status)}</p>
              </div>
              <a
                href={`/dashboard/messages`}
                className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                {t('messages')}
              </a>
            </div>
          )
        })}
        {requests.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">{t('no_requests')}</div>
        )}
      </div>
    </div>
  )
}
