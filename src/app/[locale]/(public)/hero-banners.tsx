import { getActiveBanners } from '@/lib/actions/content-actions'
import Link from 'next/link'

export async function HeroBanners() {
  const banners = await getActiveBanners()
  if (banners.length === 0) return null

  return (
    <div className="relative overflow-hidden">
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none">
        {banners.map((banner: any) => (
          <div key={banner.id} className="min-w-full snap-center relative h-[300px] md:h-[400px]">
            <img src={banner.image_url} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="relative h-full flex items-center container mx-auto px-4">
              <div className="max-w-lg text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                {banner.subtitle && <p className="text-lg md:text-xl text-white/80 mb-4">{banner.subtitle}</p>}
                {banner.link_url && (
                  <Link href={banner.link_url} className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    {banner.link_url === '/listings' ? 'Browse Cars' : banner.link_url === '/listings/new' ? 'Sell Your Car' : 'Learn More'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_: any, i: number) => (
          <div key={i} className="w-2 h-2 rounded-full bg-white/60" />
        ))}
      </div>
    </div>
  )
}
