'use client'

import { useLocale } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, CheckCircle2, XCircle, Building2 } from 'lucide-react'

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-600',
    label: { ar: 'قيد المراجعة', en: 'Pending Review' },
  },
  active: {
    icon: CheckCircle2,
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600',
    label: { ar: 'تمت الموافقة', en: 'Approved' },
  },
  rejected: {
    icon: XCircle,
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600',
    label: { ar: 'مرفوض', en: 'Rejected' },
  },
}

export function PendingStatusCard({
  org,
  status,
}: {
  org: any
  status: 'pending' | 'active' | 'rejected'
}) {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const config = STATUS_CONFIG[status]
  const Icon = config.icon
  const orgTypeLabel = (org as any).org_type?.replace(/_/g, ' ')

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`h-12 w-12 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
          <Building2 className={`h-6 w-6 ${config.text}`} />
        </div>
        <div className="flex-1 min-w-0" dir={isRtl ? 'rtl' : 'ltr'}>
          <p className="font-semibold truncate">{org.name_ar || org.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{isRtl ? `(${orgTypeLabel})` : orgTypeLabel}</p>
          {status === 'rejected' && org.status_notes && (
            <p className="text-xs text-red-600 mt-1">{org.status_notes}</p>
          )}
        </div>
        <div className="shrink-0 text-center">
          <div className={`h-9 w-9 rounded-full ${config.bg} flex items-center justify-center mx-auto`}>
            <Icon className={`h-5 w-5 ${config.text}`} />
          </div>
          <p className={`text-xs font-medium mt-1 ${config.text}`}>
            {config.label[isRtl ? 'ar' : 'en']}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
