import type { Metadata, Viewport } from "next"
import "./globals.css"

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
  return children
}
