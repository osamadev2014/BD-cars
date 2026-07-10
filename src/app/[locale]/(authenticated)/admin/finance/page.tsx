import { getTranslations } from 'next-intl/server'
import { getAllFinanceRequests, getFinancePartners } from '@/lib/actions/finance-actions'
import { AdminFinanceClient } from './admin-finance-client'

export default async function AdminFinancePage() {
  const t = await getTranslations('admin')
  const requests = await getAllFinanceRequests()
  const partners = await getFinancePartners(true)
  return <AdminFinanceClient requests={requests} partners={partners} />
}
