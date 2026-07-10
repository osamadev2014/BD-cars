'use client'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

const variants = {
  primary:
    'bg-primary text-primary-foreground shadow-sm hover:bg-primary/80 active:bg-primary/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  secondary:
    'bg-background text-secondary-foreground border border-border shadow-sm hover:bg-muted hover:border-ring active:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground active:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ghost:
    'text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  destructive:
    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80 active:bg-destructive/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  success:
    'bg-success text-success-foreground shadow-sm hover:bg-success/80 active:bg-success/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  premium:
    'bg-gradient-to-r from-premium-from to-premium-to text-premium-foreground shadow-sm hover:shadow-md hover:brightness-110 active:brightness-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
} as const

const sizes = {
  sm: 'h-9 px-4 text-sm gap-1.5 rounded-xl',
  md: 'h-10 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-sm gap-2 rounded-xl',
  xl: 'h-14 px-8 text-base gap-2.5 rounded-xl',
  icon: 'h-10 w-10 rounded-xl',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, iconLeft, iconRight, fullWidth, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150',
          'focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          'select-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" className={cn(size === 'lg' || size === 'xl' ? 'h-5 w-5' : 'h-4 w-4')} />
        ) : iconLeft ? (
          <span className="flex-shrink-0">{iconLeft}</span>
        ) : null}
        {children}
        {!loading && iconRight ? <span className="flex-shrink-0">{iconRight}</span> : null}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, variants as buttonVariants, sizes as buttonSizes }
export type { ButtonProps }
