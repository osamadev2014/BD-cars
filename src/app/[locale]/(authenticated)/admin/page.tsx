import { getTranslations } from 'next-intl/server'
import { getAdminMetrics } from '@/lib/actions/settings-actions'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const t = await getTranslations('admin')
  const metrics = await getAdminMetrics()

  if (!metrics) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t('access_denied')}
      </div>
    )
  }

  const cards = [
    { label: t('total_listings'), value: metrics.totalListings, href: '/admin/approvals' },
    { label: t('pending_approvals'), value: metrics.pendingListings, href: '/admin/approvals' },
    { label: t('total_users'), value: metrics.totalUsers, href: '#' },
    { label: t('total_dealers'), value: metrics.totalDealers, href: '/admin/dealers' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card"
          >
            <p className="text-3xl font-bold text-primary">{card.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
