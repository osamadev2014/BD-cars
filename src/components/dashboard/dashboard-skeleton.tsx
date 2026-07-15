'use client'

import { cn } from '@/lib/utils'

interface DashboardSkeletonProps {
  type?: 'stats' | 'table' | 'page' | 'card'
  count?: number
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800',
        className
      )}
    />
  )
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center gap-4">
            <SkeletonBlock className="w-10 h-10" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-6 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <SkeletonBlock className="h-5 w-32" />
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <SkeletonBlock className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
            <SkeletonBlock className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="space-y-3">
        <SkeletonBlock className="h-5 w-32" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
        <div className="pt-3">
          <SkeletonBlock className="h-9 w-24" />
        </div>
      </div>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-48" />
        <SkeletonBlock className="h-8 w-64" />
        <SkeletonBlock className="h-4 w-96" />
      </div>
      <StatsSkeleton />
      <TableSkeleton />
    </div>
  )
}

export function DashboardSkeleton({ type = 'page', count }: DashboardSkeletonProps) {
  if (type === 'stats') {
    if (count) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex items-center gap-4">
                <SkeletonBlock className="w-10 h-10" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-3 w-20" />
                  <SkeletonBlock className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }
    return <StatsSkeleton />
  }

  if (type === 'table') {
    return <TableSkeleton rows={count || 5} />
  }

  if (type === 'card') {
    if (count) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )
    }
    return <CardSkeleton />
  }

  return <PageSkeleton />
}
