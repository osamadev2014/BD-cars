import { getTranslations } from 'next-intl/server'
import { DashboardPageClient } from './dashboard-page-client'

export default async function DashboardPage() {
  const t = await getTranslations('common')
  return <DashboardPageClient />
}
