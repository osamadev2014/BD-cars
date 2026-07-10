'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { updateVehicleRequestStatus } from '@/lib/actions/request-actions'

const STATUS_LABELS: Record<string, string> = { open: 'status_open', found: 'status_found', matched: 'status_matched', closed: 'status_closed' }
const STATUS_COLORS: Record<string, string> = { open: 'bg-blue-100 text-blue-800', found: 'bg-green-100 text-green-800', matched: 'bg-purple-100 text-purple-800', closed: 'bg-gray-100 text-gray-800' }
const ALL_STATUSES = ['open', 'found', 'matched', 'closed']

export function AdminVehicleRequestsClient({ requests }: { requests: any[] }) {
  const t = useTranslations('vehicle_requests')
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id)
    await updateVehicleRequestStatus(id, status, adminNotes || undefined)
    setUpdatingId(null)
    setAdminNotes('')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin_requests')}</h1>

      {requests.length === 0 ? (
        <p className="text-muted-foreground">{t('no_requests')}</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req: any) => (
            <div key={req.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">
                    {req.make?.name || req.make_name || 'Any'} {req.model?.name || req.model_name || ''}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('by')} {req.customer?.full_name || req.customer?.phone || 'Unknown'}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[req.status] || STATUS_COLORS.open}`}>
                  {t(STATUS_LABELS[req.status] || STATUS_LABELS.open)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                {(req.year_from || req.year_to) && <p>{t('year_range')}: {req.year_from || '?'}-{req.year_to || '?'}</p>}
                {(req.budget_min || req.budget_max) && <p>{t('budget')}: {req.budget_min || '?'} - {req.budget_max || '?'} SAR</p>}
                {req.body_type?.name && <p>{req.body_type.name}</p>}
              </div>
              {req.notes && <p className="text-sm mb-3 p-2 bg-muted rounded">{req.notes}</p>}
              {req.admin_notes && <p className="text-xs text-muted-foreground mb-2">{t('admin_response')}: {req.admin_notes}</p>}

              <div className="flex items-center gap-3 pt-2 border-t">
                <select
                  value={req.status}
                  onChange={(e) => handleStatusChange(req.id, e.target.value)}
                  disabled={updatingId === req.id}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{t(STATUS_LABELS[s])}</option>
                  ))}
                </select>
                <input
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={t('admin_notes_placeholder')}
                  className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{new Date(req.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
