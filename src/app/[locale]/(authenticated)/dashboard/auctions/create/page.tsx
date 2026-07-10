import { getTranslations } from 'next-intl/server'
import { getUserListings } from '@/lib/actions/auction-actions'
import { CreateAuctionForm } from './create-auction-form'
import { redirect } from 'next/navigation'

export default async function CreateAuctionPage() {
  const t = await getTranslations('auctions')
  const listings = await getUserListings()

  if (listings.length === 0) {
    redirect('/dashboard/auctions?error=no_listings')
  }

  return <CreateAuctionForm listings={listings} />
}
