'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

export function Footer() {
  const locale = useLocale()
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-3">BD</h3>
            <p className="text-sm text-muted-foreground">
              Saudi Automotive Marketplace
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Buy & Sell</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={`/${locale}/listings`}>Browse Cars</Link></li>
              <li><Link href={`/${locale}/listings/new`}>Sell Your Car</Link></li>
              <li><Link href={`/${locale}/auctions`}>Auctions</Link></li>
              <li><Link href={`/${locale}/dealers`}>Find a Dealer</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={`/${locale}/inspect`}>Inspection</Link></li>
              <li><Link href={`/${locale}/parts`}>Spare Parts</Link></li>
              <li><Link href={`/${locale}/finance`}>Finance</Link></li>
              <li><Link href={`/${locale}/insurance`}>Insurance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={`/${locale}/contact`}>Contact Us</Link></li>
              <li><Link href={`/${locale}/pages/about`}>About Us</Link></li>
              <li><Link href={`/${locale}/pages/faq`}>FAQ</Link></li>
              <li><Link href={`/${locale}/pages/terms`}>Terms of Service</Link></li>
              <li><Link href={`/${locale}/pages/privacy`}>Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BD. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
