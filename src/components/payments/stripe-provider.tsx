'use client'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import type { ReactNode } from 'react'

const stripePk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
let stripePromise: ReturnType<typeof loadStripe> | null = null

function getStripePromise() {
  if (!stripePromise && stripePk && stripePk !== 'pk_test_placeholder') {
    stripePromise = loadStripe(stripePk)
  }
  return stripePromise
}

export function StripeProvider({ children, clientSecret }: { children: ReactNode; clientSecret?: string }) {
  const stripe = getStripePromise()
  if (!stripe || !clientSecret) return <>{children}</>
  return <Elements stripe={stripe} options={{ clientSecret }}>{children}</Elements>
}
