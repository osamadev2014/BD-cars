import { getTranslations } from 'next-intl/server'
import { getMyVehicleRequests } from '@/lib/actions/request-actions'
import Link from 'next/link'

const STATUS_LABELS: Record<string, string> = { open: 'status_open', found: 'status_found', matched: 'status_matched', closed: 'status_closed' }
const STATUS_COLORS: Record<string, string> = { open: 'bg-blue-100 text-blue-800', found: 'bg-green-100 text-green-800', matched: 'bg-purple-100 text-purple-800', closed: 'bg-gray-100 text-gray-800' }

export default async function VehicleRequestsPage() {
  const t = await getTranslations('vehicle_requests')
  const requests = await getMyVehicleRequests()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('my_requests')}</h1>
        <Link href="/request" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
          {t('new_request')}
        </Link>
      </div>

      {requests.length === 0 ? (
        <p className="text-muted-foreground">{t('no_requests')}</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req: any) => (
            <div key={req.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">
                  {req.make?.name || req.make_name || t('any_make')} {req.model?.name || req.model_name || ''}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[req.status] || STATUS_COLORS.open}`}>
                  {t(STATUS_LABELS[req.status] || STATUS_LABELS.open)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                {(req.year_from || req.year_to) && (
                  <p>{t('year_range')}: {req.year_from || '?'} - {req.year_to || '?'}</p>
                )}
                {(req.budget_min || req.budget_max) && (
                  <p>{t('budget')}: {req.budget_min ? `${req.budget_min} SAR` : ''} - {req.budget_max ? `${req.budget_max} SAR` : ''}</p>
                )}
                {req.body_type?.name && <p>{t('body_type')}: {req.body_type.name}</p>}
              </div>
              {req.notes && <p className="text-sm mt-2 text-muted-foreground">{req.notes}</p>}
              {req.admin_notes && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <span className="text-xs font-medium text-muted-foreground">{t('admin_response')}:</span> {req.admin_notes}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">{new Date(req.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
