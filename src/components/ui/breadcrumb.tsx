import { forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Slash } from 'lucide-react'

interface BreadcrumbProps {
  children: ReactNode
  className?: string
  dir?: 'ltr' | 'rtl'
}

function Breadcrumb({ children, className, dir = 'ltr' }: BreadcrumbProps) {
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight
  return (
    <nav aria-label="breadcrumb" className={cn('flex items-center gap-1 text-sm text-muted-foreground', className)}>
      {children}
    </nav>
  )
}

interface BreadcrumbItemProps {
  children: ReactNode
  href?: string
  isLast?: boolean
  dir?: 'ltr' | 'rtl'
}

function BreadcrumbItem({ children, href, isLast, dir = 'ltr' }: BreadcrumbItemProps) {
  const SeparatorIcon = dir === 'rtl' ? ChevronLeft : ChevronRight

  return (
    <>
      {!isLast && (
        <span className="inline-flex items-center gap-1">
          {href ? (
            <a href={href} className="hover:text-foreground transition-colors">
              {children}
            </a>
          ) : (
            <span className="hover:text-foreground transition-colors">{children}</span>
          )}
          <SeparatorIcon className="h-4 w-4" />
        </span>
      )}
      {isLast && (
        <span className="font-medium text-foreground" aria-current="page">
          {children}
        </span>
      )}
    </>
  )
}

export { Breadcrumb, BreadcrumbItem }
