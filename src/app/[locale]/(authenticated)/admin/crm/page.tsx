import { getTranslations } from 'next-intl/server'
import { getAllCrmCustomers } from '@/lib/actions/crm-actions'
import { AdminCrmClient } from './admin-crm-client'

export default async function AdminCrmPage() {
  const t = await getTranslations('crm')
  const customers = await getAllCrmCustomers()
  return <AdminCrmClient customers={customers} />
}
