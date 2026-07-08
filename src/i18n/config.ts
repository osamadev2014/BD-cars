import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale = 'ar' as const

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
})

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
}

export const isRtl = (locale: Locale) => locale === 'ar'
