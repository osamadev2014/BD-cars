'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarProps {
  mode?: 'single' | 'range'
  selected?: Date | [Date, Date]
  onSelect?: (date: Date | [Date, Date] | undefined) => void
  className?: string
  month?: Date
  onMonthChange?: (date: Date) => void
  disabled?: (date: Date) => boolean
  locale?: string
  dir?: 'ltr' | 'rtl'
}

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS_SHORT_AR = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

function Calendar({
  mode = 'single',
  selected,
  onSelect,
  className,
  month: externalMonth,
  onMonthChange,
  disabled,
  locale = 'en',
  dir = 'ltr',
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(new Date())
  const displayMonth = externalMonth ?? internalMonth
  const isRtl = dir === 'rtl'
  const ChevronPrev = isRtl ? ChevronRight : ChevronLeft
  const ChevronNext = isRtl ? ChevronLeft : ChevronRight
  const dayNames = locale === 'ar' ? DAYS_SHORT_AR : DAYS_SHORT
  const monthNames = locale === 'ar' ? MONTHS_AR : MONTHS

  function setMonth(d: Date) {
    setInternalMonth(d)
    onMonthChange?.(d)
  }

  const days = useMemo(() => {
    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const cells: (Date | null)[] = []
    for (let i = 0; i < startPad; i++) {
      cells.push(null)
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push(new Date(year, month, d))
    }
    return cells
  }, [displayMonth])

  function isSelected(d: Date): boolean {
    if (!selected) return false
    if (mode === 'single' && selected instanceof Date) {
      return d.toDateString() === selected.toDateString()
    }
    return false
  }

  function isToday(d: Date): boolean {
    return d.toDateString() === new Date().toDateString()
  }

  function isDisabled(d: Date): boolean {
    return disabled?.(d) ?? false
  }

  function handleSelect(d: Date) {
    if (isDisabled(d)) return
    onSelect?.(d)
  }

  return (
    <div className={cn('p-3', className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={() => setMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1))}>
          <ChevronPrev className="h-4 w-4" />
        </Button>
        <div className="font-medium">
          {monthNames[displayMonth.getMonth()]} {displayMonth.getFullYear()}
        </div>
        <Button variant="outline" size="icon" onClick={() => setMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1))}>
          <ChevronNext className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {dayNames.map((name, i) => (
          <div key={i} className="py-1 font-medium text-muted-foreground">{name}</div>
        ))}
        {days.map((d, i) => (
          <div key={i} className="py-0.5">
            {d ? (
              <button
                type="button"
                onClick={() => handleSelect(d)}
                disabled={isDisabled(d)}
                className={cn(
                  'h-8 w-8 rounded-full text-sm transition-colors',
                  isSelected(d) && 'bg-primary text-primary-foreground',
                  !isSelected(d) && 'hover:bg-accent hover:text-accent-foreground',
                  isToday(d) && !isSelected(d) && 'border border-primary',
                  isDisabled(d) && 'opacity-40 cursor-not-allowed'
                )}
              >
                {d.getDate()}
              </button>
            ) : (
              <div className="h-8 w-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { Calendar }
export type { CalendarProps }
