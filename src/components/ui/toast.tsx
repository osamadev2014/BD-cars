'use client'

import { Toaster as SonnerToaster } from 'sonner'
import { useLocale } from 'next-intl'

function Toaster() {
  const locale = useLocale()

  return (
    <SonnerToaster
      position={locale === 'ar' ? 'top-left' : 'top-right'}
      richColors
      closeButton
      theme="light"
      toastOptions={{
        duration: 4000,
      }}
    />
  )
}

export { Toaster }
export { toast } from 'sonner'
