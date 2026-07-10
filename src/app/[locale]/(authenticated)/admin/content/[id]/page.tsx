import { getTranslations } from 'next-intl/server'
import { getPage } from '@/lib/actions/content-actions'
import { PageEditorClient } from './page-editor-client'
import { notFound } from 'next/navigation'

export default async function AdminContentEditPage({ params }: { params: { id: string } }) {
  const t = await getTranslations('content')
  const page = await getPage(params.id)
  if (!page) notFound()

  return <PageEditorClient page={page} />
}
