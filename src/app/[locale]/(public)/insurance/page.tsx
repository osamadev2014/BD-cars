import { getTranslations } from 'next-intl/server'
import { getInsurancePartners } from '@/lib/actions/insurance-actions'

export default async function InsurancePage() {
  const t = await getTranslations('insurance')
  const partners = await getInsurancePartners()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
      <p className="text-muted-foreground mb-8">{t('subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((p: any) => (
          <div key={p.id} className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                  {p.name[0]}
                </div>
              )}
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                {p.name_ar && <p className="text-sm text-muted-foreground">{p.name_ar}</p>}
              </div>
            </div>
            {p.description && <p className="text-sm text-muted-foreground mb-4">{p.description}</p>}
            {p.description_ar && <p className="text-sm text-muted-foreground mb-4">{p.description_ar}</p>}
            <a
              href={`/listings?insurance=${p.id}`}
              className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t('apply')}
            </a>
          </div>
        ))}
        {partners.length === 0 && (
          <p className="col-span-full text-center py-12 text-muted-foreground">{t('no_partners')}</p>
        )}
      </div>
    </div>
  )
}
