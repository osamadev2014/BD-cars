import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-gray-50 text-gray-700 border-gray-200',
  secondary: 'bg-secondary text-secondary-foreground border-transparent',
  destructive: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  outline: 'text-foreground border-border bg-transparent',
  premium: 'bg-gradient-to-r from-premium-from to-premium-to text-premium-foreground border-transparent',
} as const

const sizes = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
} as const

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

function Badge({ className, variant = 'default', size = 'md', iconLeft, iconRight, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
      {children}
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </div>
  )
}

export { Badge, variants as badgeVariants }
export type { BadgeProps }
