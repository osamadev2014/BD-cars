'use client'
import { forwardRef, type InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onClear?: () => void
  size?: 'md' | 'lg'
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, size = 'md', ...props }, ref) => {
    const height = size === 'lg' ? 'h-12' : 'h-10'

    return (
      <div className="relative w-full">
        <div className={cn(
          'absolute inset-y-0 left-0 flex items-center pointer-events-none text-muted-foreground',
          size === 'lg' ? 'pl-4' : 'pl-3.5'
        )}>
          <Search className={cn(size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} />
        </div>
        <input
          value={value}
          className={cn(
            'flex w-full rounded-xl border border-border bg-background text-foreground shadow-sm',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
            'hover:border-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            height,
            size === 'lg' ? 'pl-11 pr-11' : 'pl-9 pr-9',
            className
          )}
          ref={ref}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'absolute inset-y-0 right-0 flex items-center text-muted-foreground hover:text-foreground transition-colors',
              size === 'lg' ? 'pr-4' : 'pr-3.5'
            )}
          >
            <X className={cn(size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

export { SearchInput }
export type { SearchInputProps }
