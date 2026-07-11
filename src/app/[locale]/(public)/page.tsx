import type { Metadata } from 'next'
import Link from 'next/link'
import { getVehicles, getMakes } from '@/lib/actions/vehicle-actions'
import { VehicleCard } from '@/components/vehicle/vehicle-card'
import { FeaturedVehicleCard } from '@/components/vehicle/featured-vehicle-card'
import { HeroSearch } from '@/components/search/hero-search'
import { IconCard } from '@/components/ui/icon-card'
import { SectionHeading } from '@/components/ui/section-heading'
import { PageContainer } from '@/components/ui/page-container'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { JsonLd } from '@/components/shared/json-ld'
import { buildMetadata, buildWebSiteSchema } from '@/lib/seo'
import { Car, ShoppingCart, ClipboardCheck, Search, Wrench, Building2, Shield, Truck, Users } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Saudi Automotive Marketplace',
    description: 'Buy and sell cars in Saudi Arabia. Browse thousands of new and used vehicles, compare prices, and connect with dealers.',
    path: '/',
  })
}

export const revalidate = 300

async function getVehiclesFetch() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) return []

    const res = await fetch(`${url}/rest/v1/vehicle_listings?select=id,slug,title,title_ar,price,status&status=in.(published,published_with_trusted_badge,reserved)&limit=8`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      next: { revalidate: 0 },
    })
    if (!res.ok) { console.error('[fetch] error:', res.status, await res.text()); return [] }
    const data = await res.json()
    console.log('[fetch] got', data.length, 'listings')
    return data
  } catch (e) {
    console.error('[fetch] exception:', e)
    return []
  }
}

export default async function HomePage() {
  const locale = 'ar'
  const listings = await getVehiclesFetch()
  const { data: vehiclesData } = await getVehicles({ pageSize: 8 })
  const listingsToShow = listings.length > 0 ? listings : vehiclesData
  const makes = await getMakes()
  const listingCount = listingsToShow.length

  const quickActions = [
    { icon: <Car className="h-6 w-6" />, title: 'شراء سيارة', description: 'تصفح آلاف السيارات المعروضة', href: '/listings' },
    { icon: <ShoppingCart className="h-6 w-6" />, title: 'بيع سيارة', description: 'اعرض سيارتك للبيع الآن', href: '/listings/new' },
    { icon: <ClipboardCheck className="h-6 w-6" />, title: 'فحص سيارة', description: 'افحص سيارتك عند خبراء', href: '/inspect' },
    { icon: <Search className="h-6 w-6" />, title: 'اطلب سيارة', description: 'نحن نبحث عن سيارتك المثالية', href: '/request' },
    { icon: <Wrench className="h-6 w-6" />, title: 'قطع الغيار', description: 'قطع غيار أصلية ومضمونة', href: '/parts' },
    { icon: <Building2 className="h-6 w-6" />, title: 'المعارض', description: 'تعامل مع أفضل المعارض', href: '/dealers' },
  ]

  const howItWorks = [
    { step: '01', icon: <Search className="h-6 w-6" />, title: 'ابحث', description: 'ابحث عن سيارتك المثالية من بين آلاف الخيارات' },
    { step: '02', icon: <ClipboardCheck className="h-6 w-6" />, title: 'قارن وافحص', description: 'قارن الأسعار واطلب فحصاً احترافياً للسيارة' },
    { step: '03', icon: <ShoppingCart className="h-6 w-6" />, title: 'اشترِ بأمان', description: 'تواصل مع البائع وأكمل عملية الشراء بكل ثقة' },
  ]

  const trustStats = [
    { icon: <Car className="h-5 w-5" />, value: `${listingCount}+`, label: 'سيارة معروضة' },
    { icon: <Users className="h-5 w-5" />, value: '10,000+', label: 'مستخدم نشط' },
    { icon: <Building2 className="h-5 w-5" />, value: '500+', label: 'معرض ووكيل' },
    { icon: <Shield className="h-5 w-5" />, value: '100%', label: 'عملية آمنة' },
  ]

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      <JsonLd data={buildWebSiteSchema()} />

      {/* Hero Section */}
      <section className="pt-4 sm:pt-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <HeroSearch makes={makes} />
        </div>
      </section>

      {/* Quick Actions */}
      <PageContainer>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <IconCard
              key={action.href}
              icon={action.icon}
              title={action.title}
              description={action.description}
              href={`/${locale}${action.href}`}
              variant="accent"
            />
          ))}
        </div>
      </PageContainer>

      {/* Featured Listings */}
      <section className="bg-muted/30 py-12 sm:py-16">
        <PageContainer>
          <SectionHeading
            title="سيارات مميزة"
            subtitle="اختياراتنا المميزة من أفضل السيارات المعروضة"
            action={
              <Link href={`/${locale}/listings`}>
                <Button variant="outline">عرض الكل</Button>
              </Link>
            }
          />
          {listingsToShow.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
              {listingsToShow.slice(0, 6).map((listing: any) => (
                <FeaturedVehicleCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="لا توجد سيارات مميزة بعد"
              description="سوف تظهر السيارات المميزة هنا قريباً"
            />
          )}
        </PageContainer>
      </section>

      {/* Latest Listings */}
      <PageContainer>
        <SectionHeading
          title="أحدث الإعلانات"
          subtitle="أحدث السيارات المضافة إلى منصتنا"
          action={
            <Link href={`/${locale}/listings`}>
              <Button variant="outline">عرض الكل</Button>
            </Link>
          }
        />
        {listingsToShow.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listingsToShow.map((listing: any) => (
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
      </PageContainer>

      {/* How It Works */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <PageContainer>
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-4">
              كيف تعمل المنصة
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              اشترِ سيارتك في ٣ خطوات بسيطة
            </h2>
            <p className="text-muted-foreground mt-2">عملية سهلة وآمنة من البداية إلى النهاية</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
                <div className="h-14 w-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-2xl font-bold text-muted-foreground/30 mb-1">{item.step}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Trust Stats */}
      <PageContainer>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustStats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* Dealer CTA */}
      <section className="bg-muted/30 py-12 sm:py-16">
        <PageContainer>
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-8 sm:p-12 text-center">
            <Truck className="h-10 w-10 text-accent mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">هل أنت معرض سيارات؟</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              انضم إلى منصتنا واعرض سياراتك لآلاف المشترين المحتملين
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href={`/${locale}/dealers/register`}>
                <Button variant="primary" size="lg">سجل معرضك الآن</Button>
              </Link>
              <Link href={`/${locale}/plans`}>
                <Button variant="outline" size="lg">عرض الباقات</Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  )
}
