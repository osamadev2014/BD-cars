import { getTranslations } from 'next-intl/server'
import { AdminReportsClient } from './admin-reports-client'

export default async function AdminReportsPage() {
  const t = await getTranslations('admin')
  return <AdminReportsClient />
}
