import { getTranslations } from 'next-intl/server'
import { getVehiclesForComparison } from '@/lib/actions/vehicle-actions'
import { ComparePageClient } from './compare-page-client'

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const t = await getTranslations('compare')
  const sp = await searchParams
  const ids = sp.ids ? sp.ids.split(',').filter(Boolean) : []
  let listings: any[] = []
  if (ids.length > 0) {
    listings = await getVehiclesForComparison(ids)
  }

  return <ComparePageClient listings={listings} />
}
