'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

const CDN = 'https://cdn-frontend-r2.syarah.com/prod/assets/images'

export function PublicFooter() {
  const locale = useLocale()

  return (
    <footer className="bg-white">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Centered */}
        <div className="flex justify-center pt-10 sm:pt-12 pb-6 sm:pb-8">
          <img
            width="83"
            height="38"
            src={`${CDN}/logoN.svg`}
            alt="شعار"
          />
        </div>

        {/* Content Wrapper with Skyline Background */}
        <div className="relative">
          {/* Skyline Background Image */}
          <img
            src={`${CDN}/footer/footer_back.png`}
            width="876"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[876px] max-w-full opacity-30 pointer-events-none select-none"
            alt=""
            aria-hidden="true"
          />

          {/* Top Row: Nav (right) + Social & Location (left) */}
          <div className="relative flex flex-col lg:flex-row justify-between gap-6 lg:gap-0">
            {/* Navigation Links - Right Side */}
            <nav>
              <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                <li><Link href={`/${locale}`} className="text-gray-600 hover:text-gray-900 transition-colors">الرئيسية</Link></li>
                <li><Link href={`/${locale}/pages/about`} className="text-gray-600 hover:text-gray-900 transition-colors">من نحن</Link></li>
                <li><Link href={`/${locale}/contact`} className="text-gray-600 hover:text-gray-900 transition-colors">اتصل بنا</Link></li>
                <li><Link href={`/${locale}/pages/faq`} className="text-gray-600 hover:text-gray-900 transition-colors">دليل BD</Link></li>
                <li><Link href={`/${locale}/plans`} className="text-gray-600 hover:text-gray-900 transition-colors">شبكة BD للتسويق بالعمولة</Link></li>
                <li className="hidden sm:block text-gray-300 mx-1">|</li>
                <li><Link href={`/${locale}/listings`} className="text-gray-600 hover:text-gray-900 transition-colors">BD ترند</Link></li>
                <li><Link href={`/${locale}/listings`} className="text-gray-600 hover:text-gray-900 transition-colors">أسعار السيارات</Link></li>
                <li><Link href={`/${locale}/dealers`} className="text-gray-600 hover:text-gray-900 transition-colors">مبيعات الشركات</Link></li>
                <li><Link href={`/${locale}/pages/terms`} className="text-gray-600 hover:text-gray-900 transition-colors">الصفحات المساعدة</Link></li>
              </ul>
            </nav>

            {/* Social + Location - Left Side */}
            <div className="flex flex-col items-start lg:items-end gap-4">
              <div className="flex items-center gap-2">
                {/* Social Icons in Circles */}
                <div className="flex gap-2 items-center">
                  <a href="https://www.snapchat.com/add/syarah_ksa" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
                    <img src={`${CDN}/snapchatIcon.svg`} alt="snapchat" width="18" height="18" className="opacity-60" />
                  </a>
                  <a href="https://www.youtube.com/channel/UCAceZ20JD3qef5OQSVc95Bw" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
                    <img src={`${CDN}/youtubeIcon.svg`} alt="youtube" width="18" height="18" className="opacity-60" />
                  </a>
                  <a href="https://twitter.com/Syarah_ksa" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
                    <img src={`${CDN}/twitterIcon.svg`} alt="twitter" width="18" height="18" className="opacity-60" />
                  </a>
                  <a href="https://www.linkedin.com/company/syarah-ltd" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
                    <img src={`${CDN}/linkedinIcon.svg`} alt="linkedin" width="18" height="18" className="opacity-60" />
                  </a>
                  <a href="https://www.facebook.com/syarah.KSA" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
                    <img src={`${CDN}/Facebook%20Icon.svg`} alt="facebook" width="18" height="18" className="opacity-60" />
                  </a>
                </div>
                {/* Location / Company Address Button */}
                <a
                  href={`/${locale}/contact`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-50 text-gray-700 text-xs sm:text-sm hover:bg-purple-100 transition-colors"
                >
                  <img src={`${CDN}/mdi_location.svg`} alt="" width="14" height="14" />
                  <span>عنوان الشركة</span>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 my-6 sm:my-8" />

          {/* Registry Section */}
          <div className="relative mb-6 sm:mb-8">
            <p className="text-sm text-gray-500">شركة سعوديه بسجل تجاري 1010538980 مصدره الرياض</p>
            <div className="flex flex-wrap gap-1 mt-2 text-sm">
              <Link href={`/${locale}/pages/terms`} className="text-gray-600 hover:text-gray-900 transition-colors">الشروط والأحكام</Link>
              <span className="text-gray-300 mx-1">|</span>
              <Link href={`/${locale}/pages/privacy`} className="text-gray-600 hover:text-gray-900 transition-colors">سياسة الخصوصية</Link>
              <span className="text-gray-300 mx-1">|</span>
              <Link href={`/${locale}/pages/returns`} className="text-gray-600 hover:text-gray-900 transition-colors">سياسة الإرجاع</Link>
            </div>
          </div>

          {/* Map + Payment Grid */}
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
            {/* Map Card */}
            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.0179846607275!2d46.8348856!3d24.7605725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2fab6abe210645%3A0xb6b6a73b3bdd70b6!2sSyarah%20Ltd.!5e0!3m2!1sen!2sjo!4v1700392307735!5m2!1sen!2sjo"
                width="100%" height="140" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                className="rounded-t-xl"
              />
              <div className="flex items-start gap-2 p-3 sm:p-4 text-sm text-gray-600">
                <img src={`${CDN}/location_on-24px@1Blue.svg`} alt="" width="16" height="16" className="mt-0.5 flex-shrink-0" />
                <div>
                  <p>حي النهضة، طريق خريص 13222 الرياض</p>
                  <p>المملكة العربية السعودية</p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <strong className="text-emerald-600 text-sm sm:text-base block mb-3 sm:mb-4">طرق دفع إلكترونية آمنة</strong>
              {/* Row 1: Visa, MC, Apple Pay, Bank Transfer */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3">
                <img src={`${CDN}/Visa.svg`} alt="Visa" className="h-8 sm:h-9 w-auto" />
                <img src={`${CDN}/mc.svg`} alt="Mastercard" className="h-8 sm:h-9 w-auto" />
                <img src={`${CDN}/apple_pay.svg`} alt="Apple Pay" className="h-8 sm:h-9 w-auto" />
                <img src={`${CDN}/BankTransfer.svg`} alt="تحويل بنكي" className="h-8 sm:h-9 w-auto" />
              </div>
              {/* Row 2: Tabby, Tamara, Amwal, Mada, Sadad */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <img src={`${CDN}/bnpl_tabby_logo.png`} alt="tabby" className="h-6 sm:h-7 w-auto" />
                <img src={`${CDN}/bnpl_tamara_logo.png`} alt="tamara" className="h-6 sm:h-7 w-auto" />
                <img src={`${CDN}/bnpl_amwal_logo.png`} alt="amwal" className="h-6 sm:h-7 w-auto" />
                <img src={`${CDN}/Mada.svg`} alt="Mada" className="h-8 sm:h-9 w-auto" />
                <img src={`${CDN}/Sadad.svg`} alt="Sadad" className="h-8 sm:h-9 w-auto" />
              </div>
            </div>
          </div>

          {/* App Download Banner */}
          <div className="relative bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-xl overflow-hidden py-5 sm:py-6 px-6 sm:px-8 mb-6 sm:mb-8">
            {/* Decorative Circles */}
            <div className="absolute -right-4 -top-4 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5" />
            <div className="absolute -left-4 -bottom-4 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white/5" />
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5" />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white text-sm sm:text-base font-medium text-center sm:text-right">
                حمل التطبيق الآن لتجربة أذكى لبيع وشراء السيارات بالمملكة
              </p>
              <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                <a href="https://apps.apple.com/us/app/id1066260672" target="_blank" rel="noopener noreferrer">
                  <img src={`${CDN}/about-us/store-ios.svg`} alt="App Store" height="36" className="h-9 sm:h-10 w-auto" />
                </a>
                <a href="https://play.google.com/store/apps/details?id=app.com.syarah" target="_blank" rel="noopener noreferrer">
                  <img src={`${CDN}/about-us/store-android.svg`} alt="Google Play" height="36" className="h-9 sm:h-10 w-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-4 sm:py-5 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            جميع الحقوق محفوظة لشركة موقع BD المحدودة &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Authentication Message */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
              هذا الموقع موثق من وزارة التجارة والاستثمار وبدعم من شركة علم, بسجل تجاري رقم 1010538980
            </p>
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <a
                href="https://cdn-frontend-r2.syarah.com/prod/assets/bundles/GAZT_VAT_Certificate.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img src={`${CDN}/Vat.svg`} alt="VAT" width="26" height="33" className="h-8 sm:h-9 w-auto" />
              </a>
              <img
                src={`${CDN}/saudi_elm.svg`}
                alt="saudi elm"
                width="200"
                height="34"
                className="h-8 sm:h-[34px] w-auto max-w-[160px] sm:max-w-[200px]"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
