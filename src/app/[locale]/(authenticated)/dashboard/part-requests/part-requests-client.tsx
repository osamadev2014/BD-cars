'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function PartRequestsClient({ requests }: { requests: any[] }) {
  const t = useTranslations('parts')

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t('my_requests')}</h1>
      {requests.length === 0 && <p className="text-muted-foreground text-sm">{t('no_requests')}</p>}
      {requests.map((r: any) => (
        <Link key={r.id} href={`/dashboard/part-requests/${r.id}`} className="block border rounded-lg p-4 hover:bg-accent transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{r.part_name}</p>
              <p className="text-xs text-muted-foreground">{r.make} {r.model} {r.year}</p>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-0.5 rounded ${
                r.status === 'submitted' ? 'text-yellow-600 bg-yellow-50' :
                r.status === 'quotes_received' ? 'text-blue-600 bg-blue-50' :
                r.status === 'order_created' ? 'text-green-600 bg-green-50' :
                'text-muted-foreground bg-muted'
              }`}>{r.status}</span>
              <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
