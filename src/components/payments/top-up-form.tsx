'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createTopUpIntent, confirmWalletTopUp } from '@/lib/actions/payment-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StripeProvider } from './stripe-provider'

function TopUpFormInner({ onDone }: { onDone: () => void }) {
  const t = useTranslations('wallet')
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (submitError) {
      setError(submitError.message || 'Payment failed')
      setLoading(false)
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const intentId = urlParams.get('payment_intent')
    if (intentId) {
      await confirmWalletTopUp(intentId)
    }
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? t('processing') : t('pay_now')}
      </Button>
    </form>
  )
}

export function TopUpForm() {
  const t = useTranslations('wallet')
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'amount' | 'payment'>('amount')
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async () => {
    const amt = parseInt(amount)
    if (!amt || amt < 10) { setError(t('min_amount_error')); return }
    setLoading(true)
    setError('')
    const result = await createTopUpIntent(amt)
    if (result.success && result.clientSecret) {
      setClientSecret(result.clientSecret)
      setStep('payment')
    } else {
      setError(result.error === 'PAYMENT_NOT_CONFIGURED' ? t('payment_not_configured') : (result.error || t('error')))
    }
    setLoading(false)
  }

  const handleDone = () => {
    router.refresh()
    setStep('amount')
    setAmount('')
    setClientSecret('')
  }

  if (step === 'payment') {
    return (
      <StripeProvider clientSecret={clientSecret}>
        <div className="space-y-4">
          <h3 className="font-semibold">{t('enter_card_details')}</h3>
          <TopUpFormInner onDone={handleDone} />
          <Button variant="outline" className="w-full" onClick={() => setStep('amount')}>
            {t('back')}
          </Button>
        </div>
      </StripeProvider>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{t('top_up_wallet')}</h3>
      <div className="flex gap-2">
        <Input
          type="number"
          min="10"
          placeholder={t('amount_placeholder')}
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <Button onClick={handleStart} disabled={loading}>
          {loading ? t('processing') : t('top_up')}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
