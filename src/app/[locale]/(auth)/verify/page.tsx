'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { verifyOtp, resendOtp } from '@/lib/auth/otp-service'
import { OTP_LENGTH, OTP_RESEND_COOLDOWN_SECONDS } from '@/constants'
import { useAuth } from '@/hooks/use-auth'

function VerifyForm() {
  const t = useTranslations('auth')
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const { user, isLoading: authLoading } = useAuth()

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [checkedPhone, setCheckedPhone] = useState(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!phone && !checkedPhone) {
      setCheckedPhone(true)
      router.replace('/login')
    }
  }, [phone, checkedPhone, router])

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard')
    }
  }, [user, authLoading, router])

  if (!phone || (!authLoading && user)) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (code.length !== OTP_LENGTH) {
      setError(t('otp_length'))
      return
    }

    setIsLoading(true)
    const result = await verifyOtp(phone, code)
    setIsLoading(false)

    if (!result.success) {
      setError(t(result.error || 'verify_error'))
      return
    }

    const regName = sessionStorage.getItem('reg_name')
    if (regName) {
      try {
        const data = result.data as { user?: { id?: string } } | null
        if (data?.user?.id) {
          const supabase = (await import('@/lib/supabase/client')).createClient()
          await supabase.from('profiles').update({ full_name: regName }).eq('id', data.user.id)
        }
      } catch { /* non-critical */ }
      sessionStorage.removeItem('reg_name')
    }

    router.push('/dashboard')
  }

  const handleResend = async () => {
    setError('')
    setCode('')
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

    await resendOtp(phone)
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
    <div className="w-full max-w-md mx-auto">
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t('verify_title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('verify_subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium">
            {t('otp_placeholder')}
          </label>
          <input
            ref={inputRef}
            id="otp"
            type="text"
            inputMode="numeric"
            placeholder="1234"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH))
            }
            maxLength={OTP_LENGTH}
            className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary"
            autoComplete="one-time-code"
            dir="ltr"
          />
          {error && (
            <p className="mt-1 text-sm text-destructive">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || code.length !== OTP_LENGTH}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? t('verifying') : t('verify')}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
        >
          {cooldown > 0
            ? `${t('resend_otp')} (${cooldown}s)`
            : t('resend_otp')}
        </button>
      </div>
    </div>
    </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <VerifyForm />
    </Suspense>
  )
}
