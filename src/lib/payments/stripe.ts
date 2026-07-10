import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key || key === 'sk_test_placeholder') {
      throw new Error('Stripe secret key not configured')
    }
    stripeInstance = new Stripe(key)
  }
  return stripeInstance
}

export function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key || key === 'pk_test_placeholder') return ''
  return key
}

export function isStripeConfigured(): boolean {
  const sk = process.env.STRIPE_SECRET_KEY
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  return !!sk && sk !== 'sk_test_placeholder' && !!pk && pk !== 'pk_test_placeholder'
}

export async function createPaymentIntent(amount: number, currency = 'sar', metadata?: Record<string, string>) {
  const stripe = getStripe()
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    metadata,
    automatic_payment_methods: { enabled: true },
  })
}

export async function retrievePaymentIntent(id: string) {
  const stripe = getStripe()
  return stripe.paymentIntents.retrieve(id)
}

export function constructWebhookEvent(body: string | Buffer, sig: string) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || secret === 'whsec_placeholder') {
    throw new Error('Stripe webhook secret not configured')
  }
  return stripe.webhooks.constructEvent(body, sig, secret)
}
