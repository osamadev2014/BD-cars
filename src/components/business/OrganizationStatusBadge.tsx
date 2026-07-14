import { cn } from '@/lib/utils'

interface OrgStatusBadgeProps {
  status: string
  isActive?: boolean
  locale?: 'ar' | 'en'
  className?: string
}

const statusMap: Record<string, { ar: string; en: string; class: string }> = {
  active: {
    ar: 'نشطة',
    en: 'Active',
    class: 'bg-emerald-50/80 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
  },
  pending_approval: {
    ar: 'قيد المراجعة',
    en: 'Under Review',
    class: 'bg-amber-50/80 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
  },
  incomplete: {
    ar: 'تحتاج استكمال',
    en: 'Incomplete',
    class: 'bg-orange-50/80 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800',
  },
  suspended: {
    ar: 'موقوفة',
    en: 'Suspended',
    class: 'bg-red-50/80 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
  },
  rejected: {
    ar: 'مرفوضة',
    en: 'Rejected',
    class: 'bg-red-50/80 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
  },
  invite_pending: {
    ar: 'الدعوة بانتظار القبول',
    en: 'Invitation Pending',
    class: 'bg-blue-50/80 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
  },
}

function Dot({ className }: { className?: string }) {
  return (
    <span className={cn('inline-block w-1.5 h-1.5 rounded-full', className)} aria-hidden="true" />
  )
}

export function OrganizationStatusBadge({ status, isActive, locale = 'ar', className }: OrgStatusBadgeProps) {
  const key = status === 'invited' ? 'invite_pending' : status

  if (key === 'active' && !isActive) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50/80 text-gray-500 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700',
        className
      )}>
        <Dot className="bg-gray-400" />
        {locale === 'ar' ? 'غير نشطة' : 'Inactive'}
      </span>
    )
  }

  const config = statusMap[key]
  if (!config) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50/80 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700',
        className
      )}>
        {status}
      </span>
    )
  }

  const dotColor = key === 'active' ? 'bg-emerald-500' :
    key === 'pending_approval' ? 'bg-amber-500' :
    key === 'incomplete' ? 'bg-orange-500' :
    key === 'suspended' || key === 'rejected' ? 'bg-red-500' :
    key === 'invite_pending' ? 'bg-blue-500' : 'bg-gray-400'

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.class,
      className
    )}>
      <Dot className={dotColor} />
      {locale === 'ar' ? config.ar : config.en}
    </span>
  )
}

export { statusMap }
