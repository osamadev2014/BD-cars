'use client'

import { createContext, useContext, useCallback } from 'react'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import type { Locale } from '@/types'
import type { ReactNode } from 'react'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  isRtl: boolean
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'ar',
  setLocale: () => {},
  isRtl: true,
})

export function useLocale() {
  return useContext(LocaleContext)
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const locale = (params?.locale as Locale) || 'ar'
  const isRtl = locale === 'ar'

  const setLocale = useCallback(
    (newLocale: Locale) => {
      router.replace(pathname, { locale: newLocale })
    },
    [router, pathname]
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isRtl }}>
      {children}
    </LocaleContext.Provider>
  )
}
