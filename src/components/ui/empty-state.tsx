import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
  compact?: boolean
}

export function EmptyState({ icon, title, description, action, className, compact }: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      compact ? 'py-8 gap-3' : 'py-16 gap-4',
      className
    )}>
      <div className={cn(
        'rounded-full bg-muted flex items-center justify-center text-muted-foreground',
        compact ? 'h-10 w-10' : 'h-14 w-14'
      )}>
        {icon || <Inbox className={compact ? 'h-5 w-5' : 'h-7 w-7'} />}
      </div>
      <div className="max-w-sm">
        <h3 className={cn(
          'font-semibold text-foreground',
          compact ? 'text-sm' : 'text-base'
        )}>
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
