'use client'

import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    minor: 'bg-yellow-100 text-yellow-800',
    major: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  }
  return <span className={`text-xs px-2 py-0.5 rounded ${colors[severity] || colors.minor}`}>{severity}</span>
}

function ItemStatus({ status }: { status: string }) {
  const colors: Record<string, string> = {
    good: 'text-green-600 bg-green-50',
    fair: 'text-yellow-600 bg-yellow-50',
    poor: 'text-red-600 bg-red-50',
  }
  return <span className={`text-xs px-2 py-0.5 rounded ${colors[status] || colors.good}`}>{status}</span>
}

export function ReportViewer({ report }: { report: any }) {
  const loc = useLocale()
  const isAr = loc === 'ar'
  const t = useTranslations('inspection')

  const v = report.vehicle
  const a = report.appointment

  return (
    <div className="min-h-screen bg-background py-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{t('report_title')}</h1>
                <p className="text-sm opacity-80 mt-1">{new Date(report.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { dateStyle: 'long' })}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{report.score || '—'}<span className="text-lg opacity-80">/100</span></p>
                <p className="text-xs opacity-80">{t('overall_score')}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="p-6 border-b">
            <div className="flex items-start gap-4">
              {v?.images?.[0] && (
                <img src={v.images[0].url} alt="" className="w-24 h-20 object-cover rounded-lg" />
              )}
              <div>
                <h2 className="text-xl font-bold">{v?.make?.name} {v?.model?.name} {v?.year}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                  {v?.body_type?.name && <span>{v.body_type.name}</span>}
                  {v?.fuel_type?.name && <span>{v.fuel_type.name}</span>}
                  {v?.transmission?.name && <span>{v.transmission.name}</span>}
                  {v?.color?.name && <span>{v.color.name}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
              <span>{t('center')}: {a?.center ? (isAr ? a.center.name_ar : a.center.name) : '—'}</span>
              <span>{t('service')}: {a?.service ? (isAr ? a.service.name_ar : a.service.name) : '—'}</span>
            </div>
          </div>

          {/* Summary */}
          {report.summary && (
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold mb-1">{t('summary')}</h3>
              <p className="text-sm text-muted-foreground">{isAr && report.summary_ar ? report.summary_ar : report.summary}</p>
            </div>
          )}

          {report.recommendation && (
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold mb-1">{t('recommendation')}</h3>
              <p className="text-sm text-muted-foreground">{isAr && report.recommendation_ar ? report.recommendation_ar : report.recommendation}</p>
            </div>
          )}

          {/* Sections */}
          <div className="p-6 space-y-6">
            <h3 className="font-semibold text-lg">{t('sections')}</h3>
            {report.sections?.map((section: any) => (
              <div key={section.id} className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between bg-muted px-4 py-2">
                  <span className="font-medium">{isAr && section.name_ar ? section.name_ar : section.name}</span>
                  <span className="text-sm">{section.score != null ? `${section.score}/${section.max_score}` : '—'}</span>
                </div>
                {section.items?.length > 0 && (
                  <div className="divide-y">
                    {section.items.map((item: any) => (
                      <div key={item.id} className="px-4 py-2 flex items-center justify-between">
                        <div>
                          <span className="text-sm">{isAr && item.name_ar ? item.name_ar : item.name}</span>
                          {item.notes && <p className="text-xs text-muted-foreground">{isAr && item.notes_ar ? item.notes_ar : item.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          {item.severity && <SeverityBadge severity={item.severity} />}
                          <ItemStatus status={item.status || 'good'} />
                          {item.estimated_repair_cost && <span className="text-xs text-muted-foreground">{Number(item.estimated_repair_cost).toLocaleString()} SAR</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Defects */}
          {report.defects?.length > 0 && (
            <div className="px-6 pb-6">
              <h3 className="font-semibold text-lg mb-3">{t('defects')}</h3>
              <div className="space-y-2">
                {report.defects.map((defect: any) => (
                  <div key={defect.id} className="border rounded-lg p-3 flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{isAr && defect.name_ar ? defect.name_ar : defect.name}</p>
                      {defect.description && <p className="text-xs text-muted-foreground">{isAr && defect.description_ar ? defect.description_ar : defect.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={defect.severity} />
                      {defect.estimated_repair_cost && <span className="text-xs font-medium">{Number(defect.estimated_repair_cost).toLocaleString()} SAR</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estimated Repair Cost */}
          {report.estimated_repair_cost && (
            <div className="px-6 py-4 border-t bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{t('estimated_repair_cost')}</span>
                <span className="text-xl font-bold text-primary">{Number(report.estimated_repair_cost).toLocaleString()} SAR</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t text-center text-xs text-muted-foreground">
            <p>{t('report_disclaimer')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
