'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Search, MapPin, Check, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Branch {
  id: string
  name: string
  nameAr?: string
  city?: string
  cityAr?: string
  status: string
}

interface BranchSelectorModalProps {
  open: boolean
  onClose: () => void
  locale: string
  orgId: string
  currentBranchId?: string
  onSelect: (branch: Branch) => void
}

export function BranchSelectorModal({
  open,
  onClose,
  locale,
  orgId,
  currentBranchId,
  onSelect,
}: BranchSelectorModalProps) {
  const isRtl = locale === 'ar'
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true)
    async function fetchBranches() {
      try {
        const res = await fetch(`/api/v1/dashboard/branches?orgId=${orgId}`)
        if (res.ok) {
          const json = await res.json()
          setBranches(json.data || [])
        } else {
          setBranches([])
        }
      } catch {
        setBranches([])
      } finally {
        setLoading(false)
      }
    }
    fetchBranches()
  }, [open, orgId])

  const filtered = search
    ? branches.filter((b) => {
        const q = search.toLowerCase()
        return b.name.toLowerCase().includes(q) || (b.nameAr?.toLowerCase().includes(q)) || (b.city?.toLowerCase().includes(q)) || (b.cityAr?.toLowerCase().includes(q))
      })
    : branches

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isRtl ? 'اختيار الفرع' : 'Select Branch'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isRtl ? 'ابحث عن فرع...' : 'Search branches...'}
            className="w-full h-10 pr-10 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isRtl ? 'لا توجد فروع' : 'No branches found'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((branch) => {
              const selected = branch.id === currentBranchId
              return (
                <button
                  key={branch.id}
                  onClick={() => { onSelect(branch); onClose() }}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all duration-200',
                    selected
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                    selected ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  )}>
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {isRtl && branch.nameAr ? branch.nameAr : branch.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {isRtl && branch.cityAr ? branch.cityAr : branch.city || ''}
                    </p>
                  </div>
                  {selected && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}