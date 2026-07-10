import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface SpinnerProps extends ButtonHTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg'
}

function Spinner({ className, size = 'default', ...props }: SpinnerProps) {
  const sizes = { sm: 'h-4 w-4', default: 'h-6 w-6', lg: 'h-8 w-8' }
  return (
    <div role="status" aria-label="Loading" className={cn('flex items-center justify-center', className)} {...props}>
      <Loader2 className={cn('animate-spin text-muted-foreground', sizes[size])} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export { Spinner }
