import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { getPublishedPage } from '@/lib/actions/content-actions'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = await getPublishedPage(slug)
  if (!page) return {}
  const locale = await getLocale()
  const title = locale === 'ar' ? (page.title_ar || page.title) : page.title
  const desc = (locale === 'ar' ? (page.meta_description_ar || page.meta_description) : page.meta_description) || title
  return buildMetadata({
    title,
    description: desc.slice(0, 160),
    path: `/pages/${slug}`,
    noIndex: !page.is_published,
  })
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPublishedPage(slug)
  if (!page) notFound()

  const locale = await getLocale()
  const title = locale === 'ar' ? (page.title_ar || page.title) : page.title
  const content = locale === 'ar' ? (page.content_ar || page.content) : page.content

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  )
}
