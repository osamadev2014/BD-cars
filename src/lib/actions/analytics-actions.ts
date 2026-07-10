'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { getMyDealer } from './dealer-actions'

export async function getDealerAnalytics() {
  const auth = await requireAuth()
  if (!auth.allowed) return null

  try {
    const supabase = await createServerSupabaseClient()
    const dealer = await getMyDealer()
    if (!dealer) return null

    const { data: listings } = await (supabase as any)
      .from('vehicle_listings')
      .select('id, slug, title, title_ar, price, created_at, vehicle:vehicles(make:makes(name), model:models(name), year, images:vehicle_images(url))')
      .eq('dealer_id', dealer.id)

    const listingIds = (listings || []).map((l: any) => l.id)

    if (listingIds.length === 0) {
      return { totalViews: 0, totalInquiries: 0, totalSales: 0, avgRating: 0, reviewCount: 0, dailyViews: [], topListings: [] }
    }

    const [viewsResult, inquiriesResult, reviewsResult] = await Promise.all([
      (supabase as any).from('vehicle_views').select('created_at, listing_id').in('listing_id', listingIds).order('created_at', { ascending: true }),
      (supabase as any).from('purchase_requests').select('id, listing_id, status, created_at').in('listing_id', listingIds),
      (supabase as any).from('listing_reviews').select('rating, listing_id').in('listing_id', listingIds),
    ])

    const views = viewsResult.data || []
    const inquiries = inquiriesResult.data || []
    const reviews = reviewsResult.data || []

    const totalViews = views.length
    const totalInquiries = inquiries.length
    const totalSales = inquiries.filter((i: any) => i.status === 'approved' || i.status === 'completed').length
    const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length) : 0

    const dailyViews: { date: string; count: number }[] = []
    const viewMap = new Map<string, number>()
    for (const v of views) {
      const day = new Date(v.created_at).toISOString().slice(0, 10)
      viewMap.set(day, (viewMap.get(day) || 0) + 1)
    }
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      dailyViews.push({ date: key, count: viewMap.get(key) || 0 })
    }

    const listingViewsMap = new Map<string, number>()
    for (const v of views) {
      listingViewsMap.set(v.listing_id, (listingViewsMap.get(v.listing_id) || 0) + 1)
    }
    const listingInquiriesMap = new Map<string, number>()
    for (const i of inquiries) {
      listingInquiriesMap.set(i.listing_id, (listingInquiriesMap.get(i.listing_id) || 0) + 1)
    }

    const topListings = (listings || [])
      .map((l: any) => ({
        id: l.id,
        slug: l.slug,
        title: l.title || l.title_ar,
        image: l.vehicle?.images?.[0]?.url || '',
        make: l.vehicle?.make?.name || '',
        model: l.vehicle?.model?.name || '',
        year: l.vehicle?.year,
        price: l.price,
        views: listingViewsMap.get(l.id) || 0,
        inquiries: listingInquiriesMap.get(l.id) || 0,
      }))
      .sort((a: any, b: any) => b.views - a.views)
      .slice(0, 10)

    return { totalViews, totalInquiries, totalSales, avgRating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length, dailyViews, topListings }
  } catch {
    return null
  }
}
