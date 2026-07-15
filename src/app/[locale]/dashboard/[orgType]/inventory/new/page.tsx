'use client'

import { useState, useRef, useEffect, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUploader } from '@/components/upload/image-uploader'
import { createVehicleListing, getMakes } from '@/lib/actions/vehicle-actions'
import { useAuth } from '@/hooks/use-auth'
import { useVehicleDraft } from '@/hooks/use-vehicle-draft'
import { getUserFriendlyError } from '@/lib/errors/user-friendly-errors'
import { StatusModal, ConfirmationModal, DeleteConfirmationModal } from '@/components/ui/modal'
import { cn } from '@/lib/utils'
import { ArrowLeft, Plus, X, Search, Car, Clock, AlertCircle, Store } from 'lucide-react'
import Link from 'next/link'

interface MakeItem { id: string; name: string; name_ar: string; slug?: string; code?: string }

export default function NewInventoryPage({ params }: { params: Promise<{ locale: string; orgType: string }> }) {
  const { locale, orgType } = use(params)
  const t = useTranslations('common')
  const router = useRouter()
  const { user } = useAuth()
  const formRef = useRef<HTMLFormElement>(null)

  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState('')
  const [paymentOptions, setPaymentOptions] = useState<string[]>([])
  const [makes, setMakes] = useState<MakeItem[]>([])
  const [makeModal, setMakeModal] = useState(false)
  const [makeSearch, setMakeSearch] = useState('')
  const [selectedMake, setSelectedMake] = useState<MakeItem | null>(null)
  const [category, setCategory] = useState('')

  // Drafts
  const { drafts, saveDraft, autoSaveDraft, deleteDraft, getDraft } = useVehicleDraft()
  const [draftModal, setDraftModal] = useState(false)
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null)

  // Status modal
  const [statusModal, setStatusModal] = useState<{ open: boolean; type: 'success' | 'error' | 'warning' | 'info'; title: string; description: string; technical?: string }>({ open: false, type: 'info', title: '', description: '' })

  // Confirm modals
  const [showDeleteDraft, setShowDeleteDraft] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const isRtl = locale === 'ar'

  useEffect(() => { getMakes().then(setMakes) }, [])

  const filteredMakes = makes.filter((m) => {
    const q = makeSearch.toLowerCase()
    return (
      m.name?.toLowerCase().includes(q) ||
      m.name_ar?.toLowerCase().includes(q) ||
      m.code?.toLowerCase().includes(q) ||
      m.slug?.toLowerCase().includes(q)
    )
  })

  // Show draft modal on mount if drafts exist
  useEffect(() => {
    if (drafts.length > 0 && !activeDraftId) {
      setDraftModal(true)
    }
  }, [drafts.length, activeDraftId])

  const getLogoUrl = (make: MakeItem) => {
    const slug = (make.slug || make.name || '').toLowerCase().replace(/\s+/g, '-')
    return `https://cdn-frontend-r2.syarah.com/prod/assets/images/brands/${slug}.png`
  }

  const getFormData = useCallback(() => {
    return {
      makeId: selectedMake?.id,
      makeName: selectedMake?.name,
      makeNameAr: selectedMake?.name_ar,
      model: (formRef.current?.querySelector<HTMLInputElement>('input[name="model"]')?.value || ''),
      year: (formRef.current?.querySelector<HTMLSelectElement>('select[name="year"]')?.value || ''),
      category,
      mileage: (formRef.current?.querySelector<HTMLInputElement>('input[name="mileage"]')?.value || ''),
      bodyType: (formRef.current?.querySelector<HTMLInputElement>('input[name="bodyType"]')?.value || ''),
      transmission: (formRef.current?.querySelector<HTMLInputElement>('input[name="transmission"]')?.value || ''),
      fuelType: (formRef.current?.querySelector<HTMLInputElement>('input[name="fuelType"]')?.value || ''),
      color: (formRef.current?.querySelector<HTMLInputElement>('input[name="color"]')?.value || ''),
      condition: (formRef.current?.querySelector<HTMLInputElement>('input[name="condition"]')?.value || ''),
      description: (formRef.current?.querySelector<HTMLTextAreaElement>('textarea[name="description"]')?.value || ''),
      price: (formRef.current?.querySelector<HTMLInputElement>('input[name="price"]')?.value || ''),
      negotiable: !!(formRef.current?.querySelector<HTMLInputElement>('input[name="negotiable"]')?.checked),
      features,
      paymentOptions,
      imageUrls,
    }
  }, [selectedMake, category, features, paymentOptions, imageUrls])

  // Auto-save draft periodically
  useEffect(() => {
    if (activeDraftId === '__new__') return
    const interval = setInterval(() => {
      const data = getFormData()
      if (data.model || data.makeId) {
        autoSaveDraft(data, activeDraftId || undefined)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [getFormData, autoSaveDraft, activeDraftId])

  const loadDraft = (draftId: string) => {
    const draft = getDraft(draftId)
    if (!draft) return
    setSelectedMake(draft.makeId ? { id: draft.makeId, name: draft.makeName || '', name_ar: draft.makeNameAr || '' } : null)
    setCategory(draft.category || '')
    setFeatures(draft.features || [])
    setPaymentOptions(draft.paymentOptions || [])
    setImageUrls(draft.imageUrls || [])
    setActiveDraftId(draftId)
    setDraftModal(false)

    // Fill form fields after state updates
    setTimeout(() => {
      if (!formRef.current) return
      const setVal = (name: string, value: string) => {
        const el = formRef.current!.querySelector<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>(`[name="${name}"]`)
        if (el) el.value = value
      }
      setVal('model', draft.model || '')
      setVal('year', draft.year || '')
      setVal('mileage', draft.mileage || '')
      setVal('bodyType', draft.bodyType || '')
      setVal('transmission', draft.transmission || '')
      setVal('fuelType', draft.fuelType || '')
      setVal('color', draft.color || '')
      setVal('condition', draft.condition || '')
      setVal('description', draft.description || '')
      setVal('price', draft.price || '')
      if (draft.negotiable) {
        const cb = formRef.current.querySelector<HTMLInputElement>('input[name="negotiable"]')
        if (cb) cb.checked = true
      }
    }, 0)
  }

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
      if (activeDraftId) deleteDraft(activeDraftId)
      setStatusModal({
        open: true, type: 'success',
        title: isRtl ? 'تم النشر بنجاح' : 'Published Successfully',
        description: isRtl ? 'تم نشر المركبة في السوق' : 'The vehicle has been published to the marketplace',
      })
      setTimeout(() => router.push(`/${locale}/dashboard/${orgType}/inventory/${listing.id}`), 1500)
    } catch (err: any) {
      const friendly = getUserFriendlyError(err, locale)
      setStatusModal({
        open: true, type: 'error',
        title: friendly.title,
        description: friendly.description,
        technical: friendly.technical,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDraft = async (draftId: string) => {
    setDeleteLoading(true)
    deleteDraft(draftId)
    setDeleteLoading(false)
    setShowDeleteDraft(null)
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

  const vehicleCategories = [
    { id: 'new', labelAr: 'سيارة جديدة', labelEn: 'New Car' },
    { id: 'used', labelAr: 'سيارة مستعملة', labelEn: 'Used Car' },
    { id: 'certified', labelAr: 'سيارة معتمدة', labelEn: 'Certified Car' },
    { id: 'auction', labelAr: 'سيارة مزاد', labelEn: 'Auction Car' },
    { id: 'spare_part', labelAr: 'قطعة غيار', labelEn: 'Spare Part' },
  ]

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

      {/* Draft Vehicles Section */}
      {drafts.length > 0 && (
        <div className="mb-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            {isRtl ? 'مسودات المركبات' : 'Draft Vehicles'}
          </h2>
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div key={draft.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {draft.makeNameAr || draft.makeName || isRtl ? 'بدون علامة تجارية' : 'No brand'}
                    </span>
                    {draft.model && <span className="text-sm text-gray-500 dark:text-gray-400">- {draft.model}</span>}
                    {draft.year && <span className="text-sm text-gray-500 dark:text-gray-400">- {draft.year}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">{isRtl ? 'مسودة' : 'Draft'}</span>
                    <span className="text-xs text-gray-400">
                      {isRtl ? 'آخر تحديث: ' : 'Last updated: '}{new Date(draft.lastUpdated).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${draft.completionPercent}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{draft.completionPercent}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => loadDraft(draft.id)}>{isRtl ? 'متابعة التحرير' : 'Continue Editing'}</Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setShowDeleteDraft(draft.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Category */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{isRtl ? 'نوع المركبة' : 'Vehicle Type'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {vehicleCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  'p-3 rounded-xl border text-xs font-medium transition-all text-center',
                  category === cat.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                {isRtl ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
          <input type="hidden" name="category" value={category} />
        </div>

        {/* Vehicle Info */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{isRtl ? 'معلومات المركبة' : 'Vehicle Information'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Make - Modal with logos */}
            <div className="md:col-span-2" dir={isRtl ? 'rtl' : 'ltr'}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'العلامة التجارية' : 'Make'}</label>
              <button
                type="button"
                onClick={() => setMakeModal(true)}
                className="flex items-center gap-3 h-12 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-sm mt-1"
              >
                {selectedMake ? (
                  <>
                    <img src={getLogoUrl(selectedMake)} alt="" className="h-6 w-6 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    {!getLogoUrl(selectedMake) && <Store className="h-5 w-5 text-gray-400 shrink-0" />}
                    <span className="font-medium">{isRtl ? (selectedMake.name_ar || selectedMake.name) : (selectedMake.name || selectedMake.name_ar)}</span>
                  </>
                ) : (
                  <span className="text-gray-400">{isRtl ? 'اختر العلامة التجارية' : 'Select make'}</span>
                )}
              </button>
              <input type="hidden" name="make" value={selectedMake?.id || ''} />

              {makeModal && (
                <>
                  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setMakeModal(false)} />
                  <div className={cn(
                    'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden',
                    'max-h-[80vh] flex flex-col'
                  )} dir={isRtl ? 'rtl' : 'ltr'}>
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="relative">
                        <Search className={cn('absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400', isRtl ? 'right-3' : 'left-3')} />
                        <input
                          type="text"
                          value={makeSearch}
                          onChange={(e) => setMakeSearch(e.target.value)}
                          placeholder={isRtl ? 'ابحث بالاسم العربي أو الإنجليزي أو الكود...' : 'Search by Arabic name, English name, or code...'}
                          className={cn('w-full h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm', isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4')}
                        />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filteredMakes.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => { setSelectedMake(m); setMakeModal(false); setMakeSearch('') }}
                          className={cn(
                            'flex flex-col items-center gap-2 p-4 rounded-xl border text-xs font-medium transition-all',
                            selectedMake?.id === m.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700'
                              : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                          )}
                        >
                          <img src={getLogoUrl(m)} alt="" className="h-8 w-8 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                          {!getLogoUrl(m) && <Store className="h-6 w-6 text-gray-300" />}
                          <span className="text-center">{isRtl ? (m.name_ar || m.name) : (m.name || m.name_ar)}</span>
                        </button>
                      ))}
                      {filteredMakes.length === 0 && (
                        <p className="col-span-full text-center text-sm text-gray-400 py-8">{isRtl ? 'لا توجد نتائج' : 'No results'}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Model - typed input */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'الموديل' : 'Model'}</label>
              <Input name="model" placeholder={isRtl ? 'اكتب الموديل...' : 'Type model...'} required />
            </div>

            {/* Year - select */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'السنة' : 'Year'}</label>
              <select name="year" required className="flex h-12 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-sm mt-1">
                <option value="">{isRtl ? 'اختر السنة' : 'Select year'}</option>
                {Array.from({ length: 56 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'المسافة المقطوعة (كم)' : 'Mileage (km)'}</label>
              <Input name="mileage" type="number" placeholder={isRtl ? 'مثال: 50000' : 'e.g. 50000'} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'نوع الهيكل' : 'Body Type'}</label>
              <Input name="bodyType" placeholder={isRtl ? 'مثال: سيدان' : 'e.g. Sedan'} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'ناقل الحركة' : 'Transmission'}</label>
              <Input name="transmission" placeholder={isRtl ? 'أوتوماتيك / يدوي' : 'Automatic / Manual'} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'نوع الوقود' : 'Fuel Type'}</label>
              <Input name="fuelType" placeholder={isRtl ? 'بنزين / ديزل' : 'Petrol / Diesel'} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'اللون' : 'Color'}</label>
              <Input name="color" placeholder={isRtl ? 'مثال: أبيض' : 'e.g. White'} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'الحالة' : 'Condition'}</label>
              <Input name="condition" placeholder={isRtl ? 'ممتاز / جيد جداً' : 'Excellent / Good'} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRtl ? 'الوصف' : 'Description'}</label>
            <textarea name="description" className="flex min-h-[120px] w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm mt-1" placeholder={isRtl ? 'اكتب وصفاً للمركبة...' : 'Write a description...'} />
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

      {/* Draft Modal */}
      <ConfirmationModal
        open={draftModal}
        onOpenChange={setDraftModal}
        title={isRtl ? 'لديك إعلان مركبة غير مكتمل' : 'You have an unfinished vehicle listing'}
        description={isRtl ? 'هل ترغب في متابعة الإعلان السابق أم إنشاء إعلان جديد؟' : 'Would you like to continue your previous listing or create a new one?'}
        confirmLabel={isRtl ? 'متابعة الإعلان السابق' : 'Continue Previous Listing'}
        onConfirm={() => { if (drafts.length > 0) loadDraft(drafts[0].id) }}
        cancelLabel={isRtl ? 'إلغاء' : 'Cancel'}
        onCancel={() => setDraftModal(false)}
        secondaryLabel={isRtl ? 'إنشاء إعلان جديد' : 'Create New Listing'}
        onSecondary={() => { setActiveDraftId('__new__'); setDraftModal(false) }}
      />

      {/* Status Modal */}
      <StatusModal
        open={statusModal.open}
        onOpenChange={(open) => setStatusModal(prev => ({ ...prev, open }))}
        type={statusModal.type}
        title={statusModal.title}
        description={statusModal.description}
        technicalDetails={statusModal.technical}
        primaryLabel={statusModal.type === 'error' ? (isRtl ? 'حسناً' : 'OK') : undefined}
        onPrimary={() => setStatusModal(prev => ({ ...prev, open: false }))}
        secondaryLabel={statusModal.type === 'error' ? (isRtl ? 'إعادة المحاولة' : 'Retry') : undefined}
        onSecondary={statusModal.type === 'error' ? () => { setStatusModal(prev => ({ ...prev, open: false })); formRef.current?.requestSubmit() } : undefined}
      />

      {/* Delete Draft Confirmation */}
      <DeleteConfirmationModal
        open={!!showDeleteDraft}
        onOpenChange={(open) => { if (!open) setShowDeleteDraft(null) }}
        title={isRtl ? 'حذف المسودة؟' : 'Delete Draft?'}
        description={isRtl ? 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف المسودة وجميع البيانات المرتبطة بها.' : 'This action cannot be undone. The draft and its related data will be removed.'}
        onConfirm={() => showDeleteDraft && handleDeleteDraft(showDeleteDraft)}
        loading={deleteLoading}
      />
    </div>
  )
}