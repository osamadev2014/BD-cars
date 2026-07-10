import type { Metadata } from 'next'
import { getPartBySlug } from '@/lib/actions/part-actions'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { buildMetadata, buildProductSchema } from '@/lib/seo'
import { JsonLd } from '@/components/shared/json-ld'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const part = await getPartBySlug(slug)
  if (!part) return {}
  const primaryImage = part.spare_part_images?.find((img: any) => img.is_primary) || part.spare_part_images?.[0]
  return buildMetadata({
    title: part.title,
    description: part.description?.slice(0, 160) || `${part.title} - ${Number(part.price).toLocaleString()} SAR`,
    path: `/parts/${slug}`,
    ogImage: primaryImage?.url,
  })
}

export default async function PartDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const t = await getTranslations('parts')
  const part = await getPartBySlug(slug)
  if (!part) notFound()

  const primaryImage = part.spare_part_images?.find((img: any) => img.is_primary) || part.spare_part_images?.[0]

  const partSchema = buildProductSchema({
    title: part.title,
    description: part.description,
    price: Number(part.price),
    image: primaryImage?.url,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/parts/${slug}`,
    condition: part.condition,
    brand: part.part_brands?.name,
    sku: part.part_number,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={partSchema} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground overflow-hidden">
          {primaryImage ? (
            <img src={primaryImage.url} alt={part.title} className="w-full h-full object-cover" />
          ) : (
            t('no_image')
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{part.title}</h1>
            {part.part_categories && (
              <p className="text-muted-foreground">{part.part_categories.name}</p>
            )}
          </div>

          {part.description && <p>{part.description}</p>}

          <div className="grid grid-cols-2 gap-4 text-sm">
            {part.brand_id && part.part_brands && (
              <div><span className="text-muted-foreground">{t('brand')}:</span> {part.part_brands.name}</div>
            )}
            {part.part_number && (
              <div><span className="text-muted-foreground">{t('part_number')}:</span> <span className="font-mono">{part.part_number}</span></div>
            )}
            {part.oem_number && (
              <div><span className="text-muted-foreground">{t('oem_number')}:</span> <span className="font-mono">{part.oem_number}</span></div>
            )}
            <div><span className="text-muted-foreground">{t('condition')}:</span> {t(part.condition)}</div>
            <div><span className="text-muted-foreground">{t('part_type')}:</span> {t(part.part_type)}</div>
            {part.warranty_months && (
              <div><span className="text-muted-foreground">{t('warranty')}:</span> {part.warranty_months} {t('months')}</div>
            )}
          </div>

          <div className="border-t pt-4 flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">{Number(part.price).toLocaleString()} SAR</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                part.stock_status === 'in_stock' ? 'bg-green-100 text-green-700' :
                part.stock_status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {t(part.stock_status)}
              </span>
            </div>
          </div>

          {part.spare_part_compatibility?.length > 0 && (
            <div className="border-t pt-4">
              <h2 className="font-semibold mb-2">{t('compatibility')}</h2>
              <div className="space-y-1 text-sm">
                {part.spare_part_compatibility.map((comp: any) => (
                  <p key={comp.id} className="text-muted-foreground">
                    {comp.car_makes?.name} {comp.car_models?.name}
                    {comp.year_from && ` (${comp.year_from}${comp.year_to ? ` - ${comp.year_to}` : '+'})`}
                  </p>
                ))}
              </div>
            </div>
          )}

          {part.spare_part_images?.length > 1 && (
            <div className="border-t pt-4">
              <h2 className="font-semibold mb-2">{t('gallery')}</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {part.spare_part_images.filter((img: any) => !img.is_primary).map((img: any) => (
                  <div key={img.id} className="w-20 h-20 flex-shrink-0 bg-muted rounded overflow-hidden">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
