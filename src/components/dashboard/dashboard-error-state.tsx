'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function DashboardErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-red-400 dark:text-red-500">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Error</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}
