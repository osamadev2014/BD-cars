import { cn } from '@/lib/utils'

const statusConfig = {
  active: { class: 'bg-success/10 text-success border-success/20', label: { en: 'Active', ar: 'نشط' } },
  inactive: { class: 'bg-muted text-muted-foreground border-border', label: { en: 'Inactive', ar: 'غير نشط' } },
  pending: { class: 'bg-warning/10 text-warning border-warning/20', label: { en: 'Pending', ar: 'قيد الانتظار' } },
  draft: { class: 'bg-secondary text-secondary-foreground border-border', label: { en: 'Draft', ar: 'مسودة' } },
  published: { class: 'bg-success/10 text-success border-success/20', label: { en: 'Published', ar: 'منشور' } },
  sold: { class: 'bg-accent/10 text-accent border-accent/20', label: { en: 'Sold', ar: 'تم البيع' } },
  reserved: { class: 'bg-warning/10 text-warning border-warning/20', label: { en: 'Reserved', ar: 'محجوز' } },
  expired: { class: 'bg-destructive/10 text-destructive border-destructive/20', label: { en: 'Expired', ar: 'منتهي' } },
  rejected: { class: 'bg-destructive/10 text-destructive border-destructive/20', label: { en: 'Rejected', ar: 'مرفوض' } },
  approved: { class: 'bg-success/10 text-success border-success/20', label: { en: 'Approved', ar: 'مقبول' } },
} as const

type StatusKey = keyof typeof statusConfig

interface StatusBadgeProps {
  status: StatusKey | string
  locale?: 'en' | 'ar'
  className?: string
}

export function StatusBadge({ status, locale = 'en', className }: StatusBadgeProps) {
  const config = statusConfig[status as StatusKey]

  if (!config) {
    return (
      <span className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-muted text-muted-foreground border-border',
        className
      )}>
        {status}
      </span>
    )
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.class,
      className
    )}>
      {config.label[locale]}
    </span>
  )
}
