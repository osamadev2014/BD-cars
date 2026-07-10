import { getTranslations } from 'next-intl/server'
import { getWallet, getWalletTransactions } from '@/lib/actions/wallet-actions'
import { isStripeConfigured } from '@/lib/payments/stripe'
import { WalletClient } from './wallet-client'
import { TopUpForm } from '@/components/payments/top-up-form'
import { formatPrice } from '@/lib/utils'

export default async function WalletPage() {
  const t = await getTranslations('wallet')
  const wallet = await getWallet()
  const { transactions } = await getWalletTransactions()
  const stripeReady = isStripeConfigured()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>

      <div className="rounded-xl border bg-card p-6 mb-8">
        <p className="text-sm text-muted-foreground">{t('balance')}</p>
        <p className="text-3xl font-bold mt-1">
          {wallet ? formatPrice((wallet as any).balance) : '-'}
        </p>
        {stripeReady ? (
          <div className="mt-6 border-t pt-6">
            <TopUpForm />
          </div>
        ) : (
          <WalletClient />
        )}
      </div>

      <h2 className="text-lg font-semibold mb-4">{t('transactions')}</h2>
      <div className="space-y-2">
        {(transactions as any[]).map((tx: any) => (
          <div key={tx.id} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium text-sm">{tx.description || tx.transaction_type}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(tx.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`font-semibold ${tx.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
              {tx.transaction_type === 'credit' ? '+' : '-'}{formatPrice(tx.amount)}
            </span>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">{t('no_transactions')}</p>
        )}
      </div>
    </div>
  )
}
