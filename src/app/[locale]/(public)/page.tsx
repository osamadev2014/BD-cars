import type { Metadata } from 'next'
import Link from 'next/link'
import { VehicleCard } from '@/components/vehicle/vehicle-card'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { BrandGrid } from '@/components/brand-grid'
import { JsonLd } from '@/components/shared/json-ld'
import { buildMetadata, buildWebSiteSchema } from '@/lib/seo'
import { fetchSupabase } from '@/lib/supabase/fetch-client'
import {
  Car, Shield, Truck, Phone,
  ChevronLeft, ChevronDown, Send,
  BadgeCheck, RefreshCw, ChevronRight
} from 'lucide-react'

const CDN = 'https://cdn-frontend-r2.syarah.com/prod/assets/images'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'BD - سيارات للبيع في السعودية',
    description: 'أفضل منصة لبيع وشراء السيارات في السعودية. تصفح آلاف السيارات المعروضة للبيع، قارن الأسعار، وتواصل مع البائعين مباشرة.',
    path: '/',
  })
}

export const revalidate = 300

async function getRecentListings() {
  const { data, error } = await fetchSupabase<any[]>('vehicle_listings', {
    select: `id,slug,title,title_ar,price,status,
      vehicle:vehicles(
        id,year,mileage,
        make:car_makes(id,name,name_ar,slug),
        model:car_models(id,name,name_ar,slug),
        images:vehicle_images(id,url,is_primary,sort_order)
      )`,
    status: 'in.(published,published_with_trusted_badge,reserved)',
    limit: 12,
    order: 'created_at.desc',
  })
  if (error || !data) return []
  return data
}

const banks = [
  { name: 'بنك البلاد', img: '/images/banks/albilad.webp' },
  { name: 'مصرف الراجحي', img: '/images/banks/rajhi.webp' },
  { name: 'بنك الرياض', img: '/images/banks/riyad.webp' },
  { name: 'مصرف الإنماء', img: '/images/banks/alinma.webp' },
  { name: 'تمويل الأولى', img: '/images/banks/taweel.webp' },
  { name: 'شركة الجبر للتمويل', img: '/images/banks/aljabr.webp' },
  { name: 'عبد اللطيف جميل للتمويل', img: '/images/banks/jameel.webp' },
  { name: 'بنك السعودي الفرنسي', img: '/images/banks/faranci.webp' },
  { name: 'إمكان للتمويل', img: '/images/banks/emkan.webp' },
  { name: 'بنك الجزيرة', img: '/images/banks/client.webp' },
  { name: 'SNB', img: '/images/banks/snb.webp' },
]

const brands = [
  { name: 'تويوتا', img: '/images/brands/toyota.png' },
  { name: 'هيونداي', img: '/images/brands/hyundai.png' },
  { name: 'كيا', img: '/images/brands/kia.png' },
  { name: 'نيسان', img: '/images/brands/nissan.png' },
  { name: 'مازدا', img: '/images/brands/mazda.png' },
  { name: 'سوزوكي', img: '/images/brands/suzuki.png' },
  { name: 'ام جي', img: '/images/brands/mg.png' },
  { name: 'جيلي', img: '/images/brands/geely.png' },
  { name: 'شفروليه', img: '/images/brands/chevrolet.png' },
  { name: 'لكزس', img: '/images/brands/lexus.png' },
  { name: 'بي ام دبليو', img: '/images/brands/bmw.png' },
  { name: 'مرسيدس', img: '/images/brands/mercedes.png' },
  { name: 'فورد', img: '/images/brands/ford.png' },
  { name: 'GAC', img: '/images/brands/gac.png' },
  { name: 'شانجان', img: '/images/brands/changan.png' },
  { name: 'جيب', img: '/images/brands/jeep.png' },
  { name: 'جي إم سي', img: '/images/brands/gmc.png' },
  { name: 'شيري', img: '/images/brands/chery.png' },
  { name: 'هوندا', img: '/images/brands/honda.png' },
  { name: 'ميتسوبيشي', img: '/images/brands/mitsubishi.png' },
  { name: 'لاند روفر', img: '/images/brands/landrover.png' },
  { name: 'هافال', img: '/images/brands/haval.png' },
  { name: 'بيجو', img: '/images/brands/peugeot.png' },
  { name: 'JMC', img: '/images/brands/jmc.png' },
  { name: 'جينيسيس', img: '/images/brands/genesis.png' },
  { name: 'دودج', img: '/images/brands/dodge.png' },
  { name: 'اودي', img: '/images/brands/audi.png' },
  { name: 'ايسوزو', img: '/images/brands/isuzu.png' },
  { name: 'فولكس فاجن', img: '/images/brands/vw.png' },
  { name: 'جيتور', img: '/images/brands/jetour.png' },
  { name: 'لوسيد', img: '/images/brands/lucid.png' },
  { name: 'بايك', img: '/images/brands/baic.png' },
  { name: 'كاديلاك', img: '/images/brands/cadillac.png' },
  { name: 'ميني', img: '/images/brands/mini.png' },
  { name: 'انفنتي', img: '/images/brands/infiniti.png' },
  { name: 'كرايسلر', img: '/images/brands/chrysler.png' },
  { name: 'سي ام سي', img: '/images/brands/cmc.png' },
  { name: 'فيات', img: '/images/brands/fiat.png' },
  { name: 'لينكولن', img: '/images/brands/lincoln.png' },
  { name: 'بورش', img: '/images/brands/porsche.png' },
  { name: 'روكس', img: '/images/brands/ruox.png' },
  { name: 'جريت وول', img: '/images/brands/greatwall.png' },
  { name: 'جايكو', img: '/images/brands/jaico.png' },
  { name: 'BAW 212', img: '/images/brands/baw212.png' },
  { name: 'بيوك', img: '/images/brands/beok.png' },
  { name: 'تسلا', img: '/images/brands/tesla.png' },
  { name: 'دونج فينج', img: '/images/brands/dongfeng.png' },
  { name: 'هونشي', img: '/images/brands/hongqi.png' },
  { name: 'ماكسيوس', img: '/images/brands/maxus.png' },
  { name: 'مازيراتي', img: '/images/brands/maserati.png' },
  { name: 'بنتلي', img: '/images/brands/bentley.png' },
  { name: 'فيكتوريا اوتو', img: '/images/brands/victoria.png' },
]

const installmentRanges = [
  { label: 'أقل من 1,000', value: '0-1000' },
  { label: 'من 1,000 - 1,500', value: '1000-1500' },
  { label: 'من 1,500 - 2,000', value: '1500-2000' },
  { label: 'من 2,000 - 2,500', value: '2000-2500' },
  { label: 'من 2,500 - 3,000', value: '2500-3000' },
  { label: 'من 3,000 - 3,500', value: '3000-3500' },
  { label: 'من 3,500 - 4,000', value: '3500-4000' },
  { label: 'من 4,000 - 4,500', value: '4000-4500' },
  { label: 'من 4,500 - 5,000', value: '4500-5000' },
  { label: 'أكثر من 5,000', value: '5000+' },
]

const faqItems = [
  { q: 'كيف طريقة شراء سيارة؟', a: 'تتم في البداية عملية شراء السيارة من خلال دفع عربون, هذا العربون مخصوم من سعر السيارة الاجمالي و مسترد في حال عدم اتمام عملية الشراء شرط عدم تثبيت حجز السيارة.' },
  { q: 'كيف أدفع قيمة السيارة؟', a: 'يمكنك دفع باقي قيمة السيارة وذلك بعد تأكيد حجز السيارة مع موظف المبيعات المختص، ويكون ذلك بواسطة خدمة سداد السعودية وهي الأسهل والأسرع أو حوالة مصرفية لحساب الشركة.' },
  { q: 'هل موقعكم معتمد من قبل وزارة التجارة؟', a: 'نعم! هذا الموقع موثق من وزارة التجارة والاستثمار وبدعم من شركة علم, بسجل تجاري رقم 1010538980.' },
  { q: 'ما هي طرق الدفع المتاحة؟', a: 'نقبل الدفع النقدي، التحويل البنكي، والتقسيط عبر تمارا.' },
]



const offers = [
  { title: 'قسمها مع اموال', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: '🛒', href: '/listings' },
  { title: 'قسطها مع تمارا', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', emoji: '💳', href: '/listings' },
  { title: 'سيارات مستعملة بأقل من 30,000', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', emoji: '🚗', href: '/listings' },
  { title: 'مستعملة كأنها وكالة', bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', emoji: '✨', href: '/listings' },
]

const cardGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
]

const recommendedCars = [
  { name: 'تويوتا كامري 2020', price: '89,000', installment: '1,200' },
  { name: 'هيونداي النترا 2021', price: '65,000', installment: '890' },
  { name: 'مازدا CX-9 2022', price: '125,000', installment: '1,700' },
  { name: 'نيسان باترول 2020', price: '185,000', installment: '2,500' },
  { name: 'كيا سبورتاج 2021', price: '82,000', installment: '1,100' },
  { name: 'شفروليه تاهو 2022', price: '155,000', installment: '2,100' },
  { name: 'مرسيدس E300 2021', price: '220,000', installment: '3,000' },
  { name: 'فورد اكسبلورر 2020', price: '98,000', installment: '1,350' },
]

export default async function HomePage() {
  const locale = 'ar'
  const listings = await getRecentListings()

  return (
    <div className="space-y-0 pb-0">
      <JsonLd data={buildWebSiteSchema()} />

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out both; }
        .animate-delay-1 { animation-delay: 0.1s; }
        .animate-delay-2 { animation-delay: 0.2s; }
        .animate-delay-3 { animation-delay: 0.3s; }
        .animate-delay-4 { animation-delay: 0.4s; }
        .animate-delay-5 { animation-delay: 0.5s; }
        .animate-delay-6 { animation-delay: 0.6s; }
        .animate-delay-7 { animation-delay: 0.7s; }
        .animate-delay-8 { animation-delay: 0.8s; }
        .marquee-mask { mask-image: linear-gradient(to left, transparent 0%, black 5%, black 95%, transparent 100%); -webkit-mask-image: linear-gradient(to left, transparent 0%, black 5%, black 95%, transparent 100%); }
        .marquee-track { display: flex; gap: 2.5rem; width: max-content; animation: marquee 25s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        .float-card { animation: floatCard 3s ease-in-out infinite; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .hero-banner { position: relative; min-width: 100%; scroll-snap-align: start; }
        .hero-banner img { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 60%, transparent 100%); }
        .brand-scroll::-webkit-scrollbar { display: none; }
        .brand-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes skeleton { 0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; } }
        .skeleton-anim { background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%); background-size: 200px 100%; animation: skeleton 1.5s ease-in-out infinite; }
      `}</style>

      {/* ===== 1. AD BANNER ===== */}
      <section className="relative overflow-hidden">
        <Link href={`/${locale}/listings`} className="block">
          <img
            src="/images/hero-ad.png"
            alt="إعلان"
            className="w-full h-[200px] sm:h-[280px] md:h-[360px] lg:h-[420px] object-cover"
          />
        </Link>
      </section>

      {/* ===== 2. SEARCH + CATEGORY CARDS ===== */}
      <section className="px-4 -mt-[65px] relative z-20">
        <div className="max-w-[958px] mx-auto">
          <div className="bg-white rounded-lg shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-4 sm:p-6">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="ابحث عن الماركة او الموديل"
                className="w-full h-11 sm:h-14 pr-12 pl-4 rounded-lg border border-gray-200 bg-gray-50 text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f1cd31]/50 focus:border-[#f1cd31] transition-colors"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[12px]">
              {[
                { img: '/images/usedCars.svg', title: 'السيارات المستعملة', desc: 'مضمونة ومفحوصة', href: '/listings' },
                { img: '/images/newCars.svg', title: 'السيارات الجديدة', desc: 'ضمان الوكالة', href: '/listings' },
                { img: '/images/sellTous.svg', title: 'بيعنا سيارتك', desc: 'نشتريها بافضل سعر', href: '/listings/new' },
                { img: '/images/financeCar.svg', title: 'تمويل السيارات', desc: 'خيارات تمويل متعددة', href: '/finance' },
              ].map((card) => (
                <Link key={card.title} href={`/${locale}${card.href}`}
                  className="flex flex-col gap-1.5 justify-center items-center rounded-lg bg-gray-50 border border-gray-100 p-4 sm:p-5 hover:shadow-md hover:border-[#f1cd31]/30 transition-all duration-200"
                >
                  <img src={card.img} width="36" height="36" alt={card.title} className={card.title === 'تمويل السيارات' ? 'relative left-[4px]' : ''} />
                  <strong className="text-xs sm:text-sm font-bold text-[#484848]">{card.title}</strong>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-400">{card.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. BROWSE BY MAKE ===== */}
      <BrandGrid brands={brands} locale={locale} />

      {/* ===== 4. MONTHLY PAYMENT + BANKS MARQUEE + INSTALLMENT ===== */}
      <section className="mt-8 sm:mt-12">
        <div className="bg-[#F1F6FC] py-8 sm:py-12">
          <div className="max-w-[1320px] mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="text-[#1a1a1a] text-xl sm:text-3xl font-bold">
                اختر السيارة اللي تناسب <span className="font-bold" style={{ color: '#3c56d4' }}>قسطك الشهري</span>
              </h2>
            </div>
            {/* Bank Logos Marquee */}
            <div className="overflow-hidden py-3 marquee-mask">
              <div className="marquee-track">
                {banks.concat(banks).map((bank, i) => (
                  <div key={`${bank.name}-${i}`} className="flex-shrink-0 flex items-center">
                    <img src={bank.img} alt={bank.name} className="h-6 sm:h-7 w-auto object-contain" style={{ minWidth: '90px' }} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
            {/* Installment Ranges */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6">
              {installmentRanges.map((range) => (
                <Link
                  key={range.value}
                  href={`/${locale}/listings`}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm font-medium hover:bg-[#154F9C] hover:text-white hover:border-[#154F9C] transition-all duration-200 shadow-sm"
                >
                  {range.label}
                </Link>
              ))}
            </div>
            {/* Real Car Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8">
              {recommendedCars.slice(0, 4).map((car, i) => (
                <Link key={i} href={`/${locale}/listings`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                  <div className="aspect-[16/10] relative overflow-hidden flex items-center justify-center" style={{ background: cardGradients[i] }}>
                    <Car className="h-10 w-10 sm:h-14 sm:w-14 text-white/70" />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold bg-[#3c56d4] text-white px-2 py-0.5 rounded-full">قسط</span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-[#1a1a1a] leading-tight">{car.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{car.price} ريال</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold" style={{ color: '#3c56d4' }}>قسط شهري {car.installment} ريال</span>
                    <div className="flex items-center gap-1 mt-1">
                      <img src={`${CDN}/bnpl_tabby_logo.png`} alt="tabby" className="h-3 w-auto" />
                      <img src={`${CDN}/bnpl_tamara_logo.png`} alt="tamara" className="h-3 w-auto" />
                      <img src={`${CDN}/bnpl_amwal_logo.png`} alt="amwal" className="h-3 w-auto" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Link href={`/${locale}/listings`}>
                <Button className="bg-[#154F9C] text-white hover:bg-[#154F9C]/90 rounded-full px-8 h-11 text-sm">اعرض الكل</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. OIL BANNER ===== */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="flex items-center min-h-[140px] sm:min-h-[180px]">
          <div className="max-w-[1320px] mx-auto px-4 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl sm:text-3xl">🛢️</div>
                <div>
                  <h3 className="text-white text-base sm:text-xl font-bold">اطلب زيت سيارتك الآن</h3>
                  <p className="text-white/70 text-xs sm:text-sm">واستلمه من أقرب محطة لك</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[9px] sm:text-[10px] text-white/60 max-w-[160px] sm:max-w-[180px] text-left leading-tight">تطبق الشروط و الأحكام</span>
                <Link href={`/${locale}/parts`}>
                  <Button className="bg-white text-gray-900 hover:bg-white/90 rounded-full px-5 sm:px-6 h-8 sm:h-10 text-xs sm:text-sm font-bold">اطلب الآن</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. WHY CHOOSE US ===== */}
      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-2xl font-bold text-[#1a1a1a]">ليه تشتري سيارتك المستعملة من BD؟</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: <RefreshCw className="h-5 w-5 sm:h-7 sm:w-7" />, title: 'تقدر تجربها 10 أيام', desc: 'لك مدة 10 أيام لتجربة السيارة وإذا ما عجبتك تقدر ترجعها' },
              { icon: <Shield className="h-5 w-5 sm:h-7 sm:w-7" />, title: 'ضمان حتى 3 سنوات', desc: 'ضمان شامل يغطيك حتى 3 سنوات ضد عيوب السيارة' },
              { icon: <BadgeCheck className="h-5 w-5 sm:h-7 sm:w-7" />, title: 'مفحوصة لأكثر من 200 نقطة', desc: 'السيارة مفحوصة بشكل احترافي من خبراء معتمدين' },
              { icon: <Truck className="h-5 w-5 sm:h-7 sm:w-7" />, title: 'نوصلها لين عندك', desc: 'نوصل السيارة لأي مكان في المملكة وانت مرتاح' },
            ].map((item) => (
              <div key={item.title} className="text-center p-4 sm:p-7 rounded-2xl border border-gray-100 bg-gray-50/50 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-[#f1cd31]/10 text-[#1a1a1a] flex items-center justify-center mx-auto mb-2 sm:mb-4">{item.icon}</div>
                <h3 className="text-xs sm:text-base font-bold text-[#1a1a1a] mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-[10px] sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-5 sm:mt-6">
            <Link href={`/${locale}/pages/about`}>
              <Button variant="outline" className="rounded-full text-xs sm:text-sm border-[#154F9C] text-[#154F9C] hover:bg-[#154F9C] hover:text-white transition-all">اعرف أكثر عن مزايا BD</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 7. RECOMMENDATION SLIDER "سيارات لك" ===== */}
      <section className="py-8 sm:py-12 bg-gray-50 px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-[#1a1a1a]">سيارات لك</h2>
            <Link href={`/${locale}/listings`} className="text-sm text-[#154F9C] font-medium underline underline-offset-2">شاهد الكل</Link>
          </div>
          <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-2 brand-scroll" style={{ scrollSnapType: 'x mandatory' }}>
            {recommendedCars.map((car, i) => (
              <Link key={i} href={`/${locale}/listings`} className="flex-shrink-0 w-[200px] sm:w-[240px] bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group" style={{ scrollSnapAlign: 'start' }}>
                <div className="aspect-[16/10] relative overflow-hidden flex items-center justify-center" style={{ background: cardGradients[i % cardGradients.length] }}>
                  <Car className="h-10 w-10 sm:h-14 sm:w-14 text-white/70" />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold bg-[#f1cd31] text-[#1a1a1a] px-2 py-0.5 rounded-full">قسط</span>
                  </div>
                </div>
                <div className="p-3 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-[#1a1a1a] leading-tight">{car.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{car.price} ريال</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600 font-medium">
                    <span>قسط شهري {car.installment} ريال</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <img src={`${CDN}/bnpl_tabby_logo.png`} alt="tabby" className="h-3 w-auto" />
                    <img src={`${CDN}/bnpl_tamara_logo.png`} alt="tamara" className="h-3 w-auto" />
                    <img src={`${CDN}/bnpl_amwal_logo.png`} alt="amwal" className="h-3 w-auto" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. CAR LISTINGS WITH INSTALLMENT BADGES ===== */}
      <section className="py-8 sm:py-12 bg-white px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-[#1a1a1a]">سيارات للبيع في السعودية</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">أحدث السيارات المضافة على المنصة</p>
            </div>
            <Link href={`/${locale}/listings`}>
              <Button variant="outline" className="rounded-full text-xs sm:text-sm">عرض الكل <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /></Button>
            </Link>
          </div>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.slice(0, 8).map((listing: any, i: number) => (
                <div key={listing.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <VehicleCard listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="لا توجد إعلانات حالياً" description="كن أول من يضيف إعلاناً لسيارته"
              action={<Link href={`/${locale}/listings/new`}><Button variant="primary">أضف إعلانك الآن</Button></Link>}
            />
          )}
          <div className="flex justify-center mt-6 gap-3">
            <Link href={`/${locale}/listings`}>
              <Button className="bg-[#154F9C] text-white hover:bg-[#154F9C]/90 rounded-full px-8 h-11 text-sm">اعرض الكل</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 9. EXAMPLE CAR CARD ===== */}
      <section className="py-8 sm:py-12 bg-gray-50 px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-[#1a1a1a]">شاهد مثال حي لسيارة</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">اضغط على السيارة لمشاهدة التفاصيل الكاملة</p>
          </div>
          <Link
            href={`/${locale}/listings`}
            className="float-card group block max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center">
                <Car className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400" />
              </div>
              <div className="absolute top-3 left-3">
                <span className="text-[10px] sm:text-xs font-bold bg-[#f1cd31] text-[#1a1a1a] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">مثال</span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="text-[10px] sm:text-xs font-bold bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">قسطها مع تمارا</span>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1a1a1a] text-sm sm:text-base">ماكسيوس D60 Luxury 2022</h3>
                <span className="text-base sm:text-lg font-bold text-[#154F9C]">35,700 ريال</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500">
                <span>32,519 كم</span>
                <span>بنزين</span>
                <span>أوتوماتيك</span>
                <span>برتقالي</span>
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-emerald-600 font-medium">
                <span>قسط شهري 778 ريال</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#154F9C] font-medium">
                <BadgeCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>مستعملة · مفحوصة ومضمونة</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ===== 10. HOW IT WORKS ===== */}
      <section className="py-8 sm:py-12 bg-white px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-3xl font-bold text-[#1a1a1a]">كيف تشتري سيارتك من BD؟</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'اختر السيارة اللي تناسبك', desc: 'تشكيلة واسعة من السيارات الجديدة والمستعملة.' },
              { step: '02', title: 'احجزها بضغطة زر', desc: 'اختر الطريق اللي يريحك ان كان كاش او تمويل ووفرنالك حلول تمويلية متكاملة تناسب احتياجاتك.' },
              { step: '03', title: 'ادفع باقي المبلغ', desc: 'كمّل باقي المبلغ بالطريقة اللي تناسبك بكل سهولة وأمان، سواء كاش أو تمويل.' },
              { step: '04', title: 'توصلك لين عندك!', desc: 'نوصّل السيارة للعنوان اللي تختاره، وتسلمها لين باب بيتك بكل راحة.' },
            ].map((item) => (
              <div key={item.step} className="text-center p-5 sm:p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:shadow-md transition-all duration-300">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-[#f1cd31] text-[#1a1a1a] text-lg sm:text-2xl font-bold flex items-center justify-center mx-auto mb-3 sm:mb-4">{item.step}</div>
                <h3 className="text-sm sm:text-lg font-bold text-[#1a1a1a] mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-[10px] sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 11. MORE CAR LISTINGS ===== */}
      <section className="py-8 sm:py-12 bg-gray-50 px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-[#1a1a1a]">سيارات للبيع في السعودية</h2>
            <Link href={`/${locale}/listings`}>
              <Button variant="outline" className="rounded-full text-xs sm:text-sm">شاهد جميع السيارات <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /></Button>
            </Link>
          </div>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.slice(0, 4).map((listing: any, i: number) => (
                <div key={listing.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <VehicleCard listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="لا توجد إعلانات حالياً" description="كن أول من يضيف إعلاناً لسيارته"
              action={<Link href={`/${locale}/listings/new`}><Button variant="primary">أضف إعلانك الآن</Button></Link>}
            />
          )}
        </div>
      </section>

      {/* ===== 12. BEST OFFERS ===== */}
      <section className="py-8 sm:py-12 bg-white px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-[#1a1a1a]">أفضل العروض</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {offers.map((offer) => (
              <Link key={offer.title} href={`/${locale}${offer.href}`}
                className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="aspect-[4/3] relative overflow-hidden flex items-center justify-center" style={{ background: offer.bg }}>
                  <span className="text-5xl sm:text-7xl">{offer.emoji}</span>
                </div>
                <div className="p-3 sm:p-4">
                  <span className="text-xs sm:text-sm font-bold text-[#1a1a1a]">{offer.title}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-5 sm:mt-6">
            <Link href={`/${locale}/listings`}>
              <Button variant="outline" className="rounded-full text-xs sm:text-sm">شاهد جميع العروض</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 13. FAQ ===== */}
      <section className="py-8 sm:py-12 bg-gray-50 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-2xl font-bold text-[#1a1a1a]">أسئلة متكررة</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 hover:border-gray-200" open={i === 0}>
                <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer list-none">
                  <span className="font-medium text-[#1a1a1a] text-xs sm:text-sm">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-open:rotate-180 transition-transform duration-300 flex-shrink-0" />
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-[10px] sm:text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3 sm:pt-4">{faq.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-5 sm:mt-6">
            <Link href={`/${locale}/pages/faq`}>
              <Button variant="outline" className="rounded-full text-xs sm:text-sm">المزيد من الأسئلة المتكررة</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 14. SUPPORT SECTION ===== */}
      <section className="py-8 sm:py-12 bg-white px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-lg sm:text-2xl font-bold text-[#1a1a1a] mb-2">عندك أي استفسار؟</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">نخدمك طيلة أيام الاسبوع خلال اوقات العمل التالية:</p>
            <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">من السبت حتى الخميس من الساعة 9 صباحاً حتى 11مساءً, الجمعة من 1 مساءً الى 11 مساءً</p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              <a href="tel:920005379">
                <Button className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90 rounded-full px-6 sm:px-8 h-10 sm:h-12 text-xs sm:text-base">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 ml-1.5 sm:ml-2" />
                  920005379
                </Button>
              </a>
              <a href="https://wa.me/966920005379" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="rounded-full px-6 sm:px-8 h-10 sm:h-12 text-xs sm:text-base border-green-600 text-green-600 hover:bg-green-50">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 ml-1.5 sm:ml-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  تواصل عبر واتساب
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 15. FINAL CTA ===== */}
      <section className="py-10 sm:py-16 bg-[#1a1a1a] text-white px-4">
        <div className="text-center max-w-2xl mx-auto">
          <Car className="h-8 w-8 sm:h-12 sm:w-12 text-[#f1cd31] mx-auto mb-4 sm:mb-5 float-card" />
          <h2 className="text-lg sm:text-3xl font-bold mb-2 sm:mb-3">جاهز تشتري سيارتك؟</h2>
          <p className="text-white/60 text-xs sm:text-base mb-6 sm:mb-8">انضم إلى آلاف العملاء الذين وثقوا في BD لشراء سياراتهم</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={`/${locale}/listings`}>
              <Button size="lg" className="bg-[#f1cd31] text-[#1a1a1a] hover:bg-[#f1cd31]/90 rounded-full px-6 sm:px-8 h-10 sm:h-14 text-xs sm:text-base font-bold">
                ابدأ البحث الآن <Send className="h-3 w-3 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              </Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-6 sm:px-8 h-10 sm:h-14 text-xs sm:text-base">تواصل معنا</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
