'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, Car, ShieldCheck, ChevronLeft, ChevronRight, HelpCircle, Globe, Lock, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { sendOtp } from '@/lib/auth/otp-service'
import { normalizeSaudiPhone } from '@/lib/auth/phone-utils'
import { SAUDI_PHONE_REGEX, OTP_RESEND_COOLDOWN_SECONDS } from '@/constants'
import { useAuth } from '@/hooks/use-auth'
import { isPlatformAdmin } from '@/lib/permissions/platform-roles'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState(true)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [touched, setTouched] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(isPlatformAdmin(user.roles) ? '/admin' : '/business/select')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!authLoading) inputRef.current?.focus()
  }, [authLoading])

  if (!authLoading && user) return null

  const normalized = normalizeSaudiPhone(phone)
  const isValid = normalized && SAUDI_PHONE_REGEX.test(normalized)
  const showError = (touched || submitAttempted) && phone.length >= 9 && !isValid
  const canSubmit = isValid && !isLoading && cooldown === 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitAttempted(true)

    if (!normalized || !SAUDI_PHONE_REGEX.test(normalized)) {
      return
    }

    setIsLoading(true)
    try {
      const result = await sendOtp(normalized)
      if (!result.success) {
        setError(result.error || 'login_error')
        setIsLoading(false)
        return
      }
      startCooldown()
      router.push(`/verify?phone=${encodeURIComponent(normalized)}`)
    } catch {
      setError('login_error')
      setIsLoading(false)
    }
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

  const switchLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar'
    router.push(`/${newLocale}/login`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Minimal Auth Header */}
      <header className="border-b border-border/30 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <a href={`/${locale}`} className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm transition-shadow group-hover:shadow-md">
                <svg className="h-[18px] w-[18px] invert" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="font-bold text-lg text-foreground">{isRtl ? 'ريون' : 'Riyon'}</span>
            </a>
            <div className="flex items-center gap-1 sm:gap-2">
              <a
                href={`/${locale}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="hidden sm:inline">{isRtl ? 'العودة للرئيسية' : 'Home'}</span>
              </a>
              <button
                onClick={switchLocale}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="hidden sm:inline">{locale === 'ar' ? 'English' : 'العربية'}</span>
              </button>
              <a
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="hidden sm:inline">{isRtl ? 'المساعدة' : 'Help'}</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Right: Brand Panel — hidden on tablet/mobile */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-12 overflow-hidden">
          {/* Automotive decorative elements */}
          <div className="absolute inset-0 opacity-[0.07]">
            <svg viewBox="0 0 800 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 450 Q250 300 450 380 Q600 440 750 320" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M50 400 Q200 280 400 350 Q550 400 700 300" stroke="white" strokeWidth="1.5" fill="none" opacity="0.3" />
              <path d="M680 280 L720 280 L730 300 L690 300 Z" fill="white" opacity="0.08" />
              <path d="M80 340 L120 340 L130 360 L90 360 Z" fill="white" opacity="0.06" />
              <g opacity="0.05">
                <rect x="520" y="220" width="180" height="80" rx="12" fill="white" />
                <circle cx="550" cy="300" r="12" fill="white" />
                <circle cx="670" cy="300" r="12" fill="white" />
              </g>
              <g opacity="0.04">
                <rect x="100" y="300" width="140" height="60" rx="10" fill="white" />
                <circle cx="120" cy="360" r="10" fill="white" />
                <circle cx="220" cy="360" r="10" fill="white" />
              </g>
              <circle cx="650" cy="160" r="100" fill="white" opacity="0.03" />
              <circle cx="150" cy="130" r="70" fill="white" opacity="0.02" />
            </svg>
          </div>

          <div className="relative z-10 text-center max-w-md">
            {/* Premium logo icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm mb-8 ring-1 ring-white/25 shadow-lg">
              <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18" r="2.5" />
                <circle cx="18.5" cy="18" r="2.5" />
              </svg>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              {isRtl ? 'ريون' : 'Riyon'}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 font-medium mb-3">
              {isRtl ? 'سوق السيارات الموثوق' : 'Trusted Auto Marketplace'}
            </p>
            <p className="text-base text-white/70 max-w-sm mx-auto leading-relaxed">
              {isRtl
                ? 'اشترِ وبِع سيارتك بثقة. سيارات مفحوصة، بائعون موثوقون، وخدمات متكاملة في مكان واحد.'
                : 'Buy and sell your car with confidence. Inspected cars, trusted dealers, and integrated services in one place.'}
            </p>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-10">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <svg className="h-4 w-4 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>{isRtl ? 'سيارات مفحوصة' : 'Inspected Cars'}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <svg className="h-4 w-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span>{isRtl ? 'معارض موثقة' : 'Verified Dealers'}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <svg className="h-4 w-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18" r="2.5" />
                  <circle cx="18.5" cy="18" r="2.5" />
                </svg>
                <span>{isRtl ? 'تمويل وضمان ونقل' : 'Finance & Warranty'}</span>
              </div>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="absolute bottom-6 text-white/30 text-xs">
            &copy; 2026 {isRtl ? 'ريون. جميع الحقوق محفوظة' : 'Riyon. All rights reserved'}
          </div>
        </div>

        {/* Left: Login Form */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-8 sm:py-12">
          <div className="w-full max-w-[440px] mx-auto">
            {/* Mobile brand banner */}
            <div className="lg:hidden flex flex-col items-center mb-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-4 ring-1 ring-primary/10">
                <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18" r="2.5" />
                  <circle cx="18.5" cy="18" r="2.5" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {isRtl ? 'ريون' : 'Riyon'}
              </h1>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                {isRtl
                  ? 'سوق السيارات الموثوق — سيارات مفحوصة، معارض موثقة'
                  : 'Trusted Auto Marketplace — Inspected cars, verified dealers'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <h1 className="text-[28px] font-bold text-foreground mb-1.5">
                {isRtl ? 'تسجيل الدخول' : 'Sign In'}
              </h1>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                {isRtl
                  ? 'أدخل رقم جوالك وسنرسل لك رمز تحقق آمن'
                  : 'Enter your phone number and we\'ll send you a secure code'}
              </p>

              {/* Phone input */}
              <div className="mb-5">
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                  {isRtl ? 'رقم الجوال' : 'Phone Number'}
                </label>
                <div className="relative">
                  <div className={cn(
                    'absolute inset-y-0 flex items-center pointer-events-none z-10',
                    isRtl ? 'right-0' : 'left-0'
                  )}>
                    <span className={cn(
                      'inline-flex items-center gap-1.5 h-full border-l border-border/60 px-3 sm:px-4 text-sm font-medium text-muted-foreground bg-muted/40 rounded-s-xl',
                      isRtl && 'border-l-0 border-r rounded-s-none rounded-e-xl'
                    )}>
                      <svg className="h-4 w-4 shrink-0 rounded-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="5" width="20" height="14" rx="2" fill="#1EA34A"/>
                        <rect x="2" y="5" width="10" height="14" rx="2" fill="#1EA34A"/>
                        <path d="M2 10h10" stroke="white" strokeWidth="0.8"/>
                        <path d="M2 14h10" stroke="white" strokeWidth="0.8"/>
                      </svg>
                      <span className="text-foreground/80">+966</span>
                    </span>
                  </div>
                  <input
                    ref={inputRef}
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={isRtl ? '5X XXX XXXX' : '5X XXX XXXX'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    onBlur={() => setTouched(true)}
                    maxLength={10}
                    className={cn(
                      'block w-full h-[50px] rounded-xl border bg-background text-foreground text-base shadow-sm transition-all',
                      'placeholder:text-muted-foreground/50',
                      'focus:outline-none focus:ring-2 focus:border-primary',
                      'hover:border-ring',
                      showError || error
                        ? 'border-destructive focus:ring-destructive/20 focus:border-destructive'
                        : 'border-border focus:ring-primary/20',
                      isRtl ? 'pr-[5.5rem] pl-4' : 'pl-[5.5rem] pr-4',
                    )}
                    autoComplete="tel"
                    dir="ltr"
                    aria-invalid={showError || !!error}
                    aria-describedby={showError ? 'phone-error' : error ? 'api-error' : undefined}
                  />
                </div>
                {showError && (
                  <p id="phone-error" className="mt-1.5 text-sm text-destructive flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {isRtl ? 'يرجى إدخال رقم جوال سعودي صحيح' : 'Please enter a valid Saudi phone number'}
                  </p>
                )}
                {error && !showError && (
                  <p id="api-error" className="mt-1.5 text-sm text-destructive">{error}</p>
                )}
                {cooldown > 0 && (
                  <p className="mt-1.5 text-sm text-muted-foreground inline-flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {isRtl ? 'يمكنك إعادة الإرسال بعد' : 'Resend available in'} {cooldown}s
                  </p>
                )}
              </div>

              {/* WhatsApp preference */}
              <label className="flex items-center gap-2.5 mb-6 cursor-pointer select-none group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                    whatsapp
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/30 group-hover:border-muted-foreground/50'
                  )}>
                    {whatsapp && (
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366] shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {isRtl ? 'أود استقبال التحديثات عبر واتساب' : 'I want to receive updates via WhatsApp'}
                </span>
              </label>

              {/* Submit button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  'w-full h-[50px] rounded-xl text-sm font-bold transition-all shadow-sm inline-flex items-center justify-center gap-2',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  canSubmit
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 cursor-pointer shadow-primary/20'
                    : 'bg-muted text-muted-foreground/40 cursor-not-allowed'
                )}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isRtl ? 'جاري الإرسال...' : 'Sending...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    {isRtl ? 'إرسال رمز التحقق' : 'Send Verification Code'}
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {isRtl ? (
                        <>
                          <line x1="19" y1="12" x2="5" y2="12" />
                          <polyline points="12 19 5 12 12 5" />
                        </>
                      ) : (
                        <>
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </>
                      )}
                    </svg>
                  </span>
                )}
              </button>

              {/* Terms */}
              <div className="mt-5 text-center text-xs text-muted-foreground leading-relaxed">
                <span>{isRtl ? 'باستمرارك، توافق على' : 'By continuing, you agree to'}</span>
                <div className="inline-flex items-center gap-1 rtl:flex-row-reverse me-1">
                  <a href={`/${locale}/pages/terms`} className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                    {isRtl ? 'الشروط والأحكام' : 'Terms & Conditions'}
                  </a>
                  <span> {isRtl ? 'و' : ' & '} </span>
                  <a href={`/${locale}/pages/privacy`} className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                    {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
                  </a>
                </div>
              </div>
            </form>

            {/* Company login */}
            <div className="mt-8 pt-6 border-t border-border/30">
              <p className="text-xs text-muted-foreground text-center mb-3">
                {isRtl ? 'هل تمثل معرضًا أو شركة؟' : 'Represent a dealership or company?'}
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={`/${locale}/login/business`}
                  className="flex items-center justify-center gap-2 h-[48px] rounded-xl border-2 border-border/60 bg-background text-sm font-medium text-foreground hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  {isRtl ? 'دخول بوابة الشركاء' : 'Partner Portal Login'}
                </a>
                <a
                  href={`/${locale}/business/register`}
                  className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground py-2 transition-colors"
                >
                  {isRtl ? 'إنشاء حساب شركة جديد' : 'Create a New Business Account'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Footer */}
      <footer className="border-t border-border/20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground/60" dir={isRtl ? 'rtl' : 'ltr'}>
            <span>&copy; 2026 {isRtl ? 'ريون' : 'Riyon'}</span>
            <div className="flex items-center gap-3">
              <a href={`/${locale}/pages/terms`} className="hover:text-foreground transition-colors">
                {isRtl ? 'الشروط والأحكام' : 'Terms'}
              </a>
              <span className="text-border/40">&middot;</span>
              <a href={`/${locale}/pages/privacy`} className="hover:text-foreground transition-colors">
                {isRtl ? 'سياسة الخصوصية' : 'Privacy'}
              </a>
              <span className="text-border/40">&middot;</span>
              <a href={`/${locale}/contact`} className="hover:text-foreground transition-colors">
                {isRtl ? 'تواصل معنا' : 'Contact'}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
