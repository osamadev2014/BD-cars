'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { SimpleBarChart } from '@/components/analytics/simple-bar-chart'
import { DealerStaffManager } from '@/components/dealers/dealer-staff-manager'

export function DealerDashboardClient({ dealer, analytics }: { dealer: any; analytics?: any }) {
  const t = useTranslations('dealers')
  const at = useTranslations('analytics')
  const plan = dealer.subscription?.[0]?.plan
  const hasAnalytics = plan?.has_analytics && analytics

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{dealer.name}</h1>
          <p className="text-sm text-muted-foreground">
            {t('plan')}: <span className="font-medium">{plan?.name || t('free')}</span>
            {!dealer.is_approved && <span className="mr-2 text-yellow-600">({t('pending_approval')})</span>}
          </p>
        </div>
        <Link href="/plans" className="text-sm text-primary hover:underline">{t('upgrade_plan')}</Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-2xl font-bold">{dealer.listings?.length || 0}</p>
          <p className="text-xs text-muted-foreground">{t('total_listings')}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-2xl font-bold">{hasAnalytics ? analytics.totalViews : dealer.stats?.[0]?.views_count || 0}</p>
          <p className="text-xs text-muted-foreground">{t('total_views')}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-2xl font-bold">{hasAnalytics ? analytics.totalInquiries : dealer.stats?.[0]?.inquiries_count || 0}</p>
          <p className="text-xs text-muted-foreground">{t('inquiries')}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-2xl font-bold">{hasAnalytics ? analytics.totalSales : dealer.stats?.[0]?.sales_count || 0}</p>
          <p className="text-xs text-muted-foreground">{t('sales')}</p>
        </div>
      </div>

      {/* Analytics Section */}
      {plan?.has_analytics && analytics && (
        <>
          {/* Detailed Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 bg-muted/20">
              <p className="text-lg font-bold text-primary">{analytics.totalViews}</p>
              <p className="text-xs text-muted-foreground">{at('total_views')}</p>
            </div>
            <div className="border rounded-lg p-4 bg-muted/20">
              <p className="text-lg font-bold text-primary">{analytics.totalInquiries}</p>
              <p className="text-xs text-muted-foreground">{at('total_inquiries')}</p>
            </div>
            <div className="border rounded-lg p-4 bg-muted/20">
              <p className="text-lg font-bold text-primary">{analytics.totalSales}</p>
              <p className="text-xs text-muted-foreground">{at('total_sales')}</p>
            </div>
            <div className="border rounded-lg p-4 bg-muted/20">
              <p className="text-lg font-bold text-primary">{analytics.avgRating > 0 ? analytics.avgRating : '-'}</p>
              <p className="text-xs text-muted-foreground">{at('avg_rating')} ({analytics.reviewCount})</p>
            </div>
          </div>

          {/* Views Chart */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">{at('views_over_time')}</h3>
            {analytics.totalViews > 0 ? (
              <SimpleBarChart data={analytics.dailyViews} />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">{at('no_views')}</p>
            )}
          </div>

          {/* Top Listings */}
          {analytics.topListings?.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">{at('top_listings')}</h3>
              <div className="space-y-2">
                {analytics.topListings.map((l: any) => (
                  <div key={l.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {l.image && (
                        <img src={l.image} className="w-16 h-12 rounded object-cover flex-shrink-0" alt="" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{l.make} {l.model} ({l.year})</p>
                        <p className="text-xs text-muted-foreground">{Number(l.price).toLocaleString()} SAR</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                      <span>{at('views')}: {l.views}</span>
                      <span>{at('inquiries')}: {l.inquiries}</span>
                      <Link href={`/listings/${l.slug}`} className="text-primary hover:underline">{t('view')}</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {plan && !plan.has_analytics && (
        <div className="border rounded-lg p-6 text-center bg-muted/20">
          <p className="text-sm text-muted-foreground mb-3">{at('no_analytics')}</p>
          <Link href="/plans" className="text-sm text-primary hover:underline font-medium">{t('upgrade_plan')}</Link>
        </div>
      )}

      {/* Plan Limits */}
      {plan && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">{t('plan_limits')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-muted-foreground">{t('max_listings')}:</span> {plan.max_listings === -1 ? t('unlimited') : plan.max_listings}</div>
            <div><span className="text-muted-foreground">{t('max_staff')}:</span> {plan.max_staff === -1 ? t('unlimited') : plan.max_staff}</div>
            <div><span className="text-muted-foreground">{t('max_branches')}:</span> {plan.max_branches === -1 ? t('unlimited') : plan.max_branches}</div>
            <div><span className="text-muted-foreground">{t('price')}:</span> {plan.price_monthly === 0 ? t('free') : `${plan.price_monthly} SAR/mo`}</div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {plan.has_analytics && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{t('analytics')}</span>}
            {plan.has_wholesale && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{t('wholesale')}</span>}
            {plan.has_auctions && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{t('auctions')}</span>}
            {plan.has_featured && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{t('featured')}</span>}
          </div>
        </div>
      )}

      {/* Listings */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">{t('listings')}</h3>
        <div className="space-y-2">
          {dealer.listings?.map((l: any) => (
            <div key={l.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
              <div className="flex items-center gap-3">
                {l.vehicle?.images?.[0] && (
                  <img src={l.vehicle.images[0].url} className="w-16 h-12 rounded object-cover" alt="" />
                )}
                <div>
                  <p className="text-sm font-medium">{l.vehicle?.make?.name} {l.vehicle?.model?.name} ({l.vehicle?.year})</p>
                  <p className="text-xs text-muted-foreground">{l.status} &middot; {l.price} SAR</p>
                </div>
              </div>
              <Link href={`/listings/${l.slug}`} className="text-xs text-primary hover:underline">{t('view')}</Link>
            </div>
          ))}
          {(!dealer.listings || dealer.listings.length === 0) && (
            <p className="text-sm text-muted-foreground">{t('no_listings')}</p>
          )}
        </div>
      </div>

      <DealerStaffManager dealer={dealer} />

      {/* Ratings */}
      {dealer.ratings?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">{t('reviews')} ({dealer.rating}/5)</h3>
          <div className="space-y-2">
            {dealer.ratings?.map((r: any) => (
              <div key={r.id} className="p-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{r.user?.full_name || 'Anonymous'}</span>
                  <span className="text-xs text-yellow-600">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                {r.review && <p className="text-sm text-muted-foreground mt-1">{r.review}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
