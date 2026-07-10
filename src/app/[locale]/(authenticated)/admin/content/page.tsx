import { getTranslations } from 'next-intl/server'
import { getAllPages, getAllBanners } from '@/lib/actions/content-actions'
import { ContentManagerClient } from './content-manager-client'

export default async function AdminContentPage() {
  const t = await getTranslations('content')
  const pages = await getAllPages()
  const banners = await getAllBanners()

  return <ContentManagerClient pages={pages} banners={banners} />
}
