'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { saveSearch } from '@/lib/actions/saved-search-actions'

export function SaveSearchDialog() {
  const t = useTranslations('common')
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const hasFilters = Array.from(searchParams.entries()).some(([k]) =>
    ['q', 'make', 'model', 'min_price', 'max_price', 'min_year', 'max_year', 'city', 'body_type', 'fuel_type', 'transmission', 'condition'].includes(k)
  )

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      const filters: Record<string, string> = {}
      for (const [key, value] of searchParams.entries()) {
        if (['q', 'make', 'model', 'min_price', 'max_price', 'min_year', 'max_year', 'city', 'body_type', 'fuel_type', 'transmission', 'condition'].includes(key)) {
          filters[key] = value
        }
      }
      await saveSearch(name.trim(), filters)
      setName('')
      setOpen(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!hasFilters) return null

  return (
    <div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        {t('save_search')}
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-4">{t('save_search')}</h3>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('search_name_placeholder')}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
            />
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            <div className="flex gap-2 mt-4 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>{t('cancel')}</Button>
              <Button onClick={handleSave} disabled={saving || !name.trim()}>{t('save')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
