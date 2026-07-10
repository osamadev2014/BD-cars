import { getTranslations } from 'next-intl/server'
import { getMyInvoices } from '@/lib/actions/invoice-actions'
import { formatPrice } from '@/lib/utils'

export default async function InvoicesPage() {
  const t = await getTranslations('common')
  const wt = await getTranslations('wallet')
  const { invoices } = await getMyInvoices()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{wt('invoices')}</h1>
      <div className="space-y-3">
        {(invoices as any[]).map((inv: any) => (
          <div key={inv.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm">
                {wt('invoice')} #{inv.invoice_number}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {inv.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(inv.created_at).toLocaleDateString()}
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm">{inv.invoice_type}</p>
              <p className="font-semibold">{formatPrice(inv.total_amount)}</p>
            </div>
            {inv.invoice_items?.length > 0 && (
              <details className="mt-2 text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">{wt('items')}</summary>
                <ul className="mt-1 space-y-1 pl-2">
                  {inv.invoice_items.map((item: any) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.description}</span>
                      <span>{formatPrice(item.total_price)}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
        {(invoices as any[]).length === 0 && (
          <p className="text-center py-12 text-muted-foreground">{wt('no_invoices')}</p>
        )}
      </div>
    </div>
  )
}
