import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
  align?: 'left' | 'center'
  badge?: string
}

export function SectionHeading({ title, subtitle, action, className, align = 'left', badge }: SectionHeadingProps) {
  return (
    <div className={cn(
      'flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8',
      align === 'center' && 'sm:flex-col sm:items-center text-center',
      className
    )}>
      <div className={cn('space-y-1', align === 'center' && 'text-center')}>
        {badge && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-2">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
