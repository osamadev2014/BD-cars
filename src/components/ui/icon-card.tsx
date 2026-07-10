import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface IconCardProps {
  icon: ReactNode
  title: string
  description?: string
  href?: string
  onClick?: () => void
  className?: string
  variant?: 'default' | 'accent' | 'outline'
}

export function IconCard({ icon, title, description, href, onClick, className, variant = 'default' }: IconCardProps) {
  const baseClasses = cn(
    'group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer',
    variant === 'default' && 'bg-card border-border hover:shadow-card-hover hover:-translate-y-0.5',
    variant === 'accent' && 'bg-accent-light border-accent/20 hover:bg-accent/10 hover:shadow-md hover:-translate-y-0.5',
    variant === 'outline' && 'bg-transparent border-2 border-dashed border-border hover:border-accent/30 hover:bg-accent-light/50',
    className
  )

  const content = (
    <>
      <div className={cn(
        'flex-shrink-0 flex items-center justify-center rounded-xl transition-colors',
        variant === 'accent'
          ? 'h-12 w-12 bg-accent/15 text-accent group-hover:bg-accent/20'
          : 'h-12 w-12 bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent'
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0 self-center text-muted-foreground group-hover:text-accent transition-colors">
        <ChevronLeft className="h-5 w-5 rtl:hidden" />
        <ChevronRight className="h-5 w-5 hidden rtl:block" />
      </div>
    </>
  )

  if (href) {
    return <Link href={href} className={baseClasses}>{content}</Link>
  }

  return <div onClick={onClick} className={baseClasses} role="button" tabIndex={0}>{content}</div>
}
