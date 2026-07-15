'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const DRAFT_KEY_PREFIX = 'vehicle_draft_'

export interface VehicleDraft {
  id: string
  makeId?: string
  makeName?: string
  makeNameAr?: string
  model?: string
  year?: string
  category?: string
  mileage?: string
  bodyType?: string
  transmission?: string
  fuelType?: string
  color?: string
  condition?: string
  description?: string
  price?: string
  negotiable?: boolean
  features?: string[]
  paymentOptions?: string[]
  imageUrls?: string[]
  lastUpdated: number
  completionPercent: number
}

function calcCompletion(draft: Partial<VehicleDraft>): number {
  const fields = [
    draft.makeId, draft.model, draft.year,
    draft.category, draft.price,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

export function useVehicleDraft() {
  const getSavedDrafts = useCallback((): VehicleDraft[] => {
    if (typeof window === 'undefined') return []
    const keys = Object.keys(localStorage).filter(k => k.startsWith(DRAFT_KEY_PREFIX))
    return keys.map(k => {
      try { return JSON.parse(localStorage.getItem(k) || '{}') }
      catch { return null }
    }).filter(Boolean)
  }, [])

  const [drafts, setDrafts] = useState<VehicleDraft[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setDrafts(getSavedDrafts()) }, [getSavedDrafts])

  const saveDraft = useCallback((data: Partial<VehicleDraft>, draftId?: string) => {
    const id = draftId || `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const existing = localStorage.getItem(DRAFT_KEY_PREFIX + id)
    const prev = existing ? JSON.parse(existing) : {}
    const draft: VehicleDraft = {
      ...prev,
      ...data,
      id,
      lastUpdated: Date.now(),
      completionPercent: calcCompletion({ ...prev, ...data }),
    }
    localStorage.setItem(DRAFT_KEY_PREFIX + id, JSON.stringify(draft))
    setDrafts(getSavedDrafts())
    return id
  }, [getSavedDrafts])

  const autoSaveDraft = useCallback((data: Partial<VehicleDraft>, draftId?: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => saveDraft(data, draftId), 1500)
    return draftId
  }, [saveDraft])

  const deleteDraft = useCallback((id: string) => {
    localStorage.removeItem(DRAFT_KEY_PREFIX + id)
    setDrafts(getSavedDrafts())
  }, [getSavedDrafts])

  const getDraft = useCallback((id: string): VehicleDraft | null => {
    const raw = localStorage.getItem(DRAFT_KEY_PREFIX + id)
    return raw ? JSON.parse(raw) : null
  }, [])

  return { drafts, saveDraft, autoSaveDraft, deleteDraft, getDraft }
}