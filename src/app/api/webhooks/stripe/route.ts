import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { isStripeConfigured, constructWebhookEvent, retrievePaymentIntent } from '@/lib/payments/stripe'

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
    }

    const body = await request.text()
    const sig = request.headers.get('stripe-signature')
    if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

    const event = constructWebhookEvent(body, sig)
    const supabase = getAdminClient()

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object
        const userId = pi.metadata?.user_id
        const purpose = pi.metadata?.purpose

        const { data: tx } = await (supabase as any)
          .from('payment_transactions')
          .select('*')
          .eq('reference_id', pi.id)
          .single()

        if (!tx) {
          return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
        }

        await (supabase as any)
          .from('payment_transactions')
          .update({ status: 'completed' })
          .eq('id', tx.id)

        await (supabase as any).from('payment_status_history').insert({
          transaction_id: tx.id,
          status: 'completed',
          notes: 'Payment confirmed via Stripe webhook',
        })

        if (purpose === 'wallet_topup' && userId) {
          const { data: wallet } = await (supabase as any)
            .from('wallet_accounts')
            .select('*')
            .eq('user_id', userId)
            .single()

          if (wallet) {
            const newBalance = (wallet.balance || 0) + tx.amount
            await (supabase as any)
              .from('wallet_accounts')
              .update({ balance: newBalance })
              .eq('id', wallet.id)

            await (supabase as any).from('wallet_transactions').insert({
              wallet_id: wallet.id,
              transaction_type: 'credit',
              amount: tx.amount,
              balance_before: wallet.balance || 0,
              balance_after: newBalance,
              reference_type: 'wallet_topup',
              reference_id: pi.id,
              description: `Wallet top-up via card`,
            })
          }
        }

        if (purpose === 'subscription' && userId) {
          const planId = pi.metadata?.plan_id
          if (planId) {
            const { data: dealer } = await (supabase as any)
              .from('dealers')
              .select('id')
              .eq('owner_id', userId)
              .single()

            if (dealer) {
              await (supabase as any).from('dealer_subscriptions').insert({
                dealer_id: dealer.id,
                plan_id: planId,
                status: 'active',
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              })
            }
          }
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object
        const { data: tx } = await (supabase as any)
          .from('payment_transactions')
          .select('*')
          .eq('reference_id', pi.id)
          .single()

        if (tx) {
          await (supabase as any)
            .from('payment_transactions')
            .update({ status: 'failed' })
            .eq('id', tx.id)

          await (supabase as any).from('payment_status_history').insert({
            transaction_id: tx.id,
            status: 'failed',
            notes: pi.last_payment_error?.message || 'Payment failed',
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
