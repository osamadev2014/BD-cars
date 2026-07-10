import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
  id?: string
}

export function PageContainer({ children, className, as: Tag = 'div', id }: PageContainerProps) {
  return (
    <Tag id={id} className={cn('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </Tag>
  )
}
