'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createVehicleListing } from '@/lib/actions/vehicle-actions'
import { useAuth } from '@/hooks/use-auth'

export default function NewListingPage() {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)

  if (!user) {
    router.push(`/${locale}/login`)
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">{t('vehicle_info')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input name="make" placeholder={t('make')} required />
            <Input name="model" placeholder={t('model')} required />
            <Input name="year" type="number" placeholder={t('year')} required />
            <Input name="mileage" type="number" placeholder={t('mileage')} />
          </div>
          <textarea
            name="description"
            placeholder={t('description')}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">{t('listing_details')}</h2>
          <Input name="price" type="number" placeholder={t('price')} required />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="negotiable" id="negotiable" />
            <label htmlFor="negotiable" className="text-sm">{t('price_negotiable')}</label>
          </div>
        </div>
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">{t('images')}</h2>
          <Input name="images" type="file" multiple accept="image/*" />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t('publishing') : t('publish_listing')}
        </Button>
      </form>
    </div>
  )
}
