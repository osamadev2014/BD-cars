'use client'

import { ThemeProvider } from './theme-provider'
import { LocaleProvider } from './locale-provider'
import type { ReactNode } from 'react'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        {children}
      </LocaleProvider>
    </ThemeProvider>
  )
}
