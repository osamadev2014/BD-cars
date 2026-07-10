'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createDeliveryAddress, deleteDeliveryAddress } from '@/lib/actions/delivery-actions'

interface Props {
  addresses: any[]
  cities: any[]
  t: (key: string) => string
}

export function AddressList({ addresses, cities, t }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await createDeliveryAddress(formData)
    setLoading(false)
    setShowForm(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirm_delete'))) return
    await deleteDeliveryAddress(id)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {addresses.map((addr: any) => (
        <div key={addr.id} className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div>
              {addr.label && <p className="font-semibold text-sm">{addr.label}</p>}
              <p className="text-sm text-muted-foreground mt-1">{addr.address}</p>
              {addr.address_ar && <p className="text-sm text-muted-foreground">{addr.address_ar}</p>}
              {addr.city && <p className="text-xs text-muted-foreground mt-1">{addr.city.name || addr.city.name_ar}</p>}
              {addr.phone && <p className="text-xs text-muted-foreground">{addr.phone}</p>}
              {addr.is_default && <span className="text-xs text-primary mt-1 inline-block">{t('default')}</span>}
            </div>
            <button
              onClick={() => handleDelete(addr.id)}
              className="text-xs text-red-500 hover:underline shrink-0"
            >
              {t('delete')}
            </button>
          </div>
        </div>
      ))}

      {addresses.length === 0 && !showForm && (
        <p className="text-center py-8 text-muted-foreground">{t('no_addresses')}</p>
      )}

      {showForm ? (
        <form onSubmit={handleCreate} className="rounded-lg border p-4 space-y-3">
          <input
            name="label"
            placeholder={t('label_placeholder')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <select
            name="city_id"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">{t('select_city')}</option>
            {cities.map((city: any) => (
              <option key={city.id} value={city.id}>{city.name || city.name_ar}</option>
            ))}
          </select>
          <input
            name="address"
            required
            placeholder={t('address_placeholder')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <input
            name="address_ar"
            placeholder={t('address_ar_placeholder')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <input
            name="phone"
            placeholder={t('phone_placeholder')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_default" value="true" />
            {t('set_default')}
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? t('saving') : t('save')}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-input px-4 py-2 text-sm hover:bg-accent"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-lg border-2 border-dashed border-input p-4 text-sm text-muted-foreground hover:bg-accent transition-colors"
        >
          + {t('add_address')}
        </button>
      )}
    </div>
  )
}
