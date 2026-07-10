import { getTranslations } from 'next-intl/server'
import { requirePermission } from '@/server/guards'
import { getPendingApprovals } from '@/lib/actions/admin-actions'
import { ApprovalsClient } from './approvals-client'

export default async function AdminApprovalsPage() {
  const t = await getTranslations('admin')
  const guard = await requirePermission('approve_listings')
  if (!guard.allowed) {
    return <div className="text-center py-12 text-muted-foreground">{t('access_denied')}</div>
  }

  const approvals = await getPendingApprovals()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('approvals')}</h1>

      <div className="space-y-3">
        {approvals.map((req: any) => {
          const listing = req.listing
          const vehicle = listing?.vehicle
          const img = vehicle?.images?.find((i: any) => i.is_primary) || vehicle?.images?.[0]
          return (
            <div key={req.id} className="border rounded-lg p-4 flex gap-4 items-start">
              <div className="w-24 h-20 rounded-md bg-muted overflow-hidden shrink-0">
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
                <p className="text-sm text-muted-foreground">{t('seller')}: {listing?.seller?.full_name || req.requester?.full_name}</p>
                <p className="text-sm text-muted-foreground">{t('price')}: {listing?.price?.toLocaleString()} SAR</p>
                <p className="text-xs text-muted-foreground">{t('submitted')}: {new Date(req.created_at).toLocaleDateString()}</p>
              </div>
              <ApprovalsClient requestId={req.id} listingId={listing?.id} />
            </div>
          )
        })}
        {approvals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">{t('no_pending')}</div>
        )}
      </div>
    </div>
  )
}
