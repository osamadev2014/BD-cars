import type { Metadata, Viewport } from "next"
import { Noto_Sans_Arabic } from 'next/font/google'
import "./globals.css"

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
    title: {
    default: "BD",
    template: "%s | BD",
  },
  description: "Saudi Automotive Marketplace - Buy and sell cars in Saudi Arabia",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    siteName: "BD",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    site: "@bdevico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${notoSansArabic.variable} min-h-full flex flex-col bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
