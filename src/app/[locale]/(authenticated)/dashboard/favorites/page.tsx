import { getTranslations } from 'next-intl/server'
import { getFavorites } from '@/lib/actions/vehicle-actions'
import { VehicleCard } from '@/components/vehicles/vehicle-card'

export default async function FavoritesPage() {
  const t = await getTranslations('common')
  const { data: favorites } = await getFavorites()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('favorites')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((fav: any) => (
          <VehicleCard key={fav.id} listing={fav.listing} />
        ))}
      </div>
      {favorites.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">{t('no_favorites')}</div>
      )}
    </div>
  )
}
