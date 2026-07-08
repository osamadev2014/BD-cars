import { getInspectionServices, getInspectionCenters } from '@/lib/actions/inspection-actions'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function InspectPage() {
  const t = await getTranslations('inspection')
  const [services, centers] = await Promise.all([
    getInspectionServices(),
    getInspectionCenters(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{t('services')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.length === 0 && (
            <p className="text-muted-foreground col-span-3">{t('no_services')}</p>
          )}
          {services.map((service: any) => (
            <div key={service.id} className="border rounded-lg p-5 bg-card">
              <h3 className="font-semibold">{service.name}</h3>
              {service.description && (
                <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
              )}
              <div className="flex items-center justify-between mt-3 text-sm">
                {service.default_price && (
                  <span className="font-bold">{Number(service.default_price).toLocaleString()} SAR</span>
                )}
                {service.duration_minutes && (
                  <span className="text-muted-foreground">{service.duration_minutes} {t('minutes')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">{t('centers')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.length === 0 && (
            <p className="text-muted-foreground col-span-3">{t('no_centers')}</p>
          )}
          {centers.map((center: any) => (
            <Link
              key={center.id}
              href={`/inspect/${center.slug}`}
              className="border rounded-lg p-5 bg-card hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg">{center.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{center.city?.name}</p>
              {center.phone && <p className="text-sm mt-1" dir="ltr">{center.phone}</p>}
              <p className="text-xs text-muted-foreground mt-2">
                {center.branches?.length || 0} {t('branches')}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
