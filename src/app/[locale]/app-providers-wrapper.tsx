'use client'

import { AppProviders } from '@/providers/app-providers'
import type { ReactNode } from 'react'

export function AppProvidersWrapper({ children }: { children: ReactNode }) {
  return <AppProviders>{children}</AppProviders>
}
