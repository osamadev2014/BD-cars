'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { deleteComparison } from '@/lib/actions/compare-actions'

interface Comparison {
  id: string
  name: string
  listings: string[]
  created_at: string
}

export function ComparisonsList({ comparisons: initial }: { comparisons: Comparison[] }) {
  const t = useTranslations('common')
  const router = useRouter()
  const [comparisons, setComparisons] = useState(initial)

  const handleDelete = async (id: string) => {
    try {
      await deleteComparison(id)
      setComparisons((prev) => prev.filter((c) => c.id !== id))
    } catch {}
  }

  if (comparisons.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t('no_saved_comparisons')}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {comparisons.map((c) => (
        <div key={c.id} className="border rounded-lg p-4 bg-card flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-sm text-muted-foreground">{c.listings.length} {t('vehicles')}</p>
            <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/compare?ids=${c.listings.join(',')}`}
              className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90"
            >
              {t('view')}
            </a>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-sm text-destructive hover:underline"
            >
              {t('delete')}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
