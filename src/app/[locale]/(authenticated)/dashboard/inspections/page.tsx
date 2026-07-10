'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'
import { getUserInspections, cancelInspection } from '@/lib/actions/inspection-actions'
import { createInspectionReport } from '@/lib/actions/inspect-report-actions'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-50',
  confirmed: 'text-blue-600 bg-blue-50',
  in_progress: 'text-purple-600 bg-purple-50',
  completed: 'text-green-600 bg-green-50',
  cancelled: 'text-muted-foreground bg-muted',
}

export default function InspectionsPage() {
  const t = useTranslations('inspection')
  const loc = useLocale()
  const { user } = useAuth()
  const [inspections, setInspections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await getUserInspections()
    setInspections(data as any[])
    setLoading(false)
  }

  useEffect(() => {
    if (user) load()
  }, [user])

  if (!user) return null

  const handleCancel = async (id: string) => {
    await cancelInspection(id)
    load()
  }

  const handleStartReport = async (id: string) => {
    const result = await createInspectionReport(id)
    if (result.success) load()
    else alert(result.error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>

      {loading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
      ) : inspections.length === 0 ? (
        <div className="border rounded-lg bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">{t('no_inspections')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inspections.map((insp: any) => (
            <div key={insp.id} className="border rounded-lg p-4 bg-card">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">{insp.center?.name_ar || insp.center?.name}</p>
                  <p className="text-sm text-muted-foreground">{insp.service?.name_ar || insp.service?.name}</p>
                  <p className="text-sm">{new Date(insp.appointment_date).toLocaleDateString(loc === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'long' })}</p>
                  {insp.price && <p className="text-sm font-medium">{Number(insp.price).toLocaleString()} SAR</p>}
                </div>
                <div className="text-right space-y-2">
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ${statusColors[insp.status] || 'bg-muted text-muted-foreground'}`}>
                    {t(insp.status) || insp.status}
                  </span>
                  <div className="flex flex-col gap-1">
                    {insp.status === 'pending' && (
                      <button onClick={() => handleCancel(insp.id)} className="text-xs text-destructive hover:underline">{t('cancel')}</button>
                    )}
                    {insp.status === 'confirmed' && (
                      <button onClick={() => handleStartReport(insp.id)} className="text-xs text-primary hover:underline">{t('start_report')}</button>
                    )}
                    {insp.report && (
                      <Link href={`/dashboard/inspections/${insp.id}`} className="text-xs text-primary hover:underline">{t('view_report')}</Link>
                    )}
                  </div>
                </div>
              </div>
              {insp.listing && (
                <p className="text-xs text-muted-foreground mt-2">
                  {insp.listing.vehicle?.make?.name} {insp.listing.vehicle?.model?.name} ({insp.listing.vehicle?.year})
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
