'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

const STORAGE_KEY = 'bd_compare'

function getStored(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function setStored(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event('compare-update'))
}

export function useCompare() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    setIds(getStored())
    const handler = () => setIds(getStored())
    window.addEventListener('compare-update', handler)
    return () => window.removeEventListener('compare-update', handler)
  }, [])

  const add = (id: string) => {
    const current = getStored()
    if (current.includes(id) || current.length >= 3) return
    setStored([...current, id])
  }

  const remove = (id: string) => {
    setStored(getStored().filter((i: string) => i !== id))
  }

  const clear = () => setStored([])

  return { ids, add, remove, clear }
}

export function CompareButton({ listingId, listing }: { listingId: string; listing?: { title?: string; image?: string; price?: string } }) {
  const t = useTranslations('compare')
  const { ids, add, remove } = useCompare()
  const inCompare = ids.includes(listingId)
  const disabled = ids.length >= 3 && !inCompare

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); inCompare ? remove(listingId) : add(listingId) }}
      className={`text-xs px-2 py-1 rounded border transition-colors ${
        inCompare
          ? 'bg-primary text-primary-foreground border-primary'
          : disabled
            ? 'border-muted text-muted-foreground cursor-not-allowed'
            : 'border-input hover:bg-accent'
      }`}
      disabled={disabled}
    >
      {inCompare ? t('in_compare') : t('compare')}
    </button>
  )
}
