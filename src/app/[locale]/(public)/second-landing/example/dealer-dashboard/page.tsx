'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { Store, Users, Eye, MessageSquare, TrendingUp, Star, Plus, X, Settings, BarChart3, Car, Calendar, Shield, ChevronUp, ChevronDown, Phone, Mail, MapPin, Camera } from 'lucide-react'

const dealer = {
  name: 'معرض الوهمي للسيارات',
  nameEn: 'Al-Wahmi Auto Showroom',
  logo: null,
  city: 'الرياض',
  phone: '+966 55 123 4567',
  email: 'info@wahmi-auto.sa',
  description: 'نحن معرض سيارات متكامل نقدم أفضل العروض على السيارات الجديدة والمستعملة، مع خدمة ما بعد البيع وضمان معتمد.',
  is_approved: true,
  rating: 4.5,
  totalRatings: 128,
  plan: {
    name: 'الباقة الاحترافية',
    nameEn: 'Professional Plan',
    price_monthly: 599,
    has_analytics: true,
    has_wholesale: true,
    has_auctions: false,
    has_featured: true,
    max_listings: 50,
    max_staff: 10,
    max_branches: 3,
  },
  stats: {
    totalViews: 12580,
    totalInquiries: 342,
    totalSales: 87,
  },
}

const dailyViews = Array.from({ length: 30 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (29 - i))
  return {
    date: d.toISOString().slice(0, 10),
    count: Math.floor(Math.random() * 80) + 10,
  }
})

const topListings = [
  { id: 1, make: 'MG', model: 'ZS', year: 2025, price: 78900, slug: 'mg-zs-2025', views: 2450, inquiries: 68, image: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/1060767953.jpg' },
  { id: 2, make: 'تويوتا', model: 'كامري', year: 2024, price: 125000, slug: 'toyota-camry-2024', views: 1890, inquiries: 52, image: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/1060767953.jpg' },
  { id: 3, make: 'هيونداي', model: 'إلنترا', year: 2025, price: 85900, slug: 'hyundai-elantra-2025', views: 1630, inquiries: 45, image: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/1060767953.jpg' },
]

const listings = [
  { id: 1, make: 'MG', model: 'ZS', year: 2025, trim: 'Luxury', price: 78900, status: 'active', image: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/1060767953.jpg', slug: 'mg-zs-2025', views: 2450, inquiries: 68, daysOnMarket: 12 },
  { id: 2, make: 'تويوتا', model: 'كامري', year: 2024, trim: 'GL', price: 125000, status: 'active', image: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/1060768573.jpg', slug: 'toyota-camry-2024', views: 1890, inquiries: 52, daysOnMarket: 25 },
  { id: 3, make: 'هيونداي', model: 'إلنترا', year: 2025, trim: 'Smart', price: 85900, status: 'pending', image: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/1060767865.jpg', slug: 'hyundai-elantra-2025', views: 0, inquiries: 0, daysOnMarket: 3 },
  { id: 4, make: 'نيسان', model: 'سنترا', year: 2024, trim: 'SV', price: 79900, status: 'sold', image: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/1060767608.jpg', slug: 'nissan-sentra-2024', views: 3200, inquiries: 89, daysOnMarket: 60 },
  { id: 5, make: 'شيفروليه', model: 'ماليبو', year: 2023, trim: 'LT', price: 95000, status: 'inactive', image: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/1060767388.jpg', slug: 'chevrolet-malibu-2023', views: 1500, inquiries: 34, daysOnMarket: 90 },
]

const staff = [
  { id: 1, name: 'أحمد العلي', phone: '+966 50 111 2233', role: 'admin', email: 'ahmed@wahmi-auto.sa' },
  { id: 2, name: 'محمد الحربي', phone: '+966 55 444 5566', role: 'manager', email: 'mohammed@wahmi-auto.sa' },
  { id: 3, name: 'سارة القحطاني', phone: '+966 54 777 8899', role: 'employee', email: 'sara@wahmi-auto.sa' },
  { id: 4, name: 'خالد الدوسري', phone: '+966 53 222 3344', role: 'employee', email: 'khalid@wahmi-auto.sa' },
]

const reviews = [
  { id: 1, user: 'فهد الزهراني', rating: 5, review: 'تعامل رائع وسعر ممتاز، أنصح بالتعامل معهم', date: '2026-06-15' },
  { id: 2, user: 'نايف الشمري', rating: 4, review: 'سيارة نظيفة وخدمة محترفة', date: '2026-06-10' },
  { id: 3, user: 'عبدالله الغامدي', rating: 5, review: 'الموظفين محترفين جداً وخبراء في السيارات', date: '2026-06-05' },
  { id: 4, user: 'تركي المطيري', rating: 4, review: 'التجربة كانت جيدة لكن تأخروا قليلاً في التوصيل', date: '2026-05-28' },
  { id: 5, user: 'ماجد العتيبي', rating: 5, review: 'من أفضل المعارض في الرياض، احترافية عالية', date: '2026-05-20' },
]

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  sold: 'bg-blue-100 text-blue-800',
  inactive: 'bg-gray-100 text-gray-800',
}

const statusLabels: Record<string, string> = {
  active: 'منشور',
  pending: 'قيد المراجعة',
  sold: 'تم البيع',
  inactive: 'غير نشط',
}

function SimpleBar({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  const barW = 100 / data.length

  return (
    <div className="flex items-end gap-px h-32" dir="ltr">
      {data.map((d, i) => {
        const h = max > 0 ? (d.count / max) * 100 : 2
        return (
          <div key={d.date} className="flex flex-col items-center flex-1">
            <div
              className="w-full rounded-t-sm transition-all duration-300"
              style={{ height: `${Math.max(h, 2)}%`, backgroundColor: d.count > 0 ? 'hsl(var(--primary))' : '#e5e7eb' }}
              title={`${d.date}: ${d.count}`}
            />
            {(i % 5 === 0 || i === data.length - 1) && (
              <span className="text-[8px] text-muted-foreground mt-1 whitespace-nowrap">{d.date.slice(5)}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function StaffRow({ s }: { s: { id: number; name: string; phone: string; role: string; email: string } }) {
  const [showActions, setShowActions] = useState(false)
  const roleLabels: Record<string, string> = { admin: 'مدير', manager: 'مشرف', employee: 'موظف' }
  const roleColors: Record<string, string> = { admin: 'bg-purple-100 text-purple-800', manager: 'bg-blue-100 text-blue-800', employee: 'bg-gray-100 text-gray-800' }

  return (
    <div className="flex items-center justify-between p-2.5 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-primary">{s.name[0]}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{s.name}</p>
          <p className="text-xs text-muted-foreground" dir="ltr">{s.phone}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[s.role]}`}>{roleLabels[s.role]}</span>
        <button onClick={() => setShowActions(!showActions)} className="text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`${cls} ${s <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  )
}

export default function DealerDashboardDemo() {
  const locale = useLocale()
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'staff' | 'reviews'>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tabs = [
    { id: 'overview' as const, label: 'نظرة عامة', icon: BarChart3 },
    { id: 'listings' as const, label: 'الإعلانات', icon: Car },
    { id: 'staff' as const, label: 'الموظفون', icon: Users },
    { id: 'reviews' as const, label: 'التقييمات', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50" dir="rtl">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-1.5 -mr-1.5 rounded-md hover:bg-gray-100" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="w-5 h-5" /> : <Store className="w-5 h-5" />}
              </button>
              <Link href={`/${locale}/second-landing/example/maxus-d60`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                ← العودة للموقع
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">{dealer.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`
            fixed lg:sticky top-14 lg:top-14 bottom-0 right-0 z-20
            w-64 bg-white border-l lg:border shadow-lg lg:shadow-none
            transform transition-transform duration-200
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            overflow-y-auto
          `}>
            <div className="p-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-bold mt-2">{dealer.name}</h2>
                <p className="text-xs text-muted-foreground">{dealer.plan.name}</p>
                {dealer.is_approved && (
                  <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mt-1">معتمد</span>
                )}
              </div>

              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTab === tab.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold">لوحة التحكم</h1>
                  <Link href={`/${locale}/second-landing/example/maxus-d60`} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    إضافة إعلان جديد
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{listings.length}</p>
                        <p className="text-xs text-muted-foreground">إجمالي الإعلانات</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{dealer.stats.totalViews.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">إجمالي المشاهدات</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{dealer.stats.totalInquiries}</p>
                        <p className="text-xs text-muted-foreground">الاستفسارات</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{dealer.stats.totalSales}</p>
                        <p className="text-xs text-muted-foreground">مبيعات</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="bg-white border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">المشاهدات خلال 30 يوم</h2>
                    <span className="text-xs text-muted-foreground">إجمالي: {dailyViews.reduce((a, b) => a + b.count, 0).toLocaleString()}</span>
                  </div>
                  <SimpleBar data={dailyViews} />
                </div>

                {/* Top Listings */}
                <div className="bg-white border rounded-xl p-5">
                  <h2 className="font-semibold mb-4">أفضل الإعلانات أداءً</h2>
                  <div className="space-y-2">
                    {topListings.map((l, i) => (
                      <div key={l.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-xs font-bold text-muted-foreground w-5 flex-shrink-0">{i + 1}</span>
                          <img src={l.image} className="w-14 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{l.make} {l.model} ({l.year})</p>
                            <p className="text-xs text-muted-foreground">{l.price.toLocaleString()} ر.س</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                          <span><Eye className="w-3 h-3 inline ml-0.5" />{l.views}</span>
                          <span><MessageSquare className="w-3 h-3 inline ml-0.5" />{l.inquiries}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Info */}
                <div className="bg-white border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold">الخطة الحالية</h2>
                    <Link href={`/${locale}/plans`} className="text-xs text-primary hover:underline font-medium">تغيير الخطة</Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">الخطة:</span>
                      <p className="font-medium">{dealer.plan.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">السعر:</span>
                      <p className="font-medium">{dealer.plan.price_monthly} ر.س/شهر</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">حد الإعلانات:</span>
                      <p className="font-medium">{dealer.plan.max_listings} إعلان</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">حد الموظفين:</span>
                      <p className="font-medium">{dealer.plan.max_staff} موظف</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {dealer.plan.has_analytics && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">تحليلات</span>}
                    {dealer.plan.has_wholesale && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">الجملة</span>}
                    {dealer.plan.has_featured && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">مميز</span>}
                    {dealer.plan.has_auctions && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">مزادات</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold">الإعلانات ({listings.length})</h1>
                  <Link href={`/${locale}/second-landing/example/maxus-d60`} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    إضافة إعلان
                  </Link>
                </div>

                <div className="bg-white border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50/50">
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">السيارة</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">السعر</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">الحالة</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">المشاهدات</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">الاستفسارات</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">الأيام</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {listings.map(l => (
                          <tr key={l.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img src={l.image} className="w-14 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                                <div>
                                  <p className="font-medium">{l.make} {l.model}</p>
                                  <p className="text-xs text-muted-foreground">{l.year} - {l.trim}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{l.price.toLocaleString()} ر.س</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[l.status]}`}>
                                {statusLabels[l.status]}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{l.views.toLocaleString()}</td>
                            <td className="py-3 px-4 text-muted-foreground">{l.inquiries}</td>
                            <td className="py-3 px-4 text-muted-foreground">{l.daysOnMarket} يوم</td>
                            <td className="py-3 px-4">
                              <Link href={`/${locale}/listings/${l.slug}`} className="text-xs text-primary hover:underline">عرض</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Staff Tab */}
            {activeTab === 'staff' && (
              <div className="space-y-4">
                <h1 className="text-xl font-bold">فريق العمل ({staff.length}/{dealer.plan.max_staff})</h1>

                <div className="bg-white border rounded-xl p-5">
                  <div className="space-y-1">
                    {staff.map(s => (
                      <StaffRow key={s.id} s={s} />
                    ))}
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-semibold mb-3">دعوة موظف جديد</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">رقم الجوال</label>
                      <input
                        placeholder="+9665xxxxxxxx"
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">البريد الإلكتروني</label>
                      <input
                        placeholder="email@example.com"
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">الصلاحية</label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1">
                        <option value="employee">موظف</option>
                        <option value="manager">مشرف</option>
                        <option value="admin">مدير</option>
                      </select>
                    </div>
                  </div>
                  <button className="mt-3 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    إرسال الدعوة
                  </button>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold">التقييمات</h1>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={dealer.rating} size="lg" />
                    <span className="text-lg font-bold">{dealer.rating}</span>
                    <span className="text-sm text-muted-foreground">({dealer.totalRatings} تقييم)</span>
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-5">
                  <div className="space-y-4">
                    {reviews.map(r => (
                      <div key={r.id} className="p-3 border-b last:border-0 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3 mb-1.5">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-xs font-bold">{r.user[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{r.user}</p>
                            <p className="text-[10px] text-muted-foreground">{r.date}</p>
                          </div>
                          <div className="mr-auto">
                            <StarRating rating={r.rating} />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mr-11">{r.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Demo notice */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <p className="font-medium mb-1">⚠️ نسخة تجريبية (Demo)</p>
              <p className="text-xs text-amber-700">هذه لوحة تحكم وهمية ببيانات تجريبية للعرض فقط. للوحة التحكم الحقيقية، سجل كمعرض وادخل من <Link href={`/${locale}/dashboard/dealer`} className="underline font-medium">هنا</Link>.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
