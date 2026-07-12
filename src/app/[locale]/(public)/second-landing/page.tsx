import type { Metadata } from 'next'
import Link from 'next/link'
import { VehicleCard } from '@/components/vehicle/vehicle-card'
import { PageContainer } from '@/components/ui/page-container'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { JsonLd } from '@/components/shared/json-ld'
import { buildMetadata, buildWebSiteSchema } from '@/lib/seo'
import {
  Car, Star, Shield, Truck, Users,
  ChevronLeft, Headphones, Handshake, CreditCard,
  ArrowLeft, Send, ChevronDown, Search
} from 'lucide-react'
import { fetchSupabase } from '@/lib/supabase/fetch-client'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'BD - سيارات للبيع في السعودية',
    description: 'أفضل منصة لبيع وشراء السيارات في السعودية. تصفح آلاف السيارات المعروضة للبيع، قارن الأسعار، وتواصل مع البائعين مباشرة.',
    path: '/second-landing',
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
  { name: 'ام جي', img: '/images/brands/mg.png' },
  { name: 'سوزوكي', img: '/images/brands/suzuki.png' },
  { name: 'جيلي', img: '/images/brands/geely.png' },
  { name: 'شفروليه', img: '/images/brands/chevrolet.png' },
  { name: 'لكزس', img: '/images/brands/lexus.png' },
  { name: 'بي ام دبليو', img: '/images/brands/bmw.png' },
  { name: 'مرسيدس', img: '/images/brands/mercedes.png' },
]

const faqItems = [
  { q: 'كيف أشتري سيارة من BD؟', a: 'تصفح الإعلانات، اختر السيارة المناسبة، تواصل مع البائع، وأكمل عملية الشراء بكل أمان.' },
  { q: 'هل السيارات مضمونة؟', a: 'نعم، جميع السيارات المعروضة تمر بفحص فني شامل لضمان جودتها.' },
  { q: 'ما هي طرق الدفع المتاحة؟', a: 'نقبل الدفع النقدي، التحويل البنكي، والتقسيط عبر تمارا وأموال.' },
  { q: 'كم تكلفة الفحص؟', a: 'خدمة الفحص الأساسية مجانية للمشترين. للفحص الشامل هناك رسوم رمزية.' },
]

export default async function SecondLandingPage() {
  const locale = 'ar'
  const listings = await getRecentListings()

  return (
    <div className="space-y-0 pb-0">
      <JsonLd data={buildWebSiteSchema()} />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[#f1cd31]">
        <div className="relative z-10 px-4 sm:px-8 py-10 sm:py-14 md:py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-tight mb-3">
              سيارات للبيع في السعودية
            </h1>
            <p className="text-base sm:text-lg text-[#1a1a1a]/70 max-w-xl mx-auto mb-6">
              تصفح آلاف السيارات المعروضة للبيع من مالكين ومعارض موثوقين
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/${locale}/listings`}>
                <Button size="lg" className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90 rounded-full px-8 h-12 sm:h-14 text-sm sm:text-base">
                  تصفح السيارات
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                </Button>
              </Link>
              <Link href={`/${locale}/listings/new`}>
                <Button size="lg" variant="outline" className="bg-white/90 border-0 hover:bg-white rounded-full px-8 h-12 sm:h-14 text-sm sm:text-base">
                  بيع سيارتك
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-4 sm:px-8">
        <div className="max-w-[958px] mx-auto -mt-8 relative z-20">
          <div className="bg-white rounded-lg shadow-[0_0_10px_rgba(188,188,188,0.4)] p-4 sm:p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن الماركة او الموديل"
                className="w-full h-12 sm:h-14 pr-12 pl-4 rounded-lg border border-gray-200 bg-gray-50 text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f1cd31]/50 focus:border-[#f1cd31] transition-colors"
              />
              <img
                src="/images/search-icon.svg"
                alt="search"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 opacity-50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Cards: Used, New, Sell, Finance */}
      <section className="px-4 sm:px-8 mt-0">
        <div className="max-w-[958px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <Link
              href={`/${locale}/listings`}
              className="flex flex-col gap-2 justify-center items-center rounded-lg bg-white shadow-[0_0_12px_rgba(0,0,0,0.10)] p-4 sm:p-5 hover:shadow-md transition-shadow"
            >
              <img src="/images/usedCars.svg" width="40" height="40" alt="السيارات المستعملة" />
              <strong className="text-sm sm:text-base font-bold text-[#484848]">السيارات المستعملة</strong>
              <span className="text-xs sm:text-sm font-medium text-[#484848]">مضمونة ومفحوصة</span>
            </Link>
            <Link
              href={`/${locale}/listings`}
              className="flex flex-col gap-2 justify-center items-center rounded-lg bg-white shadow-[0_0_12px_rgba(0,0,0,0.10)] p-4 sm:p-5 hover:shadow-md transition-shadow"
            >
              <img src="/images/newCars.svg" width="40" height="40" alt="السيارات الجديدة" />
              <strong className="text-sm sm:text-base font-bold text-[#484848]">السيارات الجديدة</strong>
              <span className="text-xs sm:text-sm font-medium text-[#484848]">ضمان الوكالة</span>
            </Link>
            <Link
              href={`/${locale}/listings/new`}
              className="flex flex-col gap-2 justify-center items-center rounded-lg bg-white shadow-[0_0_12px_rgba(0,0,0,0.10)] p-4 sm:p-5 hover:shadow-md transition-shadow"
            >
              <img src="/images/sellTous.svg" width="40" height="40" alt="بيعنا سيارتك" />
              <strong className="text-sm sm:text-base font-bold text-[#484848]">بيعنا سيارتك</strong>
              <span className="text-xs sm:text-sm font-medium text-[#484848]">نشتريها بافضل سعر</span>
            </Link>
            <Link
              href={`/${locale}/finance`}
              className="flex flex-col gap-2 justify-center items-center rounded-lg bg-white shadow-[0_0_12px_rgba(0,0,0,0.10)] p-4 sm:p-5 hover:shadow-md transition-shadow"
            >
              <img src="/images/financeCar.svg" width="50" height="50" alt="تمويل السيارات" className="relative left-[6px]" />
              <strong className="text-sm sm:text-base font-bold text-[#484848]">تمويل السيارات</strong>
              <span className="text-xs sm:text-sm font-medium text-[#484848]">خيارات تمويل متعددة</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Make */}
      <section className="mt-6 sm:mt-10 px-4 sm:px-8">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#154F9C] text-lg sm:text-xl font-bold">تصفح السيارات حسب الماركة</h2>
            <Link href={`/${locale}/listings`} className="text-sm text-[#154F9C] font-medium underline underline-offset-2">
              شاهد جميع الماركات
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.img}
                href={`/${locale}/listings`}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-gray-100 bg-white hover:border-[#f1cd31]/50 hover:shadow-md transition-all duration-200"
              >
                <div className="h-14 w-14 flex items-center justify-center">
                  <img src={brand.img} alt={brand.name} className="h-full w-full object-contain" loading="lazy" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Payment - Banks */}
      <section className="mt-8 sm:mt-12">
        <div className="relative before:block before:content-[''] before:w-full before:h-[60%] before:absolute before:top-0 before:left-0 before:z-[-1] before:bg-[#F1F6FC]">
          <div className="py-6 sm:py-10 max-w-[1320px] mx-auto px-4 sm:px-8">
            <div className="text-center mb-6">
              <h2 className="text-[#1a1a1a] text-xl sm:text-3xl font-bold">
                اختر السيارة اللي تناسب <span className="font-bold">قسطك الشهري</span>
              </h2>
            </div>
            <div className="overflow-hidden py-2 marquee-container">
              <style>{`
                .marquee-container { mask-image: linear-gradient(to left, transparent 0%, black 5%, black 95%, transparent 100%); -webkit-mask-image: linear-gradient(to left, transparent 0%, black 5%, black 95%, transparent 100%); }
                .marquee-track { display: flex; gap: 2.5rem; width: max-content; animation: marqueeScroll 30s linear infinite; }
                .marquee-track:hover { animation-play-state: paused; }
                @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
              `}</style>
              <div className="marquee-track">
                {banks.concat(banks).map((bank, i) => (
                  <div key={`${bank.name}-${i}`} className="flex-shrink-0 flex items-center">
                    <img
                      src={bank.img}
                      alt={bank.name}
                      className="h-6 sm:h-8 w-auto object-contain"
                      style={{ minWidth: '100px' }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              <Link href={`/${locale}/listings`}>
                <Button size="lg" className="bg-[#154F9C] text-white hover:bg-[#154F9C]/90 rounded-full px-8 h-12 text-sm sm:text-base">
                  تصفح السيارات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Example Car - Maxus D60 */}
      <section className="py-8 sm:py-12 bg-gray-50 px-4 sm:px-8">
        <style>{`
          @keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          .float-card { animation: floatCard 3s ease-in-out infinite; }
        `}</style>
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">شاهد مثال حي لسيارة</h2>
            <p className="text-sm text-gray-500 mt-1">اضغط على السيارة لمشاهدة التفاصيل الكاملة</p>
          </div>
          <Link
            href={`/${locale}/second-landing/example/maxus-d60`}
            className="float-card group block max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
              <img
                src="https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-1783262911-200_cut.jpg?v=3"
                alt="ماكسيوس D60 2022"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="text-xs font-bold bg-[#f1cd31] text-[#1a1a1a] px-3 py-1 rounded-full">مثال</span>
              </div>
            </div>
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1a1a1a]">ماكسيوس D60 Luxury 2022</h3>
                <span className="text-lg font-bold text-[#154F9C]">35,700 ريال</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>32,519 كم</span>
                <span>بنزين</span>
                <span>أوتوماتيك</span>
                <span>برتقالي</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                <span>قسط شهري 778 ريال</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#154F9C] font-medium">
                <span>اضغط لعرض التفاصيل ←</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-8 sm:py-12 px-4 sm:px-8">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">سيارات للبيع في السعودية</h2>
              <p className="text-sm text-gray-500 mt-1">أحدث السيارات المضافة على المنصة</p>
            </div>
            <Link href={`/${locale}/listings`}>
              <Button variant="outline" className="rounded-full text-sm">
                عرض الكل <ArrowLeft className="h-4 w-4 mr-1" />
              </Button>
            </Link>
          </div>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.slice(0, 8).map((listing: any) => (
                <VehicleCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="لا توجد إعلانات حالياً"
              description="كن أول من يضيف إعلاناً لسيارته"
              action={
                <Link href={`/${locale}/listings/new`}>
                  <Button variant="primary">أضف إعلانك الآن</Button>
                </Link>
              }
            />
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 sm:py-12 bg-gray-50 px-4 sm:px-8">
        <PageContainer>
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">ليه تشتري سيارتك المستعملة من BD؟</h2>
            <p className="text-sm text-gray-500 mt-2">نوفر لك تجربة شراء آمنة وسهلة</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Shield className="h-5 w-5" />, title: 'فحص احترافي', desc: 'جميع السيارات مفحوصة من قبل خبراء معتمدين' },
              { icon: <Shield className="h-5 w-5" />, title: 'شراء آمن', desc: 'عملية شراء مضمونة ومؤمنة بالكامل' },
              { icon: <Truck className="h-5 w-5" />, title: 'توصيل لباب البيت', desc: 'نوصل سيارتك لأي مكان في المملكة' },
              { icon: <Headphones className="h-5 w-5" />, title: 'دعم 24/7', desc: 'فريق دعم متاح على مدار الساعة' },
              { icon: <Handshake className="h-5 w-5" />, title: 'ضمان 7 أيام', desc: 'لك الحق في إعادة السيارة خلال 7 أيام' },
              { icon: <CreditCard className="h-5 w-5" />, title: 'تقسيط بدون بنك', desc: 'خطط تقسيط مرنة عبر تمارا وأموال' },
            ].map((item) => (
              <div key={item.title} className="text-center p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-all">
                <div className="h-10 w-10 rounded-full bg-[#f1cd31]/10 text-[#1a1a1a] flex items-center justify-center mx-auto mb-3">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#1a1a1a] mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* How It Works */}
      <section className="py-8 sm:py-12 bg-white px-4 sm:px-8">
        <PageContainer>
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">كيف تشتري سيارتك من BD؟</h2>
            <p className="text-sm text-gray-500 mt-2">٣ خطوات بسيطة لامتلاك سيارتك</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'اختر السيارة', desc: 'تصفح آلاف السيارات واختر اللي تناسبك' },
              { step: '2', title: 'احجزها', desc: 'احجز سيارتك بضغطة زر وادفع العربون' },
              { step: '3', title: 'استلمها', desc: 'استلم سيارتك لباب البيت أو من المعرض' },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="h-16 w-16 rounded-full bg-[#f1cd31] text-[#1a1a1a] text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Best Offers */}
      <section className="py-8 sm:py-12 bg-gray-50 px-4 sm:px-8">
        <PageContainer>
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">أفضل العروض</h2>
            <p className="text-sm text-gray-500 mt-2">عروض حصرية على مجموعة مختارة من السيارات</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'قسمها مع أموال', icon: <CreditCard className="h-6 w-6" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
              { title: 'قسطها مع تمارا', icon: <CreditCard className="h-6 w-6" />, color: 'bg-purple-50 text-purple-600 border-purple-200' },
              { title: 'سيارات بأقل من ٣٠,٠٠٠', icon: <Car className="h-6 w-6" />, color: 'bg-blue-50 text-blue-600 border-blue-200' },
              { title: 'مستعملة كأنها وكالة', icon: <Star className="h-6 w-6" />, color: 'bg-amber-50 text-amber-600 border-amber-200' },
            ].map((offer) => (
              <Link
                key={offer.title}
                href={`/${locale}/listings`}
                className={`rounded-2xl border p-5 sm:p-6 text-center hover:shadow-lg transition-all ${offer.color}`}
              >
                <div className="flex justify-center mb-3">{offer.icon}</div>
                <span className="text-sm font-bold">{offer.title}</span>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-12 bg-white px-4 sm:px-8">
        <PageContainer>
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">فخورين بعملائنا</h2>
            <p className="text-sm text-gray-500 mt-2">آراء العملاء عن تجربتهم مع BD</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'خالد', text: 'تجربة رائعة، السيارة وصلت بحالة ممتازة والتوصيل كان سريع جداً', rating: 5 },
              { name: 'سارة', text: 'أول مرة أشتري سيارة أونلاين، لكن العملية كانت سهلة وآمنة', rating: 5 },
              { name: 'محمد', text: 'خدمة الفحص المهني أعطتني ثقة كاملة في الشراء. أنصح الجميع', rating: 5 },
            ].map((t) => (
              <div key={t.name} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#f1cd31] text-[#f1cd31]" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{t.text}</p>
                <div className="text-sm font-semibold text-[#1a1a1a]">{t.name}</div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* FAQ */}
      <section className="py-8 sm:py-12 bg-gray-50 px-4 sm:px-8">
        <PageContainer>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">أسئلة متكررة</h2>
              <p className="text-sm text-gray-500 mt-2">إجابات على أكثر الأسئلة شيوعاً</p>
            </div>
            <div className="space-y-3">
              {faqItems.map((faq, i) => (
                <details key={i} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <span className="font-medium text-[#1a1a1a] text-sm">{faq.q}</span>
                    <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 bg-[#1a1a1a] text-white px-4 sm:px-8">
        <PageContainer>
          <div className="text-center max-w-2xl mx-auto">
            <Car className="h-10 w-10 sm:h-12 sm:w-12 text-[#f1cd31] mx-auto mb-5" />
            <h2 className="text-xl sm:text-3xl font-bold mb-3">جاهز تشتري سيارتك؟</h2>
            <p className="text-white/60 text-sm sm:text-base mb-8">انضم إلى آلاف العملاء الذين وثقوا في BD لشراء سياراتهم</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/${locale}/listings`}>
                <Button size="lg" className="bg-[#f1cd31] text-[#1a1a1a] hover:bg-[#f1cd31]/90 rounded-full px-8 h-12 sm:h-14 text-sm sm:text-base font-bold">
                  ابدأ البحث الآن
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                </Button>
              </Link>
              <Link href={`/${locale}/contact`}>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 h-12 sm:h-14 text-sm sm:text-base">
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  )
}
