import Script from 'next/script'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing, locales, isRtl } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AppProvidersWrapper } from './app-providers-wrapper'
import { AuthProviderWrapper } from './auth-provider-wrapper'
import AIInspectButton from '@/components/dev/AIInspectButton'

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
  const dir = isRtl(locale) ? 'rtl' : 'ltr'

  return (
    <>
      <Script
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${locale}";document.documentElement.dir="${dir}"`,
        }}
      />
      <NextIntlClientProvider messages={messages}>
        <AppProvidersWrapper>
          <AuthProviderWrapper>
            {children}
            <SpeedInsights />
          </AuthProviderWrapper>
        </AppProvidersWrapper>
      </NextIntlClientProvider>
      <AIInspectButton />
    </>
  )
}
