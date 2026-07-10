'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { approveReport, rejectReport, upsertInspectionCenter } from '@/lib/actions/inspect-report-actions'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-50',
  confirmed: 'text-blue-600 bg-blue-50',
  in_progress: 'text-purple-600 bg-purple-50',
  pending_approval: 'text-orange-600 bg-orange-50',
  completed: 'text-green-600 bg-green-50',
  approved: 'text-green-600 bg-green-50',
  rejected: 'text-red-600 bg-red-50',
  cancelled: 'text-muted-foreground bg-muted',
}

const reportStatusColors: Record<string, string> = {
  in_progress: 'text-purple-600 bg-purple-50',
  pending_approval: 'text-orange-600 bg-orange-50',
  approved: 'text-green-600 bg-green-50',
  rejected: 'text-red-600 bg-red-50',
}

export function AdminInspectionsClient({ appointments, centers, cities }: { appointments: any[]; centers: any[]; cities: any[] }) {
  const t = useTranslations('admin')
  const loc = useLocale()
  const router = useRouter()
  const [tab, setTab] = useState<'appointments' | 'centers'>('appointments')
  const [showCenterForm, setShowCenterForm] = useState(false)
  const [editingCenter, setEditingCenter] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState('')

  const handleApprove = async (reportId: string) => {
    await approveReport(reportId)
    router.refresh()
  }

  const handleReject = async (reportId: string) => {
    const notes = prompt(t('rejection_reason'))
    await rejectReport(reportId, notes || undefined)
    router.refresh()
  }

  const filteredAppointments = statusFilter
    ? appointments.filter((a: any) => a.status === statusFilter)
    : appointments

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('inspections')}</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button onClick={() => setTab('appointments')} className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${tab === 'appointments' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          {t('appointments')} ({appointments.length})
        </button>
        <button onClick={() => setTab('centers')} className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${tab === 'centers' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          {t('centers')} ({centers.length})
        </button>
      </div>

      {tab === 'appointments' && (
        <>
          {/* Status filter */}
          <div className="flex gap-2 flex-wrap">
            {['', 'pending', 'confirmed', 'in_progress', 'pending_approval', 'completed', 'cancelled'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs px-3 py-1 rounded-full border ${statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3">{t('customer')}</th>
                  <th className="text-left p-3">{t('center')}</th>
                  <th className="text-left p-3">{t('service')}</th>
                  <th className="text-left p-3">{t('date')}</th>
                  <th className="text-left p-3">{t('status')}</th>
                  <th className="text-left p-3">{t('report')}</th>
                  <th className="text-left p-3">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app: any) => (
                  <tr key={app.id} className="border-t">
                    <td className="p-3">{app.customer?.full_name || '—'}</td>
                    <td className="p-3 text-muted-foreground">{loc === 'ar' && app.center?.name_ar ? app.center.name_ar : app.center?.name}</td>
                    <td className="p-3 text-muted-foreground">{loc === 'ar' && app.service?.name_ar ? app.service.name_ar : app.service?.name}</td>
                    <td className="p-3 text-xs">{new Date(app.appointment_date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${statusColors[app.status] || ''}`}>{app.status}</span>
                    </td>
                    <td className="p-3">
                      {app.report ? (
                        <span className={`text-xs px-2 py-0.5 rounded ${reportStatusColors[app.report.status] || ''}`}>{app.report.status}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      {app.report?.status === 'pending_approval' && (
                        <div className="flex gap-1">
                          <button onClick={() => handleApprove(app.report.id)} className="text-xs text-green-600 hover:underline">{t('approve')}</button>
                          <button onClick={() => handleReject(app.report.id)} className="text-xs text-red-600 hover:underline">{t('reject')}</button>
                        </div>
                      )}
                      {app.report?.status === 'approved' && app.report.share_token && (
                        <Link href={`/${loc}/inspect/report/${app.report.share_token}`} target="_blank" className="text-xs text-primary hover:underline">{t('view_report')}</Link>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredAppointments.length === 0 && (
                  <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'centers' && (
        <>
          <div className="flex justify-end">
            <button onClick={() => { setEditingCenter(null); setShowCenterForm(!showCenterForm) }} className="text-sm text-primary hover:underline">
              {showCenterForm ? t('cancel') : t('add_center')}
            </button>
          </div>

          {showCenterForm && (
            <form action={async (fd) => {
              await upsertInspectionCenter(fd)
              setShowCenterForm(false)
              router.refresh()
            }} className="border rounded-lg p-4 space-y-3">
              <input type="hidden" name="id" value={editingCenter?.id || 'new'} />
              <div className="grid grid-cols-2 gap-3">
                <input name="name" placeholder={t('center_name')} defaultValue={editingCenter?.name || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
                <input name="name_ar" placeholder={t('center_name_ar')} defaultValue={editingCenter?.name_ar || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="phone" placeholder={t('phone')} defaultValue={editingCenter?.phone || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                <input name="email" placeholder={t('email')} type="email" defaultValue={editingCenter?.email || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <select name="city_id" defaultValue={editingCenter?.city_id || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">{t('select_city')}</option>
                {cities.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input name="address" placeholder={t('address')} defaultValue={editingCenter?.address || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                <input name="address_ar" placeholder={t('address_ar')} defaultValue={editingCenter?.address_ar || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" value="true" defaultChecked={editingCenter ? editingCenter.is_active : true} />
                  {t('active')}
                </label>
                <input name="revenue_share_percentage" type="number" placeholder={t('revenue_share')} defaultValue={editingCenter?.revenue_share_percentage || 80} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <button type="submit" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{t('save')}</button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {centers.map((c: any) => (
              <div key={c.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{loc === 'ar' && c.name_ar ? c.name_ar : c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.city?.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${c.is_active ? 'text-green-600 bg-green-50' : 'text-muted-foreground bg-muted'}`}>
                    {c.is_active ? t('active') : t('inactive')}
                  </span>
                </div>
                {c.phone && <p className="text-xs text-muted-foreground mt-1">{c.phone}</p>}
                <p className="text-xs text-muted-foreground">{t('branches')}: {c.branches?.[0]?.count || 0} | {t('revenue_share')}: {c.revenue_share_percentage || 80}%</p>
              </div>
            ))}
            {centers.length === 0 && <p className="col-span-full text-center text-muted-foreground">{t('no_entries')}</p>}
          </div>
        </>
      )}
    </div>
  )
}
