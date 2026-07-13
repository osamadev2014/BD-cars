'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { verifyOtp, resendOtp } from '@/lib/auth/otp-service'
import { OTP_LENGTH, OTP_RESEND_COOLDOWN_SECONDS } from '@/constants'
import { useAuth } from '@/hooks/use-auth'
import { useLocale } from 'next-intl'
import { Building2, Car, ShieldCheck } from 'lucide-react'
import { isPlatformAdmin } from '@/lib/permissions/platform-roles'

function VerifyForm() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const { user, isLoading: authLoading, refresh } = useAuth()

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
      router.replace(isPlatformAdmin(user.roles) ? '/admin' : '/business/select')
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

    // Refresh auth state so AuthProvider picks up the new dev session cookie
    // The useEffect above will redirect based on platform role
    await refresh()
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
    <div className="flex min-h-screen" dir="rtl">
      {/* Left: Branding — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 -right-20 w-72 h-72 rounded-full bg-white" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-white" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            {locale === 'ar' ? 'ريون' : 'Roin'}
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 font-medium mb-3">
            {locale === 'ar' ? 'سوق السيارات الموثوق' : 'Trusted Auto Marketplace'}
          </p>
          <div className="flex items-center justify-center gap-6 mt-10">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Car className="h-4 w-4" />
              <span>{locale === 'ar' ? 'آلاف السيارات' : 'Thousands of cars'}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>{locale === 'ar' ? 'فحص معتمد' : 'Certified inspection'}</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 text-white/40 text-xs">
          &copy; 2026 Roin. {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-8 py-10 bg-background">
        <div className="w-full max-w-[400px] mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">ريون</h1>
            <p className="text-sm text-muted-foreground">
              {locale === 'ar' ? 'سوق السيارات الموثوق' : 'Trusted Auto Marketplace'}
            </p>
          </div>

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
                  className="mt-1 block w-full rounded-xl border bg-background px-3 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                className="w-full h-12 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {locale === 'ar' ? 'جاري...' : 'Verifying...'}
                  </span>
                ) : (
                  t('verify')
                )}
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
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <VerifyForm />
    </Suspense>
  )
}
