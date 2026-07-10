import Link from 'next/link'

export function Footer() {
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
              <li><Link href="/listings">Browse Cars</Link></li>
              <li><Link href="/listings/new">Sell Your Car</Link></li>
              <li><Link href="/auctions">Auctions</Link></li>
              <li><Link href="/dealers">Find a Dealer</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/inspection">Inspection</Link></li>
              <li><Link href="/parts">Spare Parts</Link></li>
              <li><Link href="/finance">Finance</Link></li>
              <li><Link href="/insurance">Insurance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/pages/about">About Us</Link></li>
              <li><Link href="/pages/faq">FAQ</Link></li>
              <li><Link href="/pages/terms">Terms of Service</Link></li>
              <li><Link href="/pages/privacy">Privacy Policy</Link></li>
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
