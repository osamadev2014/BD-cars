'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DashboardBreadcrumbsProps {
  items: BreadcrumbItem[]
  locale: string
}

export function DashboardBreadcrumbs({ items, locale }: DashboardBreadcrumbsProps) {
  const isRtl = locale === 'ar'

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500" dir={isRtl ? 'rtl' : 'ltr'}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && <span className="text-gray-300 dark:text-gray-600 mx-0.5">/</span>}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && 'text-gray-900 dark:text-white font-medium')}>
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
