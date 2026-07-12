'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { sendOtp } from '@/lib/auth/otp-service'
import { normalizeSaudiPhone } from '@/lib/auth/phone-utils'
import { SAUDI_PHONE_REGEX, OTP_RESEND_COOLDOWN_SECONDS } from '@/constants'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { useLocale } from 'next-intl'

export default function LoginPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState(true)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!authLoading) inputRef.current?.focus()
  }, [authLoading])

  if (!authLoading && user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const normalized = normalizeSaudiPhone(phone)
    if (!normalized || !SAUDI_PHONE_REGEX.test(normalized)) {
      setError(t('phone_invalid'))
      return
    }

    setIsLoading(true)
    const result = await sendOtp(normalized)
    setIsLoading(false)

    if (!result.success) {
      setError(t(result.error || 'login_error'))
      return
    }

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

  const isValid = phone.replace(/[^0-9]/g, '').length >= 9

  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* Image side - hidden on mobile */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-black">
        <img
          src="https://cdn-frontend-r2.syarah.com/prod/cms/uploads/desktop_be80be59ff.jpg"
          alt="سيارة"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-[400px] mx-auto">
          <form onSubmit={handleSubmit} className="space-y-0">
            <strong className="block text-xl sm:text-2xl font-bold text-foreground mb-2">
              تسجيل الدخول / إنشاء حساب
            </strong>
            <p className="text-sm text-[#6c7a8d] mb-8 leading-relaxed">
              سجل الدخول أو قم بإنشاء حساب الآن للوصول إلى حسابك.
            </p>

            {/* Phone Input - syarah style */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-foreground mb-1.5">
                رقم الجوال
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-sm text-muted-foreground border-e border-border/60 ps-3 pe-3 flex items-center">
                  +966
                </span>
                <input
                  ref={inputRef}
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder=""
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  maxLength={10}
                  className="block w-full h-11 rounded-lg border border-border bg-background text-foreground ps-[4.2rem] pe-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  autoComplete="tel"
                  dir="ltr"
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
              {cooldown > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('resend_otp')} ({cooldown}s)
                </p>
              )}
            </div>

            {/* WhatsApp checkbox - syarah style */}
            <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                  {whatsapp && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25D366] shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-xs text-[#6c7a8d] leading-6">
                أود استقبال تحديثات طلبي من خلال واتساب.
              </span>
            </label>

            {/* Submit button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full h-11 rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جاري...
                </span>
              ) : (
                'ابدأ الآن'
              )}
            </button>

            {/* Terms - syarah style */}
            <div className="mt-5 text-center text-xs text-[#6c7a8d] leading-relaxed">
              <div>بمجرد انشاء حساب, توافق على</div>
              <div>
                <Link href={`/${locale}/pages/terms`} className="text-[#6c7a8d] hover:text-foreground underline underline-offset-2">
                  الشروط والاحكام
                </Link>
                <span> و </span>
                <Link href={`/${locale}/pages/privacy`} className="text-[#6c7a8d] hover:text-foreground underline underline-offset-2">
                  سياسة الخصوصية
                </Link>
              </div>
            </div>
          </form>

          {/* Business login link */}
          <div className="mt-8 pt-6 border-t border-border/40">
            <Link
              href={`/${locale}/login/business`}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              تسجيل دخول الشركات
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
