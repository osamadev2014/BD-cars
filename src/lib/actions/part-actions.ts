'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export async function getPartCategories(parentId?: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    let query = (supabase as any)
      .from('part_categories')
      .select('*')
      .eq('is_active', true)
      .order('name')
    if (parentId !== undefined) {
      query = parentId ? query.eq('parent_id', parentId) : query.is('parent_id', null)
    }
    const { data } = await query
    return data || []
  }, [])
}

export async function getPartBrands() {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('part_brands')
      .select('*')
      .eq('is_active', true)
      .order('name')
    return data || []
  }, [])
}

export async function getParts(filters?: {
  category?: string
  brand?: string
  condition?: string
  partType?: string
  search?: string
  page?: number
  perPage?: number
}) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const page = filters?.page || 1
    const perPage = filters?.perPage || 20
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = (supabase as any)
      .from('spare_parts')
      .select('*, part_categories!category_id(name, name_ar, slug), part_brands!brand_id(name, name_ar, slug), spare_part_images( url, is_primary )', { count: 'exact' })
      .eq('is_active', true)
      .eq('is_approved', true)

    if (filters?.category) query = query.eq('category_id', filters.category)
    if (filters?.brand) query = query.eq('brand_id', filters.brand)
    if (filters?.condition) query = query.eq('condition', filters.condition)
    if (filters?.partType) query = query.eq('part_type', filters.partType)
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,title_ar.ilike.%${filters.search}%,part_number.ilike.%${filters.search}%`)
    }

    const { data, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    return { data: data || [], total: count || 0, page, perPage }
  }, { data: [], total: 0, page: 1, perPage: 20 })
}

export async function getPartBySlug(slug: string) {
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('spare_parts')
      .select('*, part_categories!category_id(*), part_brands!brand_id(*), spare_part_images(*), spare_part_compatibility(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    return data || null
  }, null)
}

export async function createPart(input: {
  title: string
  title_ar?: string
  category_id: string
  brand_id?: string
  part_number?: string
  oem_number?: string
  description?: string
  description_ar?: string
  condition: string
  part_type: string
  price: number
  stock_quantity: number
  warranty_months?: number
  return_days?: number
}) {
  const user = await requireAuth()
  if (!user.allowed) return { success: false, error: user.error! }

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await (supabase as any)
      .from('spare_parts')
      .insert({
        title: input.title,
        title_ar: input.title_ar,
        category_id: input.category_id,
        brand_id: input.brand_id,
        part_number: input.part_number,
        oem_number: input.oem_number,
        description: input.description,
        description_ar: input.description_ar,
        condition: input.condition,
        part_type: input.part_type,
        price: input.price,
        stock_quantity: input.stock_quantity,
        warranty_months: input.warranty_months,
        return_days: input.return_days,
        slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now(),
      })
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    revalidatePath('/parts')
    return { success: true, data }
  }, { success: false, error: 'Failed to create part' })
}
