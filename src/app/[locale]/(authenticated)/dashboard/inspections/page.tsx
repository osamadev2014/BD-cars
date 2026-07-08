'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'
import { getUserInspections, cancelInspection } from '@/lib/actions/inspection-actions'

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-50',
  confirmed: 'text-blue-600 bg-blue-50',
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
                  {insp.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(insp.id)}
                      className="block text-xs text-destructive hover:underline w-full"
                    >
                      {t('cancel')}
                    </button>
                  )}
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
