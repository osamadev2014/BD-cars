import { getTranslations } from 'next-intl/server'
import { getAllInsuranceRequests, getInsurancePartners } from '@/lib/actions/insurance-actions'
import { AdminInsuranceClient } from './admin-insurance-client'

export default async function AdminInsurancePage() {
  const t = await getTranslations('admin')
  const requests = await getAllInsuranceRequests()
  const partners = await getInsurancePartners(true)
  return <AdminInsuranceClient requests={requests} partners={partners} />
}
