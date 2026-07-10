import { getTranslations } from 'next-intl/server'
import { getSubscriptionPlans } from '@/lib/actions/dealer-actions'
import { isStripeConfigured } from '@/lib/payments/stripe'
import { PlansClient } from './plans-client'

export default async function PlansPage() {
  const t = await getTranslations('dealers')
  const plans = await getSubscriptionPlans()
  const stripeReady = isStripeConfigured()

  return <PlansClient plans={plans} stripeReady={stripeReady} />
}
