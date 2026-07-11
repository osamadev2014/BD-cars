'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Link from 'next/link'
import { sendOtp } from '@/lib/auth/otp-service'
import { normalizeSaudiPhone } from '@/lib/auth/phone-utils'
import { SAUDI_PHONE_REGEX, OTP_RESEND_COOLDOWN_SECONDS } from '@/constants'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Building2 } from 'lucide-react'
import { useLocale } from 'next-intl'

const BUSINESS_TYPES = [
  { value: 'dealer_owner', label: 'مالك معرض سيارات' },
  { value: 'dealer_employee', label: 'موظف معرض' },
  { value: 'wholesale_dealer', label: 'تاجر جملة' },
  { value: 'spare_parts_supplier_admin', label: 'مورد قطع غيار' },
  { value: 'finance_partner_admin', label: 'شريك تمويل' },
  { value: 'insurance_partner_admin', label: 'شريك تأمين' },
  { value: 'advertiser_partner_admin', label: 'شريك إعلانات' },
  { value: 'delivery_partner_admin', label: 'شريك توصيل' },
]

export default function BusinessRegisterPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [businessType, setBusinessType] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [commercialReg, setCommercialReg] = useState('')
  const [contactName, setContactName] = useState('')
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

    if (!businessType) {
      setError('الرجاء اختيار نوع الشركة')
      return
    }

    if (companyName.trim().length < 2) {
      setError('الرجاء إدخال اسم الشركة')
      return
    }

    if (contactName.trim().length < 2) {
      setError('الرجاء إدخال اسم جهة الاتصال')
      return
    }

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

    sessionStorage.setItem('reg_name', contactName.trim())
    sessionStorage.setItem('reg_business_type', businessType)
    sessionStorage.setItem('reg_company_name', companyName.trim())
    if (commercialReg.trim()) {
      sessionStorage.setItem('reg_commercial_reg', commercialReg.trim())
    }
    sessionStorage.setItem('login_type', 'business')
    startCooldown()
    router.push(`/${locale}/verify?phone=${encodeURIComponent(normalized)}`)
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
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-foreground">إنشاء حساب شركة</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            سجل شركتك وانضم إلى منصتنا
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-foreground mb-1.5">
              نوع الشركة
            </label>
            <select
              id="businessType"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="block w-full h-11 rounded-xl border border-border bg-background text-foreground px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
            >
              <option value="">اختر نوع الشركة</option>
              {BUSINESS_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-1.5">
              اسم الشركة / المؤسسة
            </label>
            <input
              id="companyName"
              type="text"
              placeholder="مثال: شركة XYZ للتجارة"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="block w-full h-11 rounded-xl border border-border bg-background text-foreground px-4 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
              autoComplete="organization"
            />
          </div>

          <div>
            <label htmlFor="commercialReg" className="block text-sm font-medium text-foreground mb-1.5">
              السجل التجاري <span className="text-muted-foreground">(اختياري)</span>
            </label>
            <input
              id="commercialReg"
              type="text"
              placeholder="رقم السجل التجاري"
              value={commercialReg}
              onChange={(e) => setCommercialReg(e.target.value)}
              className="block w-full h-11 rounded-xl border border-border bg-background text-foreground px-4 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
            />
          </div>

          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-foreground mb-1.5">
              اسم جهة الاتصال
            </label>
            <input
              id="contactName"
              type="text"
              placeholder="مثال: محمد أحمد"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="block w-full h-11 rounded-xl border border-border bg-background text-foreground px-4 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
              {t('phone_label')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-sm text-muted-foreground border-e border-border/60 pe-3">
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
                className="block w-full h-11 rounded-xl border border-border bg-background text-foreground ps-16 pe-4 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                autoComplete="tel"
                dir="ltr"
              />
            </div>
            {error && (
              <p className="mt-1.5 text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !businessType || companyName.trim().length < 2 || contactName.trim().length < 2 || phone.length < 9}
            fullWidth
            size="lg"
          >
            {isLoading ? t('registering') : 'تسجيل الشركة'}
          </Button>
        </form>

        {cooldown > 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('resend_otp')} ({cooldown}s)
          </p>
        )}

        <div className="mt-6 pt-6 border-t border-border/60 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            لديك حساب شركة بالفعل؟
          </p>
          <Link
            href={`/${locale}/login/business`}
            className="text-sm font-medium text-accent hover:underline"
          >
            تسجيل دخول الشركات
          </Link>
          <div className="pt-2">
            <Link
              href={`/${locale}/register`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              إنشاء حساب فردي
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
