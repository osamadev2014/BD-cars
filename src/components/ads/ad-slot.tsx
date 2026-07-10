'use client'

import { Suspense, lazy } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const AdBanner = lazy(() => import('./ad-banner').then((m) => ({ default: m.AdBanner })))

interface AdSlotProps {
  placementKey: string
  className?: string
  fallback?: React.ReactNode
}

export function AdSlot({ placementKey, className, fallback }: AdSlotProps) {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className={cn('w-full', className)}>
            <Skeleton className="w-full h-24 rounded-lg" />
          </div>
        )
      }
    >
      <AdBanner placementKey={placementKey} className={className} />
    </Suspense>
  )
}
