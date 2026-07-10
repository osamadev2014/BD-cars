'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function AuditLogClient({ entries }: { entries: any[] }) {
  const t = useTranslations('crm')
  const [filter, setFilter] = useState('')

  const filtered = filter
    ? entries.filter((e: any) => e.event_type?.toLowerCase().includes(filter.toLowerCase()) || e.description?.toLowerCase().includes(filter.toLowerCase()) || e.user?.full_name?.toLowerCase().includes(filter.toLowerCase()))
    : entries

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('audit_log')}</h1>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder={t('filter_placeholder')}
        className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <div className="space-y-1">
        {filtered.map((entry: any) => (
          <div key={entry.id} className="flex items-start gap-3 p-3 border-b hover:bg-muted/30 text-sm">
            <div className="min-w-[120px] text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</div>
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded font-medium min-w-[100px]">{entry.event_type}</span>
            <span className="text-xs text-muted-foreground min-w-[120px]">{entry.user?.full_name || 'System'}</span>
            <p className="text-xs flex-1">{entry.description}</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground py-4">{t('no_entries')}</p>}
      </div>
    </div>
  )
}
