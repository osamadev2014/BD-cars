'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createSubscriptionIntent } from '@/lib/actions/payment-actions'
import { Button } from '@/components/ui/button'
import { StripeProvider } from './stripe-provider'

function CheckoutInner({ planName, onDone }: { planName: string; onDone: () => void }) {
  const t = useTranslations('common')
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

    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">{t('subscription_plan')}: {planName}</p>
      <PaymentElement />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? t('processing') : t('pay_now')}
      </Button>
    </form>
  )
}

interface SubscriptionCheckoutProps {
  planId: string
  planName: string
  onClose: () => void
}

export function SubscriptionCheckout({ planId, planName, onClose }: SubscriptionCheckoutProps) {
  const t = useTranslations('common')
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async () => {
    setLoading(true)
    setError('')
    const result = await createSubscriptionIntent(planId)
    if (result.success && result.clientSecret) {
      setClientSecret(result.clientSecret)
    } else {
      setError(result.error === 'PAYMENT_NOT_CONFIGURED' ? t('payment_not_configured') : (result.error || t('error')))
    }
    setLoading(false)
  }

  const handleDone = () => {
    router.refresh()
    onClose()
  }

  if (!clientSecret) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium">{t('subscribe_to')} {planName}</p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={handleStart} disabled={loading}>
            {loading ? t('processing') : t('continue_to_payment')}
          </Button>
          <Button variant="outline" onClick={onClose}>{t('cancel')}</Button>
        </div>
      </div>
    )
  }

  return (
    <StripeProvider clientSecret={clientSecret}>
      <CheckoutInner planName={planName} onDone={handleDone} />
      <Button variant="outline" className="w-full mt-2" onClick={onClose}>{t('cancel')}</Button>
    </StripeProvider>
  )
}
