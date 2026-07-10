'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { topUpWallet } from '@/lib/actions/wallet-actions'
import { Button } from '@/components/ui/button'

const PRESETS = [100, 500, 1000, 5000]

export function WalletClient() {
  const t = useTranslations('wallet')
  const [amount, setAmount] = useState(500)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleTopUp = async () => {
    if (amount < 10) return
    setLoading(true)
    setMessage('')
    const result = await topUpWallet(amount)
    if (result.success) {
      setMessage(t('topup_success'))
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage(result.error || t('topup_error'))
    }
    setLoading(false)
  }

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm font-medium">{t('topup_title')}</p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setAmount(p)}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              amount === p ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-accent'
            }`}
          >
            {p.toLocaleString()} {t('currency')}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {t('currency')}
          </span>
          <input
            type="number"
            min={10}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="flex h-10 w-32 rounded-md border border-input bg-background px-8 py-2 text-sm"
          />
        </div>
        <Button onClick={handleTopUp} disabled={loading || amount < 10}>
          {loading ? t('processing') : t('topup_button')}
        </Button>
      </div>
      {message && (
        <p className={`text-sm ${message.includes('success') || message.includes('تم') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
