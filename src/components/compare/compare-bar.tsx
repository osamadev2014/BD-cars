'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useCompare } from './compare-button'
import { useEffect, useState } from 'react'

export function CompareBar() {
  const t = useTranslations('compare')
  const { ids, remove, clear } = useCompare()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted || ids.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{t('comparing')} ({ids.length}/3)</span>
          <div className="flex gap-2">
            {ids.map((id) => (
              <span key={id} className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1">
                {id.slice(0, 8)}...
                <button onClick={() => remove(id)} className="text-muted-foreground hover:text-foreground">&times;</button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground">{t('clear')}</button>
          <Link
            href={`/compare?ids=${ids.join(',')}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t('view_comparison')}
          </Link>
        </div>
      </div>
    </div>
  )
}
