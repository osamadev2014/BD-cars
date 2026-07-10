import { getTranslations } from 'next-intl/server'
import { getDeliveryAddresses, getCities } from '@/lib/actions/delivery-actions'
import { AddressList } from './address-list'

export default async function DeliveryAddressesPage() {
  const t = await getTranslations('delivery')
  const addresses = await getDeliveryAddresses()
  const cities = await getCities()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t('addresses_title')}</h1>
      <AddressList addresses={addresses} cities={cities} t={t} />
    </div>
  )
}
