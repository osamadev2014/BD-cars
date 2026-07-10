import type { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { locales, defaultLocale } from '@/i18n/config'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient()

  const [listingResult, dealerResult, auctionResult, partResult] = await Promise.allSettled([
    (supabase as any).from('vehicle_listings').select('slug, updated_at').in('status', ['active', 'published']),
    (supabase as any).from('dealers').select('slug, updated_at'),
    (supabase as any).from('auctions').select('slug, updated_at'),
    (supabase as any).from('spare_parts').select('slug, updated_at'),
  ])

  const listingSlugs = listingResult.status === 'fulfilled' ? listingResult.value.data || [] : []
  const dealerSlugs = dealerResult.status === 'fulfilled' ? dealerResult.value.data || [] : []
  const auctionSlugs = auctionResult.status === 'fulfilled' ? auctionResult.value.data || [] : []
  const partSlugs = partResult.status === 'fulfilled' ? partResult.value.data || [] : []

  const entries: MetadataRoute.Sitemap = []

  const addLocalized = (path: string, priority = 0.8) => {
    for (const locale of locales) {
      const prefix = locale === defaultLocale ? '' : `/${locale}`
      entries.push({
        url: `${siteUrl}${prefix}${path}`,
        lastModified: new Date(),
        priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l === defaultLocale ? 'x-default' : l, `${siteUrl}${l === defaultLocale ? '' : `/${l}`}${path}`])
          ),
        },
      })
    }
  }

  addLocalized('/', 1.0)
  addLocalized('/listings', 0.9)
  addLocalized('/dealers', 0.8)
  addLocalized('/auctions', 0.8)
  addLocalized('/parts', 0.7)
  addLocalized('/inspect', 0.6)
  addLocalized('/finance', 0.6)
  addLocalized('/insurance', 0.6)
  addLocalized('/contact', 0.5)
  addLocalized('/plans', 0.5)

  for (const slug of listingSlugs) {
    const lastMod = slug.updated_at ? new Date(slug.updated_at) : new Date()
    for (const locale of locales) {
      const prefix = locale === defaultLocale ? '' : `/${locale}`
      entries.push({
        url: `${siteUrl}${prefix}/listings/${slug.slug}`,
        lastModified: lastMod,
        priority: 0.7,
      })
    }
  }

  for (const slug of dealerSlugs) {
    const lastMod = slug.updated_at ? new Date(slug.updated_at) : new Date()
    for (const locale of locales) {
      const prefix = locale === defaultLocale ? '' : `/${locale}`
      entries.push({
        url: `${siteUrl}${prefix}/dealers/${slug.slug}`,
        lastModified: lastMod,
        priority: 0.6,
      })
    }
  }

  for (const slug of auctionSlugs) {
    const lastMod = slug.updated_at ? new Date(slug.updated_at) : new Date()
    for (const locale of locales) {
      const prefix = locale === defaultLocale ? '' : `/${locale}`
      entries.push({
        url: `${siteUrl}${prefix}/auctions/${slug.slug}`,
        lastModified: lastMod,
        priority: 0.7,
      })
    }
  }

  for (const slug of partSlugs) {
    const lastMod = slug.updated_at ? new Date(slug.updated_at) : new Date()
    for (const locale of locales) {
      const prefix = locale === defaultLocale ? '' : `/${locale}`
      entries.push({
        url: `${siteUrl}${prefix}/parts/${slug.slug}`,
        lastModified: lastMod,
        priority: 0.6,
      })
    }
  }

  return entries
}
