'use client'
import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
  label?: string
  error?: string
  iconLeft?: ReactNode
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, label, error, iconLeft, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              {iconLeft}
            </div>
          )}
          <select
            className={cn(
              'flex w-full h-10 rounded-xl border bg-background text-foreground shadow-sm appearance-none cursor-pointer',
              'px-4 py-2 text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
              iconLeft && 'pl-9',
              error
                ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive'
                : 'border-border hover:border-ring focus-visible:border-ring',
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
export type { SelectProps }
