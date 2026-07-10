import { getTranslations } from 'next-intl/server'
import { getAllPlans } from '@/lib/actions/dealer-actions'
import { AdminPlansClient } from './admin-plans-client'

export default async function AdminPlansPage() {
  const t = await getTranslations('admin')
  const plans = await getAllPlans()
  return <AdminPlansClient plans={plans} />
}
