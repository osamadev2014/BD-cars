import { getTranslations } from 'next-intl/server'
import { getDealerDashboard } from '@/lib/actions/dealer-actions'
import { getDealerAnalytics } from '@/lib/actions/analytics-actions'
import { DealerDashboardClient } from './dealer-dashboard-client'
import Link from 'next/link'

export default async function DealerDashboardPage() {
  const t = await getTranslations('dealers')
  const dealer = await getDealerDashboard()

  if (!dealer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{t('no_dealer')}</p>
        <Link href="/dealers/register" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          {t('register_now')}
        </Link>
      </div>
    )
  }

  const analytics = await getDealerAnalytics()

  return <DealerDashboardClient dealer={dealer} analytics={analytics} />
}
