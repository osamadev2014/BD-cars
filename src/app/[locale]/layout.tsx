import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing, locales } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AppProvidersWrapper } from './app-providers-wrapper'
import { AuthProviderWrapper } from './auth-provider-wrapper'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <AppProvidersWrapper>
            <AuthProviderWrapper>
              {children}
              <SpeedInsights />
            </AuthProviderWrapper>
          </AppProvidersWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
