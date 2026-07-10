'use client'
import { cn } from '@/lib/utils'
import { useId } from 'react'

interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export function Checkbox({ checked, onCheckedChange, className }: CheckboxProps) {
  const id = useId()
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={e => onCheckedChange?.(e.target.checked)}
      className={cn('h-4 w-4 rounded border border-input accent-primary', className)}
    />
  )
}
