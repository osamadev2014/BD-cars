import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'

const footerSections = [
  {
    title: { en: 'Buy & Sell', ar: 'بيع وشراء' },
    links: [
      { href: '/listings', label: { en: 'Browse Cars', ar: 'تصفح السيارات' } },
      { href: '/listings/new', label: { en: 'Sell Your Car', ar: 'بيع سيارتك' } },
      { href: '/auctions', label: { en: 'Auctions', ar: 'المزادات' } },
      { href: '/dealers', label: { en: 'Find a Dealer', ar: 'البحث عن معرض' } },
    ],
  },
  {
    title: { en: 'Services', ar: 'الخدمات' },
    links: [
      { href: '/inspection', label: { en: 'Inspection', ar: 'الفحص' } },
      { href: '/parts', label: { en: 'Spare Parts', ar: 'قطع الغيار' } },
      { href: '/finance', label: { en: 'Finance', ar: 'التمويل' } },
      { href: '/insurance', label: { en: 'Insurance', ar: 'التأمين' } },
    ],
  },
  {
    title: { en: 'Support', ar: 'الدعم' },
    links: [
      { href: '/contact', label: { en: 'Contact Us', ar: 'اتصل بنا' } },
      { href: '/pages/about', label: { en: 'About Us', ar: 'من نحن' } },
      { href: '/pages/faq', label: { en: 'FAQ', ar: 'الأسئلة الشائعة' } },
      { href: '/pages/terms', label: { en: 'Terms of Service', ar: 'شروط الخدمة' } },
    ],
  },
]

export function PublicFooter() {
  const locale = useLocale()
  const l = (obj: { en: string; ar: string }) => obj[locale as 'en' | 'ar'] || obj.en
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="BD" width={100} height={36} className="h-9 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {locale === 'ar'
                ? 'منصة رائدة لبيع وشراء السيارات في المملكة العربية السعودية'
                : 'The leading automotive marketplace in Saudi Arabia'}
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title.en}>
              <h4 className="font-semibold text-foreground mb-3 text-sm">
                {l(section.title)}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border/60 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>&copy; {currentYear} BD. {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/pages/privacy`} className="hover:text-foreground transition-colors">
              {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <Link href={`/${locale}/pages/terms`} className="hover:text-foreground transition-colors">
              {locale === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
