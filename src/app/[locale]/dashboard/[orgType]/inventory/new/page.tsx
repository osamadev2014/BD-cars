'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUploader } from '@/components/upload/image-uploader'
import { createVehicleListing } from '@/lib/actions/vehicle-actions'
import { useAuth } from '@/hooks/use-auth'
import { getMakes, getModels } from '@/lib/actions/vehicle-actions'
import { cn } from '@/lib/utils'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function NewInventoryPage({ params }: { params: Promise<{ locale: string; orgType: string }> }) {
  const [locale, setLocale] = useState('ar')
  const [orgType, setOrgType] = useState('car_dealer')
  const t = useTranslations('common')
  const dt = useTranslations('dashboard')
  const router = useRouter()
  const { user } = useAuth()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    params.then((p) => { setLocale(p.locale); setOrgType(p.orgType) })
  }, [params])

  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState('')
  const [paymentOptions, setPaymentOptions] = useState<string[]>([])
  const [makes, setMakes] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [selectedMake, setSelectedMake] = useState('')

  const isRtl = locale === 'ar'

  useEffect(() => {
    getMakes().then(setMakes)
  }, [])

  useEffect(() => {
    if (selectedMake) getModels(selectedMake).then(setModels)
    else setModels([])
  }, [selectedMake])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    form.delete('imageUrls')
    imageUrls.forEach((url) => form.append('imageUrls', url))
    features.forEach((f) => form.append('features', f))
    paymentOptions.forEach((p) => form.append('paymentOptions', p))

    try {
      const listing = await createVehicleListing(form)
      router.push(`/${locale}/dashboard/${orgType}/inventory/${listing.id}`)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()])
      setFeatureInput('')
    }
  }

  const togglePaymentOption = (option: string) => {
    setPaymentOptions((prev) =>
      prev.includes(option) ? prev.filter((p) => p !== option) : [...prev, option]
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/${locale}/dashboard/${orgType}/inventory`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{isRtl ? 'إضافة مركبة جديدة' : 'Add New Vehicle'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{isRtl ? 'أدخل معلومات المركبة لنشرها في السوق' : 'Enter vehicle details to publish to the marketplace'}</p>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{isRtl ? 'معلومات المركبة' : 'Vehicle Information'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'العلامة التجارية' : 'Make'}</label>
              <select name="make" value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)} required className="flex h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm mt-1">
                <option value="">{isRtl ? 'اختر العلامة التجارية' : 'Select make'}</option>
                {makes.map((m: any) => <option key={m.id} value={m.id}>{m.name || m.name_ar}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'الموديل' : 'Model'}</label>
              <select name="model" required className="flex h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm mt-1">
                <option value="">{isRtl ? 'اختر الموديل' : 'Select model'}</option>
                {models.map((m: any) => <option key={m.id} value={m.id}>{m.name || m.name_ar}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'السنة' : 'Year'}</label>
              <Input name="year" type="number" min="1990" max="2030" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'المسافة المقطوعة (كم)' : 'Mileage (km)'}</label>
              <Input name="mileage" type="number" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'نوع الهيكل' : 'Body Type'}</label>
              <Input name="bodyType" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'ناقل الحركة' : 'Transmission'}</label>
              <Input name="transmission" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'نوع الوقود' : 'Fuel Type'}</label>
              <Input name="fuelType" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'اللون' : 'Color'}</label>
              <Input name="color" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'الحالة' : 'Condition'}</label>
              <Input name="condition" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'الوصف' : 'Description'}</label>
            <textarea name="description" className="flex min-h-[120px] w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm mt-1" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{isRtl ? 'المميزات' : 'Features'}</h2>
          <div className="flex gap-2">
            <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder={isRtl ? 'أضف ميزة...' : 'Add a feature...'} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }} />
            <Button type="button" variant="outline" onClick={addFeature}><Plus className="h-4 w-4" /></Button>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {features.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
                  {f}
                  <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{isRtl ? 'الصور' : 'Images'}</h2>
          <ImageUploader onUploadComplete={(results) => setImageUrls((prev) => [...prev, ...results.map((r) => r.url)])} />
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))} className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{isRtl ? 'تفاصيل الإعلان' : 'Listing Details'}</h2>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'السعر (ريال)' : 'Price (SAR)'}</label>
            <Input name="price" type="number" required />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="negotiable" id="negotiable" className="rounded border-gray-300" />
            <label htmlFor="negotiable" className="text-sm text-gray-700 dark:text-gray-300">{isRtl ? 'السعر قابل للتفاوض' : 'Price negotiable'}</label>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{isRtl ? 'خيارات الدفع' : 'Payment Options'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{isRtl ? 'اختر طرق الدفع المتاحة لهذه المركبة' : 'Select available payment methods for this vehicle'}</p>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'tabby', label: isRtl ? 'تابي' : 'Tabby', icon: '💜' },
              { id: 'tamara', label: isRtl ? 'تمارا' : 'Tamara', icon: '💚' },
              { id: 'amwal', label: isRtl ? 'أموال' : 'Amwal', icon: '💙' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => togglePaymentOption(opt.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
                  paymentOptions.includes(opt.id)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                )}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (isRtl ? 'جاري النشر...' : 'Publishing...') : (isRtl ? 'نشر المركبة' : 'Publish Vehicle')}
          </Button>
          <Link href={`/${locale}/dashboard/${orgType}/inventory`} className="inline-flex items-center justify-center h-10 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {isRtl ? 'إلغاء' : 'Cancel'}
          </Link>
        </div>
      </form>
    </div>
  )
}