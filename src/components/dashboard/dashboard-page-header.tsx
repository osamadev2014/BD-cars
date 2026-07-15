'use client'

import { DashboardBreadcrumbs } from './dashboard-breadcrumbs'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DashboardPageHeaderProps {
  title: string
  description?: string
  breadcrumbs: BreadcrumbItem[]
  locale: string
  action?: React.ReactNode
}

export function DashboardPageHeader({
  title,
  description,
  breadcrumbs,
  locale,
  action,
}: DashboardPageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <DashboardBreadcrumbs items={breadcrumbs} locale={locale} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  )
}
