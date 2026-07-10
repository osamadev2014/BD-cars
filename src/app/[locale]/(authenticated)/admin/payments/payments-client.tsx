'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { togglePaymentProvider } from '@/lib/actions/finance-admin-actions'

export function PaymentsClient({ providers }: { providers: any[] }) {
  const t = useTranslations('admin')
  const router = useRouter()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('payment_providers')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((p: any) => (
          <div key={p.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{p.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${p.is_active ? 'text-green-600 bg-green-50' : 'text-muted-foreground bg-muted'}`}>
                {p.is_active ? t('active') : t('inactive')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{t('slug')}: {p.slug}</p>
            <p className="text-xs text-muted-foreground mb-3">{t('mode')}: {p.is_sandbox ? t('sandbox') : t('live')}</p>
            <button onClick={async () => { await togglePaymentProvider(p.id, !p.is_active); router.refresh() }} className="text-xs text-primary hover:underline">
              {p.is_active ? t('deactivate') : t('activate')}
            </button>
          </div>
        ))}
        {providers.length === 0 && <p className="col-span-full text-center text-muted-foreground">{t('no_entries')}</p>}
      </div>
    </div>
  )
}
