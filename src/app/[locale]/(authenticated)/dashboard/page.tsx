import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const t = await getTranslations('common')

  const links = [
    { href: '/dashboard/listings', label: t('my_listings'), icon: '📋' },
    { href: '/dashboard/favorites', label: t('favorites'), icon: '⭐' },
    { href: '/dashboard/messages', label: t('messages'), icon: '💬' },
    { href: '/dashboard/inspections', label: t('inspections'), icon: '🔧' },
    { href: '/dashboard/auctions', label: t('my_auctions'), icon: '🔨' },
    { href: '/dashboard/settings', label: t('settings'), icon: '⚙️' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card"
          >
            <span className="text-2xl">{link.icon}</span>
            <h3 className="font-semibold mt-2">{link.label}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
