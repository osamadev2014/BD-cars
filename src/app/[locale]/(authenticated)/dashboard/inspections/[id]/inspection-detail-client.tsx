'use client'

import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

export function InspectionDetailClient({ appointment, report }: { appointment: any; report: any }) {
  const loc = useLocale()
  const isAr = loc === 'ar'
  const t = useTranslations('inspection')

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-50',
    confirmed: 'text-blue-600 bg-blue-50',
    in_progress: 'text-purple-600 bg-purple-50',
    completed: 'text-green-600 bg-green-50',
    cancelled: 'text-muted-foreground bg-muted',
  }

  return (
    <div className="container mx-auto px-4 py-8" dir={isAr ? 'rtl' : 'ltr'}>
      <Link href="/dashboard/inspections" className="text-sm text-primary hover:underline mb-4 inline-block">&larr; {t('back')}</Link>

      <div className="space-y-6">
        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">{appointment.center?.name_ar || appointment.center?.name}</h1>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[appointment.status] || ''}`}>{t(appointment.status)}</span>
          </div>
          <p className="text-sm text-muted-foreground">{appointment.service?.name_ar || appointment.service?.name}</p>
          <p className="text-sm">{new Date(appointment.appointment_date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
          {appointment.price && <p className="text-sm font-medium mt-1">{Number(appointment.price).toLocaleString()} SAR</p>}
        </div>

        {report && (
          <>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">{t('report_title')}</h2>
                  <p className="text-2xl font-bold">{report.score || '—'}<span className="text-sm">/100</span></p>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {report.estimated_repair_cost && (
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium">{t('estimated_repair_cost')}</span>
                    <span className="font-bold text-primary">{Number(report.estimated_repair_cost).toLocaleString()} SAR</span>
                  </div>
                )}

                {report.sections?.map((section: any) => (
                  <div key={section.id} className="border rounded-lg">
                    <div className="flex items-center justify-between bg-muted px-3 py-1.5 text-sm">
                      <span className="font-medium">{isAr && section.name_ar ? section.name_ar : section.name}</span>
                      <span>{section.score != null ? `${section.score}/${section.max_score}` : '—'}</span>
                    </div>
                    {section.items?.length > 0 && (
                      <div className="divide-y text-sm">
                        {section.items.map((item: any) => (
                          <div key={item.id} className="px-3 py-1.5 flex items-center justify-between">
                            <span>{isAr && item.name_ar ? item.name_ar : item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {report.share_token && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{t('share_report')}</p>
                    <a href={`/${loc}/inspect/report/${report.share_token}`} target="_blank" className="text-sm text-primary hover:underline break-all">
                      {`${typeof window !== 'undefined' ? window.location.origin : ''}/${loc}/inspect/report/${report.share_token}`}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
