import { getTranslations } from 'next-intl/server'
import { getUserViewingAppointments } from '@/lib/actions/buy-actions'

export default async function MyViewingsPage() {
  const t = await getTranslations('common')
  const { data: viewings } = await getUserViewingAppointments()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('viewings')}</h1>
      <div className="space-y-3">
        {viewings.map((v: any) => {
          const vehicle = v.listing?.vehicle
          const img = vehicle?.images?.find((i: any) => i.is_primary) || vehicle?.images?.[0]
          return (
            <div key={v.id} className="border rounded-lg p-4 flex gap-4 items-start">
              <div className="w-20 h-20 rounded-md bg-muted overflow-hidden shrink-0">
                {img ? (
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground">{t('no_image')}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {vehicle?.make?.name} {vehicle?.model?.name} {vehicle?.year}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(v.appointment_date).toLocaleDateString('en-SA', {
                    dateStyle: 'full',
                  })} - {new Date(v.appointment_date).toLocaleTimeString('en-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">{v.location}</p>
                <p className="text-sm mt-1">{t('status')}: {t(v.status)}</p>
              </div>
            </div>
          )
        })}
        {viewings.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">{t('no_viewings')}</div>
        )}
      </div>
    </div>
  )
}
