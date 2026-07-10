'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUploader } from '@/components/upload/image-uploader'
import { createVehicleListing } from '@/lib/actions/vehicle-actions'
import { useAuth } from '@/hooks/use-auth'

export default function NewListingPage() {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const { user } = useAuth()
  const formRef = useRef<HTMLFormElement>(null)

  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  if (!user) {
    router.push(`/${locale}/login`)
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    form.delete('imageUrls')
    imageUrls.forEach((url) => form.append('imageUrls', url))

    try {
      const listing = await createVehicleListing(form)
      router.push(`/${locale}/listings/${listing.slug}`)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t('sell_car')}</h1>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">{t('vehicle_info')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t('make')}</label>
              <Input name="make" required />
            </div>
            <div>
              <label className="text-sm font-medium">{t('model')}</label>
              <Input name="model" required />
            </div>
            <div>
              <label className="text-sm font-medium">{t('year')}</label>
              <Input name="year" type="number" required />
            </div>
            <div>
              <label className="text-sm font-medium">{t('mileage')}</label>
              <Input name="mileage" type="number" />
            </div>
            <div>
              <label className="text-sm font-medium">{t('body_type')}</label>
              <Input name="bodyType" />
            </div>
            <div>
              <label className="text-sm font-medium">{t('transmission')}</label>
              <Input name="transmission" />
            </div>
            <div>
              <label className="text-sm font-medium">{t('fuel_type')}</label>
              <Input name="fuelType" />
            </div>
            <div>
              <label className="text-sm font-medium">{t('color')}</label>
              <Input name="color" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">{t('description')}</label>
            <textarea
              name="description"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
            />
          </div>
        </div>
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">{t('listing_details')}</h2>
          <div>
            <label className="text-sm font-medium">{t('price')}</label>
            <Input name="price" type="number" required />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="negotiable" id="negotiable" />
            <label htmlFor="negotiable" className="text-sm">{t('price_negotiable')}</label>
          </div>
        </div>
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">{t('images')}</h2>
          <ImageUploader onUploadComplete={(results) => setImageUrls((prev) => [...prev, ...results.map((r) => r.url)])} />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t('publishing') : t('publish_listing')}
        </Button>
      </form>
    </div>
  )
}
