import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { SLUG_TO_DB_MAP } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { Car, Mail } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function VehiclesPage({ params }: Props) {
  const { locale, orgType } = await params
  const isRtl = locale === 'ar'

  const validation = await validateDashboardAccess(locale, orgType)
  if (!validation.allowed) {
    if (validation.redirect) redirect(validation.redirect)
    notFound()
  }

  const isCarRental = SLUG_TO_DB_MAP[orgType as OrgTypeSlug] === 'car_rental_company'

  if (!isCarRental) {
    notFound()
  }

  const features = [
    isRtl ? 'إدارة الأسطول' : 'Fleet Management',
    isRtl ? 'الحجوزات' : 'Reservations',
    isRtl ? 'العقود' : 'Contracts',
    isRtl ? 'إدارة العملاء' : 'Customer Management',
    isRtl ? 'الصيانة' : 'Maintenance',
    isRtl ? 'المدفوعات' : 'Payments',
  ]

  return (
    <div>
      <DashboardPageHeader
        title={isRtl ? 'المركبات' : 'Vehicles'}
        description={isRtl ? 'إدارة أسطول المركبات' : 'Fleet management'}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgType}/overview` },
          { label: isRtl ? 'المركبات' : 'Vehicles' },
        ]}
        locale={locale}
      />

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 p-4 rounded-full bg-orange-50 dark:bg-orange-900/20">
          <Car className="w-16 h-16 text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isRtl ? 'وحدة تأجير السيارات قريباً' : 'Car Rental Module Coming Soon'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-8">
          {isRtl
            ? 'نعمل على تطوير ميزات إدارة التأجير لتوفير تجربة متكاملة. ترقبوا الإطلاق القادم!'
            : 'We are developing comprehensive rental management features to provide a complete experience. Stay tuned for the upcoming launch!'}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mb-8">
          {[
            { en: 'Fleet Management', ar: 'إدارة الأسطول' },
            { en: 'Reservations', ar: 'الحجوزات' },
            { en: 'Contracts', ar: 'العقود' },
            { en: 'Customer Management', ar: 'إدارة العملاء' },
            { en: 'Maintenance', ar: 'الصيانة' },
            { en: 'Payments', ar: 'المدفوعات' },
          ].map((feature) => (
            <div
              key={feature.en}
              className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800"
            >
              {isRtl ? feature.ar : feature.en}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-400 dark:text-gray-500 max-w-md">
          {isRtl
            ? 'للحصول على وصول مبكر، يرجى التواصل مع فريق الدعم'
            : 'For early access, please contact our support team'}
        </div>
      </div>
    </div>
  )
}