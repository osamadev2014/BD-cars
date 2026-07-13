'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { registerOrganization } from '@/lib/actions/org-actions'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Building2, Store, Wrench, Car, Truck, ShieldCheck, Landmark, Megaphone, Package, Ship, Warehouse } from 'lucide-react'
import { useLocale } from 'next-intl'

const ORG_TYPES = [
  { value: 'car_dealer', label_en: 'Car Dealership', label_ar: 'معرض سيارات', icon: Car },
  { value: 'inspection_center', label_en: 'Inspection Center', label_ar: 'مركز فحص', icon: Wrench },
  { value: 'wholesale_vehicle_trader', label_en: 'Wholesale Vehicle Trader', label_ar: 'تاجر سيارات بالجملة', icon: Warehouse },
  { value: 'spare_parts_supplier', label_en: 'Spare Parts Supplier', label_ar: 'مورد قطع غيار', icon: Package },
  { value: 'finance_company', label_en: 'Finance Company', label_ar: 'شركة تمويل', icon: Landmark },
  { value: 'insurance_company', label_en: 'Insurance Company', label_ar: 'شركة تأمين', icon: ShieldCheck },
  { value: 'advertising_marketing_company', label_en: 'Advertising & Marketing', label_ar: 'شركة إعلانات وتسويق', icon: Megaphone },
  { value: 'car_rental_company', label_en: 'Car Rental Company', label_ar: 'شركة تأجير سيارات', icon: Truck },
  { value: 'product_shipping_company', label_en: 'Shipping Company', label_ar: 'شركة شحن', icon: Ship },
  { value: 'vehicle_transport_company', label_en: 'Vehicle Transport Company', label_ar: 'شركة نقل سيارات', icon: Truck },
]

export default function BusinessRegisterPage() {
  const locale = useLocale()
  const t = useTranslations('common')
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [step, setStep] = useState(1)
  const [orgType, setOrgType] = useState('')
  const [name, setName] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const isRtl = locale === 'ar'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!orgType) { setError(isRtl ? 'الرجاء اختيار نوع المنشأة' : 'Please select an organization type'); return }
    if (!name.trim()) { setError(isRtl ? 'الرجاء إدخال اسم المنشأة' : 'Please enter the organization name'); return }

    if (!user) {
      router.push(`/${locale}/login?redirect=/${locale}/business/register`)
      return
    }

    setIsLoading(true)
    try {
      await registerOrganization({
        org_type: orgType,
        name: name.trim(),
        name_ar: nameAr.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        registration_number: registrationNumber.trim() || undefined,
      })
      setSuccess(true)
      setTimeout(() => router.push(`/${locale}/business/pending`), 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">{isRtl ? 'تم تقديم طلب التسجيل' : 'Registration Submitted'}</h2>
          <p className="text-muted-foreground">
            {isRtl
              ? 'سيتم مراجعة طلبك من قبل الإدارة. سنقوم بإشعارك عند الموافقة.'
              : 'Your request is pending review. We will notify you once approved.'}
          </p>
        </Card>
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">{isRtl ? 'تسجيل منشأة جديدة' : 'Register Your Organization'}</h1>
          <p className="text-muted-foreground mt-1">
            {isRtl ? 'اختر نوع المنشأة وأكمل بيانات التسجيل' : 'Select your organization type and complete the registration'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>{isRtl ? 'نوع المنشأة' : 'Organization Type'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ORG_TYPES.map((type) => {
                    const Icon = type.icon
                    const isSelected = orgType === type.value
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setOrgType(type.value)}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-right transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                        dir={isRtl ? 'rtl' : 'ltr'}
                      >
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">{isRtl ? type.label_ar : type.label_en}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>{isRtl ? 'بيانات المنشأة' : 'Organization Details'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{isRtl ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="block w-full h-11 rounded-xl border border-border bg-background px-4 text-sm"
                    placeholder={isRtl ? 'مثال: مؤسسة XYZ للتجارة' : 'e.g. XYZ Trading Est.'}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{isRtl ? 'الاسم (إنجليزي)' : 'Name (English)'} <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full h-11 rounded-xl border border-border bg-background px-4 text-sm"
                    placeholder={isRtl ? 'مثال: XYZ Trading Est.' : 'e.g. XYZ Trading Est.'}
                    required
                    dir="ltr"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{isRtl ? 'رقم الجوال' : 'Phone'}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full h-11 rounded-xl border border-border bg-background px-4 text-sm"
                      placeholder="+9665xxxxxxxx"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full h-11 rounded-xl border border-border bg-background px-4 text-sm"
                      placeholder="info@example.com"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{isRtl ? 'السجل التجاري' : 'Commercial Registration'} <span className="text-muted-foreground">({isRtl ? 'اختياري' : 'optional'})</span></label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="block w-full h-11 rounded-xl border border-border bg-background px-4 text-sm"
                    placeholder={isRtl ? 'رقم السجل التجاري' : 'Commercial registration number'}
                    dir="ltr"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="rounded-xl bg-destructive/10 text-destructive text-sm p-4 text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            {step === 2 && (
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                {isRtl ? 'السابق' : 'Back'}
              </Button>
            )}
            {step === 1 ? (
              <Button type="button" disabled={!orgType} onClick={() => setStep(2)}>
                {isRtl ? 'التالي' : 'Next'}
              </Button>
            ) : (
              <Button type="submit" loading={isLoading} disabled={!name.trim()}>
                {isRtl ? 'تسجيل المنشأة' : 'Register Organization'}
              </Button>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          {isRtl ? 'بعد التسجيل، سيتم مراجعة طلبك من قبل الإدارة.' : 'After registration, your application will be reviewed by the admin.'}
        </p>
      </div>
    </div>
  )
}
