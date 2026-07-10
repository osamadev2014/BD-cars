'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteSavedSearch, toggleSearchNotify, updateSearchName } from '@/lib/actions/saved-search-actions'

interface SavedSearch {
  id: string
  name: string
  filters: Record<string, string>
  notify: boolean
  created_at: string
  matchCount: number
}

export function SavedSearchesList({ searches: initial }: { searches: SavedSearch[] }) {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const [searches, setSearches] = useState(initial)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const applyFilters = (filters: Record<string, string>) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value)
    }
    router.push(`/${locale}/listings?${params.toString()}`)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSavedSearch(id)
      setSearches((prev) => prev.filter((s) => s.id !== id))
    } catch {}
  }

  const handleToggleNotify = async (id: string, notify: boolean) => {
    try {
      await toggleSearchNotify(id, notify)
      setSearches((prev) => prev.map((s) => (s.id === id ? { ...s, notify } : s)))
    } catch {}
  }

  const handleRename = async (id: string) => {
    if (!editName.trim()) return
    try {
      await updateSearchName(id, editName.trim())
      setSearches((prev) => prev.map((s) => (s.id === id ? { ...s, name: editName.trim() } : s)))
      setEditingId(null)
    } catch {}
  }

  if (searches.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t('no_saved_searches')}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {searches.map((search) => (
        <div key={search.id} className="border rounded-lg p-4 bg-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {editingId === search.id ? (
                <div className="flex gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRename(search.id); if (e.key === 'Escape') setEditingId(null) }}
                    autoFocus
                  />
                  <Button size="sm" onClick={() => handleRename(search.id)}>{t('save')}</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>{t('cancel')}</Button>
                </div>
              ) : (
                <h3
                  className="font-semibold cursor-pointer hover:text-primary"
                  onClick={() => { setEditingId(search.id); setEditName(search.name) }}
                >
                  {search.name}
                </h3>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {t('matches_count', { count: search.matchCount })}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(search.filters).filter(([, v]) => v).map(([key, value]) => (
                  <span key={key} className="text-xs bg-accent px-2 py-0.5 rounded">
                    {key}: {value}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyFilters(search.filters)}
              >
                {t('view_results')}
              </Button>
              <Button
                size="sm"
                variant={search.notify ? 'primary' : 'outline'}
                onClick={() => handleToggleNotify(search.id, !search.notify)}
              >
                {search.notify ? t('notify_on') : t('notify_off')}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(search.id)}
              >
                {t('delete')}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
