import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from './button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  dir?: 'ltr' | 'rtl'
}

function Pagination({ currentPage, totalPages, onPageChange, className, dir = 'ltr' }: PaginationProps) {
  if (totalPages <= 1) return null

  const ChevronPrev = dir === 'rtl' ? ChevronRight : ChevronLeft
  const ChevronNext = dir === 'rtl' ? ChevronLeft : ChevronRight

  function getPages(): (number | 'ellipsis')[] {
    const pages: (number | 'ellipsis')[] = []
    const delta = 1

    pages.push(1)

    if (currentPage - delta > 2) {
      pages.push('ellipsis')
    }

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i)
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push('ellipsis')
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <nav aria-label="pagination" className={cn('mx-auto flex w-full justify-center', className)}>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
        >
          <ChevronPrev className="h-4 w-4" />
        </Button>

        {getPages().map((page, idx) => (
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="flex h-9 w-9 items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'outline'}
              size="icon"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </Button>
          )
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
        >
          <ChevronNext className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  )
}

export { Pagination }
