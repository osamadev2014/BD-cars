import { getTranslations } from 'next-intl/server'
import { getPaymentProviders } from '@/lib/actions/finance-admin-actions'
import { PaymentsClient } from './payments-client'

export default async function PaymentsPage() {
  const t = await getTranslations('admin')
  const providers = await getPaymentProviders()
  return <PaymentsClient providers={providers} />
}
