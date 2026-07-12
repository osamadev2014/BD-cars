'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Shield, Gauge, ChevronDown, ChevronLeft, ChevronRight, Send, Heart, Share2, Phone, CreditCard, BadgeCheck, AlertCircle, Check, Settings, Shirt, Wifi, Users, Thermometer, KeyRound, Cog, Camera, Radio, Sun, Snowflake, RefreshCw, ClipboardList, ArrowLeftRight, Lock, Fuel, MapPin, Wind, Layers, Zap, RotateCcw, Eye, Car, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'

const carImages = [
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-1783262911-200_cut.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-1783262909-375_cut.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-1783262957-72_cut.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-1783262947-489_cut.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-1783262891-832_cut.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-1783225712-812_cut.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-1783262897-930_cut.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-1783262960-110_cut.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-13-1783146636.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-14-1782114987.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-49-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-15-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-20-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-8-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-9-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-10-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-16-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-17-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-23-1783146636.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-22-1783146636.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-21-1783146636.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-24-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-26-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-38-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-27-1783146636.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-28-1782114987.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-30-1783146636.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-31-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-32-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-33-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-36-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-35-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-48-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-25-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-29-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-34-1783146637.jpg?v=3',
  'https://cdn.syarah.com/photos-thumbs/online-v1/0x683/online/posts/306026/orignal-306026-37-1783146637.jpg?v=3',
]

const specSections = {
  'معلومات السيارة': [
    { label: 'الماركة', value: 'ماكسيوس' },
    { label: 'النوع', value: 'D60' },
    { label: 'الموديل', value: '2022' },
    { label: 'الفئة', value: 'luxury' },
    { label: 'اللون الخارجي', value: 'برتقالي' },
    { label: 'اللون الداخلي', value: 'أحمر' },
    { label: 'الوارد', value: 'سعودي' },
    { label: 'نوع الوقود', value: 'بنزين' },
    { label: 'نوع القير', value: 'اوتوماتيك' },
    { label: 'سرعات القير', value: '7' },
    { label: 'عدد السلندرات', value: '4 سيليندر' },
    { label: 'الحالة', value: 'مستعملة' },
    { label: 'حجم المحرك', value: '1.5' },
    { label: 'الممشى', value: '32,519 كم' },
    { label: 'نوع الدفع', value: 'FWD دفع امامي' },
    { label: 'عدد مفاتيح السيارة', value: '2' },
    { label: 'عدد المقاعد', value: '7' },
    { label: 'نوع المحرك', value: 'تيربو' },
    { label: 'سعة خزان الوقود', value: '50 لتر' },
    { label: 'القدرة بالحصان', value: '159 حصان' },
    { label: 'عدد الابواب', value: '4' },
    { label: 'استهلاك الوقود', value: '15.3 (كم/لتر)' },
  ],
  'الأمان': [
    'وسائد هوائية امامية', 'فرامل ABS', 'سنتر لوك',
    'الثبات الإلكتروني ESP', 'مساعد الفرامل BA', 'أحزمة أمان',
    'EBD توزيع قوة الفرامل الكتروني', 'نظام التحكم بالإنزلاق (TRC)',
    'تحكم فى الحساسات', 'فرامل يد الكترونى',
  ],
  'الراحة': [
    'مقاعد جلد', 'فتحات تكييف خلفية', 'تشغيل بصمة',
    'تحكم دريكسون', 'مثبت سرعة', 'زجاج كهربائي',
    'مكيف أوتوماتيك', 'فتح الابواب بالريموت', 'تحكم مقاعد كهرباء',
    'مرايا داخلية ذاتية التعتيم', 'مقاعد خلفية قابلة للطي', 'مسند ذراع خلفي',
  ],
  'تقنيات': [
    'بلوتوث', 'كاميرا خلفية', 'منافذ طاقة', 'شاشة وسائط', 'راديو',
  ],
  'تجهيزات خارجية': [
    'مرايا تحكم كهربائي', 'كشافات ضباب امامية', 'جنوط',
    'حساسات خلفية', 'فتحة سقف بانوراما', 'اشارات بالمرايا',
    'جناح خلفى', 'مصابيح ضباب خلفية', 'حنايا عفش',
    'التحكم بارتفاع الأنوار الأمامية', 'مرايا قابلة للطي كهربائياً', 'مزيل ضباب',
  ],
}

const inspectionItems = [
  'الماكينة', 'الجيربوكس', 'نظام الكهرباء', 'السوائل',
  'أسفل السيارة', 'نظام الفرامل', 'الدفرنس / الكورونا',
  'القسم الداخلي', 'اضافات', 'اطارات', 'الهيكل', 'فحص الهيكل الخارجي',
]

const similarCars = [
  { title: 'GAC GS3 GS 2023', price: '33,000', installment: '721', mileage: '100,225 كم', img: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x426/online/posts/307878/orignal-1783684278-349_cut.jpg?v=3' },
  { title: 'شانجان CS75 Full 2021', price: '35,700', installment: '778', mileage: '55,656 كم', img: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x426/online/posts/307014/orignal-1783728132-786_cut.jpg?v=3' },
  { title: 'شيري تيجو 2 Luxury 2023', price: '31,700', installment: '693', mileage: '73,506 كم', img: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x426/online/posts/304562/orignal-304562-1-1783604466.jpg?v=3' },
  { title: 'بايك X35 Elite 2025', price: '32,700', installment: '714', mileage: '51,615 كم', img: 'https://cdn.syarah.com/photos-thumbs/online-v1/0x426/online/posts/297654/orignal-1783262908-12_cut.jpg?v=3' },
]

const faqItems = [
  { q: 'كيف طريقة شراء سيارة؟', a: 'تتم في البداية عملية شراء السيارة من خلال دفع عربون, هذا العربون مخصوم من سعر السيارة الاجمالي و مسترد في حال عدم اتمام عملية الشراء شرط عدم تثبيت حجز السيارة.' },
  { q: 'كيف أدفع قيمة السيارة؟', a: 'يمكنك دفع باقي قيمة السيارة وذلك بعد تأكيد حجز السيارة مع موظف المبيعات المختص، ويكون ذلك بواسطة خدمة سداد السعودية وهي الأسهل والأسرع أو حوالة مصرفية لحساب الشركة.' },
  { q: 'هل موقعكم معتمد من قبل وزارة التجارة؟', a: 'نعم! هذا الموقع موثق من وزارة التجارة والاستثمار وبدعم من شركة علم, بسجل تجاري رقم 1010538980.' },
]

const categoryIcons: Record<string, React.ReactNode> = {
  'الأمان': <Shield className="h-5 w-5 text-red-500" />,
  'الراحة': <Settings className="h-5 w-5 text-blue-500" />,
  'تقنيات': <Wifi className="h-5 w-5 text-purple-500" />,
  'تجهيزات خارجية': <Car className="h-5 w-5 text-amber-600" />,
}

function SpecIcon({ label }: { label: string }) {
  const icons: Record<string, [React.ReactNode, string]> = {
    'وسائد هوائية امامية': [<Shield className="h-4 w-4" />, 'text-red-500'],
    'فرامل ABS': [<AlertCircle className="h-4 w-4" />, 'text-orange-500'],
    'سنتر لوك': [<Lock className="h-4 w-4" />, 'text-blue-600'],
    'الثبات الإلكتروني ESP': [<Zap className="h-4 w-4" />, 'text-yellow-500'],
    'مساعد الفرامل BA': [<Gauge className="h-4 w-4" />, 'text-orange-500'],
    'أحزمة أمان': [<Shield className="h-4 w-4" />, 'text-red-400'],
    'EBD توزيع قوة الفرامل الكتروني': [<Layers className="h-4 w-4" />, 'text-orange-500'],
    'نظام التحكم بالإنزلاق (TRC)': [<Wind className="h-4 w-4" />, 'text-blue-400'],
    'تحكم فى الحساسات': [<Cog className="h-4 w-4" />, 'text-gray-600'],
    'فرامل يد الكترونى': [<Ban className="h-4 w-4" />, 'text-red-500'],
    'مقاعد جلد': [<Shirt className="h-4 w-4" />, 'text-amber-700'],
    'فتحات تكييف خلفية': [<Snowflake className="h-4 w-4" />, 'text-blue-500'],
    'تشغيل بصمة': [<KeyRound className="h-4 w-4" />, 'text-green-600'],
    'تحكم دريكسون': [<Settings className="h-4 w-4" />, 'text-gray-600'],
    'مثبت سرعة': [<Gauge className="h-4 w-4" />, 'text-blue-500'],
    'زجاج كهربائي': [<Settings className="h-4 w-4" />, 'text-blue-500'],
    'مكيف أوتوماتيك': [<Thermometer className="h-4 w-4" />, 'text-blue-500'],
    'فتح الابواب بالريموت': [<KeyRound className="h-4 w-4" />, 'text-amber-600'],
    'تحكم مقاعد كهرباء': [<Settings className="h-4 w-4" />, 'text-blue-500'],
    'مرايا داخلية ذاتية التعتيم': [<Eye className="h-4 w-4" />, 'text-gray-600'],
    'مقاعد خلفية قابلة للطي': [<Users className="h-4 w-4" />, 'text-blue-500'],
    'مسند ذراع خلفي': [<Settings className="h-4 w-4" />, 'text-gray-500'],
    'بلوتوث': [<Wifi className="h-4 w-4" />, 'text-blue-600'],
    'كاميرا خلفية': [<Camera className="h-4 w-4" />, 'text-gray-600'],
    'منافذ طاقة': [<Zap className="h-4 w-4" />, 'text-amber-500'],
    'شاشة وسائط': [<Radio className="h-4 w-4" />, 'text-gray-600'],
    'راديو': [<Radio className="h-4 w-4" />, 'text-gray-500'],
    'مرايا تحكم كهربائي': [<Settings className="h-4 w-4" />, 'text-blue-500'],
    'كشافات ضباب امامية': [<Sun className="h-4 w-4" />, 'text-amber-400'],
    'جنوط': [<Cog className="h-4 w-4" />, 'text-gray-600'],
    'حساسات خلفية': [<AlertCircle className="h-4 w-4" />, 'text-orange-500'],
    'فتحة سقف بانوراما': [<Sun className="h-4 w-4" />, 'text-blue-500'],
    'اشارات بالمرايا': [<ArrowLeftRight className="h-4 w-4" />, 'text-amber-600'],
    'جناح خلفى': [<Wind className="h-4 w-4" />, 'text-gray-500'],
    'مصابيح ضباب خلفية': [<Sun className="h-4 w-4" />, 'text-red-400'],
    'حنايا عفش': [<Car className="h-4 w-4" />, 'text-gray-500'],
    'التحكم بارتفاع الأنوار الأمامية': [<Settings className="h-4 w-4" />, 'text-blue-500'],
    'مرايا قابلة للطي كهربائياً': [<RotateCcw className="h-4 w-4" />, 'text-blue-500'],
    'مزيل ضباب': [<Wind className="h-4 w-4" />, 'text-blue-400'],
  }
  const match = icons[label]
  if (match) {
    const [icon, color] = match
    return <div className={`h-6 w-6 rounded-full bg-opacity-15 flex items-center justify-center ${color.replace('text-', 'bg-').replace(/\d{3}/, '100')}`}><div className={color}>{icon}</div></div>
  }
  return <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center"><Check className="h-3.5 w-3.5 text-green-600" /></div>
}

export default function MaxusD60Page() {
  const [activeImg, setActiveImg] = useState(0)
  const locale = useLocale()
  const [loanAmount, setLoanAmount] = useState('70000')
  const [loanYears, setLoanYears] = useState('5')

  const monthlyPayment = loanAmount && loanYears
    ? (Number(loanAmount) / (Number(loanYears) * 12)).toLocaleString('en-US', { maximumFractionDigits: 0 })
    : '0'

  const prevImg = () => setActiveImg((activeImg - 1 + carImages.length) % carImages.length)
  const nextImg = () => setActiveImg((activeImg + 1) % carImages.length)

  const otherSpecItems = Object.entries(specSections).filter(([key]) => key !== 'معلومات السيارة')

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn .5s ease-out forwards; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slideInRight .5s ease-out .3s forwards; opacity: 0; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(21,79,156,.4); } 50% { box-shadow: 0 0 0 8px rgba(21,79,156,0); } }
        .pulse-glow { animation: pulse-glow 2s infinite; }
      `}</style>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-[#154F9C] transition-colors">الرئيسية</Link>
            <ChevronLeft className="h-3 w-3" />
            <Link href={`/${locale}/listings`} className="hover:text-[#154F9C] transition-colors">سيارات و مركبات</Link>
            <ChevronLeft className="h-3 w-3" />
            <Link href={`/${locale}/listings?make=maxus`} className="hover:text-[#154F9C] transition-colors">ماكسيوس</Link>
            <ChevronLeft className="h-3 w-3" />
            <Link href={`/${locale}/listings?make=maxus&model=d60`} className="hover:text-[#154F9C] transition-colors">D60</Link>
            <ChevronLeft className="h-3 w-3" />
            <span className="text-[#154F9C] font-medium">2022</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-4">

            {/* Image Gallery */}
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
              <div className="aspect-[720/446] relative">
                <img src={carImages[activeImg]} alt="ماكسيوس D60 luxury 2022" className="w-full h-full object-cover transition-all duration-300" />
                <button onClick={prevImg} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
                <button onClick={nextImg} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5" />
                <span>{activeImg + 1} / {carImages.length}</span>
              </div>
              <div className="absolute top-3 left-3">
                <span className="text-xs font-bold bg-[#f1cd31] text-[#1a1a1a] px-3 py-1 rounded-full">قسطها مع تمارا</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {carImages.slice(0, 10).map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-[#154F9C] ring-1 ring-[#154F9C]/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
              {carImages.length > 10 && (
                <div className="flex-shrink-0 w-20 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 bg-gray-50">
                  +{carImages.length - 10}
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <RefreshCw className="h-5 w-5 text-[#154F9C]" />, title: 'جربها 10 أيام', desc: 'ما جازتلك رجعها', color: 'bg-blue-50 border-blue-100' },
                { icon: <Shield className="h-5 w-5 text-emerald-600" />, title: 'ضمان 6 أشهر', desc: 'أو 10 آلاف كم قابل للترقية', color: 'bg-emerald-50 border-emerald-100' },
                { icon: <ClipboardList className="h-5 w-5 text-[#e67e22]" />, title: 'فحص أكثر من 200 نقطة', desc: '', color: 'bg-orange-50 border-orange-100' },
              ].map((badge, i) => (
                <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${badge.color}`}>
                  <div className="flex-shrink-0">{badge.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">{badge.title}</div>
                    {badge.desc && <div className="text-xs text-gray-500">{badge.desc}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs: Info + Specs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                <span className="flex-1 py-3.5 text-sm font-bold text-[#154F9C] border-b-2 border-[#154F9C] text-center cursor-pointer">معلومات السيارة</span>
                <span className="flex-1 py-3.5 text-sm font-medium text-gray-500 text-center cursor-pointer">تقرير الفحص</span>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Main Info Table */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1">
                  {specSections['معلومات السيارة'].map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between py-2.5 border-b border-gray-50">
                      <span className="text-xs sm:text-sm text-gray-500">{spec.label}</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-800">{spec.value}</span>
                    </div>
                  ))}
                </div>

                {/* Category Specs with colored icons */}
                {otherSpecItems.map(([category, items]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-gray-100">
                      {categoryIcons[category]}
                      <h3 className="font-bold text-gray-800 text-sm">{category}</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-3">
                      {(items as string[]).map((item) => (
                        <div key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                          <SpecIcon label={item} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="px-4 sm:px-6 pb-6">
                <h3 className="font-bold text-gray-800 text-sm mb-2">تفاصيل السيارة</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  ماكسيوس D60 luxury 2022 مستعملة لون برتقالي بسعر 35,700 ريال شامل الضريبة، وتقدر تموّلها بقسط شهري يبدأ من 778 ريال، تتوفر هذه السيارة بمحرك 1.5، 4 سيليندر بنزين ومع ناقل حركة من نوع اوتوماتيك، اشترها وأنت متكي ومرتاح وبنوصلها لك لين باب بيتك، السيارة مفحوصة ومضمونة، احجزها من خلال BD الآن.
                </p>
              </div>
            </div>

            {/* Inspection Report */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-gray-800 text-base mb-1">فحص السيارة الشامل</h3>
                <p className="text-sm text-gray-500 mb-5">نختار سياراتنا المستعملة وفق معايير دقيقة ونعرض فقط الأفضل</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {inspectionItems.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <Link href={`/${locale}/inspect`} className="inline-flex items-center gap-1 text-sm text-[#154F9C] font-medium hover:underline">
                    شاهد تقرير الفحص الكامل
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link href={`/${locale}`} className="text-xs text-gray-400 hover:text-gray-600 underline">إخلاء مسؤولية</Link>
                </div>
              </div>
            </div>

            {/* Finance Calculator */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-gray-800 text-base mb-4">حاسبة التمويل</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">مبلغ التمويل (ريال)</label>
                    <div className="relative">
                      <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)}
                        className="w-full h-11 pr-3 pl-12 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#154F9C]/30 focus:border-[#154F9C]"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ريال</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">مدة التمويل (سنوات)</label>
                    <select value={loanYears} onChange={e => setLoanYears(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#154F9C]/30 focus:border-[#154F9C]"
                    >
                      <option value="1">سنة</option>
                      <option value="2">سنتان</option>
                      <option value="3">3 سنوات</option>
                      <option value="5">5 سنوات</option>
                      <option value="7">7 سنوات</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-[#154F9C]/5 rounded-xl border border-[#154F9C]/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">القسط الشهري التقريبي</span>
                    <span className="text-xl font-bold text-[#154F9C]">{monthlyPayment} <span className="text-sm font-normal">ريال</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Cars */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-gray-800 text-base mb-4">سيارات مشابهة</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarCars.map((car) => (
                    <Link key={car.title} href={`/${locale}/listings`}
                      className="group flex gap-3 p-3 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="w-24 h-[84px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={car.img} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] bg-[#f1cd31] text-[#1a1a1a] px-2 py-0.5 rounded font-medium inline-block mb-1">قسط بالبطاقة الإئتمانية</span>
                        <h4 className="font-bold text-gray-800 text-sm truncate">{car.title}</h4>
                        <div className="text-xs text-gray-500 mt-0.5">سعر الكاش <span className="font-semibold">{car.price}</span> ريال</div>
                        <div className="text-xs text-emerald-600 font-medium mt-0.5">التقسيط {car.installment} ريال / شهري</div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">مستعملة</span>
                          <span>{car.mileage}</span>
                          <img src="https://cdn.syarah.com/syarah/bundles/warranty-verified.png" alt="مفحوصة" className="h-3.5" />
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <img src="https://cdn.syarah.com/syarah/bundles/bnpl-amwal.png" alt="أموال" className="h-3.5" />
                          <img src="https://cdn.syarah.com/syarah/bundles/bnpl-tamara.png" alt="تمارا" className="h-3.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-gray-800 text-base mb-4">سيارات شوهدت مؤخراً</h3>
                <Link href={`/${locale}/listings`} className="group flex gap-3 p-3 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                  <div className="w-24 h-[84px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={carImages[0]} alt="ماكسيوس D60" className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] bg-[#f1cd31] text-[#1a1a1a] px-2 py-0.5 rounded font-medium inline-block mb-1">قسط بالبطاقة الإئتمانية</span>
                    <h4 className="font-bold text-gray-800 text-sm">ماكسيوس D60 luxury 2022</h4>
                    <div className="text-xs text-gray-500 mt-0.5">سعر الكاش <span className="font-semibold">35,700</span> ريال</div>
                    <div className="text-xs text-emerald-600 font-medium mt-0.5">التقسيط 778 ريال / شهري</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded">مستعملة</span>
                      <span>32,519 كم</span>
                      <span className="text-emerald-600 font-medium">ممشى قليل</span>
                      <img src="https://cdn.syarah.com/syarah/bundles/warranty-verified.png" alt="مفحوصة" className="h-3.5" />
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <img src="https://cdn.syarah.com/syarah/bundles/bnpl-amwal.png" alt="أموال" className="h-3.5" />
                      <img src="https://cdn.syarah.com/syarah/bundles/bnpl-tamara.png" alt="تمارا" className="h-3.5" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-gray-800 text-base mb-4">أسئلة متكررة</h3>
                <div className="space-y-2">
                  {faqItems.map((faq, i) => (
                    <details key={i} className="group rounded-xl border border-gray-100 overflow-hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                        <span className="font-medium text-gray-800 text-sm">{faq.q}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                      </summary>
                      <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>
                    </details>
                  ))}
                </div>
                <div className="mt-3">
                  <Link href={`/${locale}/pages/faq`} className="text-sm text-[#154F9C] font-medium hover:underline">اعرض المزيد</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-4 animate-slide-in">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 sticky top-24">
              {/* Title */}
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">ماكسيوس D60 luxury 2022</h1>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">أقل من 50,000كم في السنة</span>
                <span className="text-[11px] bg-[#f1cd31]/10 text-[#b8860b] px-2 py-1 rounded-full font-medium">مستعملة</span>
                <span className="text-[11px] font-medium text-gray-800">32,519 كيلومتر</span>
                <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">ممشى قليل</span>
              </div>

              {/* Price Box */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">سعر الكاش</span>
                  <span className="text-lg font-bold">35,700 ريال</span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">التقسيط</span>
                  <div>
                    <span className="text-lg font-bold text-emerald-600">778</span>
                    <span className="text-xs text-gray-500 mr-1">ريال / شهرياً</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <Link href="/finance" className="flex items-center gap-1 text-xs text-[#154F9C] font-medium hover:underline">
                    احسب التمويل
                    <ChevronLeft className="h-3 w-3" />
                  </Link>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>السعر يشمل الضريبة المضافة</span>
                  </div>
                </div>
              </div>

              {/* BNPL */}
              <div className="flex items-center gap-2 mb-4">
                <img src="https://cdn.syarah.com/syarah/bundles/bnpl-amwal-logo-v5.png" alt="أموال" className="h-9 w-auto" />
                <img src="https://cdn.syarah.com/syarah/bundles/tamara-logo-4-ar.png" alt="تمارا" className="h-9 w-auto" />
              </div>

              {/* BNPL Features */}
              <div className="space-y-2 mb-4 text-xs text-gray-600">
                {[
                  { icon: <CreditCard className="h-2.5 w-2.5 text-blue-600" />, text: 'سوقها الآن، و ادفع لاحقًا!', bg: 'bg-blue-100' },
                  { icon: <BadgeCheck className="h-2.5 w-2.5 text-emerald-600" />, text: 'قسطها حتى 24 دفعة، متوافق مع الشريعة', bg: 'bg-emerald-100' },
                  { icon: <CreditCard className="h-2.5 w-2.5 text-purple-600" />, text: 'قسمها على 4 دفعات بدون رسوم تأخير، متوافق مع الشريعة', bg: 'bg-purple-100' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`h-4 w-4 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>{item.icon}</div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Eligibility */}
              <Link href="/finance"
                className="block text-center text-sm text-[#154F9C] font-medium bg-blue-50 rounded-xl py-2.5 mb-4 hover:bg-blue-100 transition-colors"
              >هل أنت مؤهل للتمويل؟</Link>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/listings">
                  <Button className="w-full bg-[#154F9C] text-white hover:bg-[#154F9C]/90 rounded-xl h-12 text-sm font-bold pulse-glow">
                    <Send className="h-4 w-4 ml-2" />
                    احجزها الآن
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full border-[#154F9C] text-[#154F9C] hover:bg-blue-50 rounded-xl h-12 text-sm">
                    <Phone className="h-4 w-4 ml-2" />
                    اتصل بنا للحجز
                  </Button>
                </Link>
              </div>

              {/* Favorites & Share - rearranged */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors font-medium">
                  <Heart className="h-4 w-4" />
                  <span>أضف إلى المفضلة</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#154F9C] transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>شارك الإعلان</span>
                </button>
              </div>

              {/* Ad Number */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">رقم الإعلان: 306026</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">اذكر رقم الإعلان عند الاتصال مع خدمة العملاء</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}