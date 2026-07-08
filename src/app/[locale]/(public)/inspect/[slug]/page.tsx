import { getInspectionCenterBySlug, getInspectionServices } from '@/lib/actions/inspection-actions'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CenterPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const t = await getTranslations('inspection')
  const [center, services] = await Promise.all([
    getInspectionCenterBySlug(slug),
    getInspectionServices(),
  ])

  if (!center) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{center.name}</h1>
            <p className="text-muted-foreground">{center.city?.name}{center.address ? ` - ${center.address}` : ''}</p>
          </div>

          {center.description && <p>{center.description}</p>}

          {center.phone && (
            <div>
              <p className="text-sm font-medium">{t('phone')}</p>
              <p dir="ltr">{center.phone}</p>
            </div>
          )}

          {center.branches?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">{t('branches')}</h2>
              <div className="space-y-3">
                {center.branches.map((branch: any) => (
                  <div key={branch.id} className="border rounded-lg p-4 bg-card">
                    <p className="font-medium">{branch.name}</p>
                    <p className="text-sm text-muted-foreground">{branch.city?.name}{branch.address ? ` - ${branch.address}` : ''}</p>
                    {branch.phone && <p className="text-sm" dir="ltr">{branch.phone}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t('available_services')}</h2>
          {services
            .filter((s: any) => {
              const pricing = center.pricing?.find((p: any) => p.service_id === s.id)
              return pricing || s.default_price
            })
            .map((service: any) => {
              const pricing = center.pricing?.find((p: any) => p.service_id === service.id)
              const price = pricing?.price || service.default_price

              return (
                <div key={service.id} className="border rounded-lg p-4 bg-card">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg">{Number(price).toLocaleString()} SAR</span>
                    <Link
                      href={`/inspect/${center.slug}/book?service=${service.id}`}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      {t('book_now')}
                    </Link>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
