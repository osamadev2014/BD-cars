'use client'
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  iconLeft?: ReactNode
  iconRight?: ReactNode
  error?: string
  label?: string
  hint?: string
  size?: 'md' | 'lg'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, iconLeft, iconRight, error, label, hint, size = 'md', ...props }, ref) => {
    const height = size === 'lg' ? 'h-12' : 'h-10'
    const padding = iconLeft ? (size === 'lg' ? 'pl-10' : 'pl-9') : 'px-4'
    const rtlPadding = iconLeft ? 'pr-4' : ''

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className={cn(
              'absolute inset-y-0 left-0 flex items-center pointer-events-none text-muted-foreground',
              size === 'lg' ? 'pl-3.5' : 'pl-3'
            )}>
              {iconLeft}
            </div>
          )}
          {iconRight && (
            <div className={cn(
              'absolute inset-y-0 right-0 flex items-center pointer-events-none text-muted-foreground',
              size === 'lg' ? 'pr-3.5' : 'pr-3'
            )}>
              {iconRight}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex w-full rounded-xl border bg-background text-foreground shadow-sm',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              height,
              padding,
              iconRight && (size === 'lg' ? 'pr-10' : 'pr-9'),
              rtlPadding,
              error
                ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive'
                : 'border-border hover:border-ring focus-visible:border-ring',
              className
            )}
            ref={ref}
            dir="auto"
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-destructive">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
export type { InputProps }
