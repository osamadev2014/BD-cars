import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'

interface PriceDisplayProps {
  price: number
  originalPrice?: number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  suffix?: string
  locale?: string
}

export function PriceDisplay({ price, originalPrice, size = 'md', className, suffix }: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold',
  }

  return (
    <div className={cn('flex items-baseline gap-1.5', className)}>
      <span className={cn('text-accent', sizeClasses[size])}>
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
      {suffix && (
        <span className="text-xs text-muted-foreground">{suffix}</span>
      )}
    </div>
  )
}
