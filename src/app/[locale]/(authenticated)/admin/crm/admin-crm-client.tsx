'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export function AdminCrmClient({ customers }: { customers: any[] }) {
  const t = useTranslations('crm')
  const [search, setSearch] = useState('')

  const filtered = customers.filter((c: any) =>
    !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search)
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('customers')}</h1>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={t('search_placeholder')}
        className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">{t('name')}</th>
              <th className="text-left p-3 font-medium">{t('phone')}</th>
              <th className="text-left p-3 font-medium">{t('role')}</th>
              <th className="text-left p-3 font-medium">{t('listings')}</th>
              <th className="text-left p-3 font-medium">{t('tags')}</th>
              <th className="text-left p-3 font-medium">{t('joined')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c: any) => (
              <tr key={c.id} className="border-t hover:bg-muted/50">
                <td className="p-3">
                  <Link href={`/admin/crm/${c.id}`} className="font-medium hover:underline">{c.full_name || 'Unknown'}</Link>
                </td>
                <td className="p-3 text-muted-foreground">{c.phone || '-'}</td>
                <td className="p-3"><span className="text-xs bg-muted px-1.5 py-0.5 rounded">{c.role?.role || 'user'}</span></td>
                <td className="p-3">{c.listings_count?.[0]?.count || 0}</td>
                <td className="p-3">
                  <div className="flex gap-1 flex-wrap">
                    {(c.crm?.tags || []).map((tag: string, i: number) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
