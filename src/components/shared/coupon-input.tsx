'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { validateCoupon, redeemCoupon } from '@/lib/actions/coupon-actions'
import type { CouponValidation } from '@/lib/actions/coupon-actions'

interface CouponInputProps {
  orderAmount: number
  onApplied: (discountAmount: number, couponId: string) => void
  onRemoved: () => void
}

export function CouponInput({ orderAmount, onApplied, onRemoved }: CouponInputProps) {
  const t = useTranslations('common')
  const [code, setCode] = useState('')
  const [validating, setValidating] = useState(false)
  const [result, setResult] = useState<CouponValidation | null>(null)
  const [applied, setApplied] = useState(false)

  const handleValidate = async () => {
    if (!code.trim()) return
    setValidating(true)
    setResult(null)
    const r = await validateCoupon(code.trim(), orderAmount)
    setResult(r)
    setValidating(false)
  }

  const handleApply = async () => {
    if (!code.trim()) return
    setValidating(true)
    const r = await redeemCoupon(code.trim(), orderAmount)
    if (r.success) {
      setApplied(true)
      onApplied(r.discount_amount!, code.trim())
    } else {
      setResult({ valid: false, error: r.error })
    }
    setValidating(false)
  }

  const handleRemove = () => {
    setCode('')
    setResult(null)
    setApplied(false)
    onRemoved()
  }

  if (applied) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
        <span>{t('coupon_applied')}</span>
        <button onClick={handleRemove} className="text-green-800 hover:text-green-900 font-medium">
          {t('remove')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setResult(null) }}
          placeholder={t('enter_coupon')}
          className="flex-1 uppercase"
          onKeyDown={(e) => { if (e.key === 'Enter') handleValidate() }}
        />
        <Button variant="outline" onClick={handleValidate} disabled={validating || !code.trim()}>
          {t('apply')}
        </Button>
        {result?.valid && (
          <Button onClick={handleApply} disabled={validating}>
            {t('confirm')}
          </Button>
        )}
      </div>
      {validating && <p className="text-sm text-muted-foreground">{t('validating')}</p>}
      {result?.valid && result.discount_amount && (
        <p className="text-sm text-green-600">
          {t('coupon_discount', { amount: result.discount_amount.toFixed(2) })}
        </p>
      )}
      {result?.error && (
        <p className="text-sm text-destructive">{result.error}</p>
      )}
    </div>
  )
}
