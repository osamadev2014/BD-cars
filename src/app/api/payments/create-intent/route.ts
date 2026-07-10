import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { isStripeConfigured, createPaymentIntent } from '@/lib/payments/stripe'

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
    }

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { amount, purpose, entityId } = body

    if (!amount || amount < 10) {
      return NextResponse.json({ error: 'Invalid amount (min 10 SAR)' }, { status: 400 })
    }

    const intent = await createPaymentIntent(amount, 'sar', {
      user_id: user.id,
      purpose: purpose || 'general',
      entity_id: entityId || '',
    })

    const { error: txError } = await (supabase as any)
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        amount,
        total_amount: amount,
        currency: 'SAR',
        status: 'pending',
        reference_id: intent.id,
        entity_type: purpose || 'general',
        entity_id: entityId || null,
        description: body.description || `Payment of ${amount} SAR`,
      })

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 })
    }

    return NextResponse.json({ clientSecret: intent.client_secret, intentId: intent.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
