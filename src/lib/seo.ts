import type { Metadata } from 'next'
import { defaultLocale, locales, type Locale } from '@/i18n/config'

const siteName = 'BD'
const siteDescription = 'Saudi Automotive Marketplace - Buy and sell cars in Saudi Arabia'
const defaultOgImage = '/og-image.png'
const twitterHandle = '@bdevico'

export function siteUrl(locale: Locale = defaultLocale): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return locale === defaultLocale ? base : `${base}/${locale}`
}

export function absoluteUrl(path: string, locale: Locale = defaultLocale): string {
  const base = siteUrl(locale)
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

export function alternates(
  path: string,
  currentLocale: Locale,
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[locale === defaultLocale ? 'x-default' : locale] = absoluteUrl(path, locale)
  }
  return {
    canonical: absoluteUrl(path, currentLocale),
    languages,
  }
}

export function buildMetadata(
  overrides: {
    title: string
    description: string
    path?: string
    locale?: Locale
    ogImage?: string
    noIndex?: boolean
  },
): Metadata {
  const locale = overrides.locale || defaultLocale
  const path = overrides.path || '/'
  const alts = alternates(path, locale)

  const metadata: Metadata = {
    title: `${overrides.title} | ${siteName}`,
    description: overrides.description,
    alternates: {
      canonical: alts.canonical,
      languages: alts.languages,
    },
    openGraph: {
      title: `${overrides.title} | ${siteName}`,
      description: overrides.description,
      siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
      images: overrides.ogImage
        ? [{ url: overrides.ogImage, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${overrides.title} | ${siteName}`,
      description: overrides.description,
      site: twitterHandle,
      images: overrides.ogImage ? [overrides.ogImage] : undefined,
    },
    other: {
      'og:locale:alternate': locales.filter(l => l !== locale).join(','),
    },
  }

  if (overrides.noIndex) {
    metadata.robots = { index: false, follow: false }
  }

  return metadata
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildVehicleSchema(listing: {
  price: number
  currency?: string
  mileage?: number
  year?: number
  make?: string
  model?: string
  trim?: string
  bodyType?: string
  fuelType?: string
  transmission?: string
  color?: string
  condition?: string
  description?: string
  image?: string
  url: string
  sellerName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${listing.year} ${listing.make} ${listing.model}${listing.trim ? ` ${listing.trim}` : ''}`,
    description: listing.description,
    image: listing.image,
    url: listing.url,
    vehicleModelDate: listing.year?.toString(),
    vehicleIdentificationNumber: undefined,
    mileageFromOdometer: listing.mileage
      ? { '@type': 'QuantitativeValue', value: listing.mileage, unitCode: 'KMT' }
      : undefined,
    bodyType: listing.bodyType,
    fuelType: listing.fuelType,
    vehicleTransmission: listing.transmission,
    color: listing.color,
    vehicleInteriorColor: undefined,
    vehicleSeatingCapacity: undefined,
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: listing.currency || 'SAR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Person',
        name: listing.sellerName || 'Seller',
      },
    },
  }
}

export function buildLocalBusinessSchema(dealer: {
  name: string
  description?: string
  logo?: string
  image?: string
  url: string
  telephone?: string
  email?: string
  address?: string
  aggregateRating?: { ratingValue: number; reviewCount: number }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: dealer.name,
    description: dealer.description,
    url: dealer.url,
    image: dealer.image || dealer.logo,
    logo: dealer.logo,
    telephone: dealer.telephone,
    email: dealer.email,
    address: dealer.address ? {
      '@type': 'PostalAddress',
      streetAddress: dealer.address,
      addressCountry: 'SA',
    } : undefined,
    ...(dealer.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: dealer.aggregateRating.ratingValue,
        reviewCount: dealer.aggregateRating.reviewCount,
      },
    }),
  }
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl()}/listings?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildProductSchema(part: {
  title: string
  description?: string
  price: number
  currency?: string
  image?: string
  url: string
  condition?: string
  brand?: string
  sku?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: part.title,
    description: part.description,
    image: part.image,
    url: part.url,
    sku: part.sku,
    brand: part.brand ? { '@type': 'Brand', name: part.brand } : undefined,
    offers: {
      '@type': 'Offer',
      price: part.price,
      priceCurrency: part.currency || 'SAR',
      availability: 'https://schema.org/InStock',
      itemCondition: part.condition === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    },
  }
}
