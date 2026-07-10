'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SubscriptionCheckout } from '@/components/payments/subscription-checkout'
export function PlansClient({ plans, stripeReady }: { plans: any[]; stripeReady?: boolean }) {
  const t = useTranslations('dealers')
  const ct = useTranslations('common')
  const router = useRouter()
  const [checkoutPlan, setCheckoutPlan] = useState<{ id: string; name: string } | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('plans_title')}</h1>
        <p className="text-muted-foreground">{t('plans_subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {plans.map((plan: any) => (
          <div key={plan.id} className={`border rounded-lg p-6 flex flex-col ${plan.price_monthly === 0 ? 'border-muted' : 'border-primary/20'}`}>
            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            {plan.name_ar && <p className="text-xs text-muted-foreground mb-3">{plan.name_ar}</p>}
            <p className="text-3xl font-bold mb-1">
              {plan.price_monthly === 0 ? t('free') : `${plan.price_monthly} SAR`}
            </p>
            {plan.price_monthly > 0 && <p className="text-xs text-muted-foreground mb-4">{t('per_month')}</p>}
            {plan.price_yearly > 0 && (
              <p className="text-xs text-muted-foreground mb-4">{plan.price_yearly} SAR/yr ({t('save')} {Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100)}%)</p>
            )}
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
            <ul className="space-y-2 text-sm mb-6 flex-1">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> {t('listings')}: {plan.max_listings === -1 ? t('unlimited') : plan.max_listings}
              </li>
              <li className="flex items-center gap-2">
                <span className={plan.max_staff > 0 ? 'text-green-600' : 'text-muted-foreground'}>{plan.max_staff > 0 ? '✓' : '✗'}</span> {t('staff_accounts')}: {plan.max_staff === -1 ? t('unlimited') : plan.max_staff}
              </li>
              <li className="flex items-center gap-2">
                <span className={plan.has_analytics ? 'text-green-600' : 'text-muted-foreground'}>{plan.has_analytics ? '✓' : '✗'}</span> {t('analytics')}
              </li>
              <li className="flex items-center gap-2">
                <span className={plan.has_wholesale ? 'text-green-600' : 'text-muted-foreground'}>{plan.has_wholesale ? '✓' : '✗'}</span> {t('wholesale_access')}
              </li>
              <li className="flex items-center gap-2">
                <span className={plan.has_auctions ? 'text-green-600' : 'text-muted-foreground'}>{plan.has_auctions ? '✓' : '✗'}</span> {t('auctions_access')}
              </li>
              <li className="flex items-center gap-2">
                <span className={plan.has_featured ? 'text-green-600' : 'text-muted-foreground'}>{plan.has_featured ? '✓' : '✗'}</span> {t('featured_listings')}
              </li>
            </ul>
            {checkoutPlan && checkoutPlan.id === plan.id ? (
              <SubscriptionCheckout
                planId={plan.id}
                planName={plan.name}
                onClose={() => setCheckoutPlan(null)}
              />
            ) : plan.price_monthly === 0 ? (
              <Link
                href="/dealers/register"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-center border border-input bg-background hover:bg-accent"
              >
                {t('get_started')}
              </Link>
            ) : (
              <button
                onClick={() => setCheckoutPlan({ id: plan.id, name: plan.name })}
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-center bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {stripeReady ? ct('subscribe') : t('subscribe_now')}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
