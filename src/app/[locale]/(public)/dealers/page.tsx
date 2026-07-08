import { getTranslations } from 'next-intl/server'
import { getDealers } from '@/lib/actions/dealer-actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DealersPage() {
  const t = await getTranslations('dealers')
  const dealers = await getDealers()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
      <p className="text-muted-foreground mb-8">{t('subtitle')}</p>

      {dealers.length === 0 ? (
        <div className="border rounded-lg bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">{t('no_dealers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dealers.map((dealer: any) => (
            <Link key={dealer.id} href={`/dealers/${dealer.slug}`} className="border rounded-lg p-6 bg-card hover:border-primary transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground overflow-hidden flex-shrink-0">
                  {dealer.logo_url ? (
                    <img src={dealer.logo_url} alt={dealer.name} className="w-full h-full object-cover" />
                  ) : (
                    dealer.name[0]
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{dealer.name}</h3>
                  {dealer.city && <p className="text-sm text-muted-foreground truncate">{dealer.cities?.name || dealer.cities?.name_ar}</p>}
                  {dealer.rating > 0 && (
                    <p className="text-sm">{'★'.repeat(Math.round(dealer.rating))} ({dealer.review_count})</p>
                  )}
                </div>
              </div>
              {dealer.description && (
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{dealer.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
