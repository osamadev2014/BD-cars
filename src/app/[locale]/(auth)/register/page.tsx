'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { sendOtp } from '@/lib/auth/otp-service'
import { normalizeSaudiPhone } from '@/lib/auth/phone-utils'
import { SAUDI_PHONE_REGEX, OTP_RESEND_COOLDOWN_SECONDS } from '@/constants'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { useLocale } from 'next-intl'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard')
    }
  }, [user, authLoading, router])

  if (!authLoading && user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const normalized = normalizeSaudiPhone(phone)
    if (!normalized || !SAUDI_PHONE_REGEX.test(normalized)) {
      setError(t('phone_invalid'))
      return
    }

    if (name.trim().length < 2) {
      setError(t('name_required'))
      return
    }

    setIsLoading(true)
    const result = await sendOtp(normalized)
    setIsLoading(false)

    if (!result.success) {
      setError(t(result.error || 'login_error'))
      return
    }

    sessionStorage.setItem('reg_name', name.trim())
    startCooldown()
    router.push(`/verify?phone=${encodeURIComponent(normalized)}`)
  }

  const startCooldown = () => {
    setCooldown(OTP_RESEND_COOLDOWN_SECONDS)
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
    <div className="w-full max-w-md mx-auto">
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t('register_title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('register_subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            {t('name_label')}
          </label>
          <input
            id="name"
            type="text"
            placeholder={t('name_placeholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            {t('phone_label')}
          </label>
          <div className="mt-1 flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
              +966
            </span>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder={t('phone_placeholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={9}
              className="block w-full rounded-r-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="tel"
              dir="ltr"
            />
          </div>
          {error && (
            <p className="mt-1 text-sm text-destructive">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || name.trim().length < 2 || phone.length < 9}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? t('registering') : t('register')}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t('have_account')}{' '}
        <a href={`/${locale}/login`} className="text-primary hover:underline">
          {t('login_link')}
        </a>
      </p>

      {cooldown > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {t('resend_otp')} ({cooldown}s)
        </p>
      )}

      <div className="mt-6 pt-6 border-t border-border/60 text-center">
        <Link
          href={`/${locale}/register/business`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          إنشاء حساب شركة
        </Link>
      </div>
    </div>
    </div>
    </div>
  )
}
