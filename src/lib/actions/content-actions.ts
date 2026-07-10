'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPublishedPage(slug: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('content_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data || null
}

export async function getAllPages() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('content_pages')
    .select('*')
    .order('created_at', { ascending: false })
  return (data as any[]) || []
}

export async function getPage(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('content_pages')
    .select('*')
    .eq('id', id)
    .single()
  return data || null
}

export async function createPage(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const slug = formData.get('slug') as string
  const title = formData.get('title') as string
  const title_ar = formData.get('title_ar') as string
  const content = formData.get('content') as string
  const content_ar = formData.get('content_ar') as string

  if (!slug || !title || !content) return { success: false, error: 'Slug, title, and content required' }

  const { error } = await (supabase as any)
    .from('content_pages')
    .insert({ slug, title, title_ar, content, content_ar, is_published: true })

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function updatePage(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const slug = formData.get('slug') as string
  const title = formData.get('title') as string
  const title_ar = formData.get('title_ar') as string
  const content = formData.get('content') as string
  const content_ar = formData.get('content_ar') as string
  const is_published = formData.get('is_published') === 'true'

  const { error } = await (supabase as any)
    .from('content_pages')
    .update({ slug, title, title_ar, content, content_ar, is_published, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/content')
  revalidatePath(`/pages/${slug}`)
  return { success: true }
}

export async function deletePage(id: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any)
    .from('content_pages')
    .delete()
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function getActiveBanners() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('homepage_banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return (data as any[]) || []
}

export async function getAllBanners() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('homepage_banners')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data as any[]) || []
}

export async function createBanner(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const title = formData.get('title') as string
  const title_ar = formData.get('title_ar') as string
  const image_url = formData.get('image_url') as string

  if (!title || !image_url) return { success: false, error: 'Title and image required' }

  const { error } = await (supabase as any)
    .from('homepage_banners')
    .insert({
      title, title_ar,
      subtitle: formData.get('subtitle'),
      subtitle_ar: formData.get('subtitle_ar'),
      image_url,
      link_url: formData.get('link_url'),
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    })

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}

export async function deleteBanner(id: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any)
    .from('homepage_banners')
    .delete()
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/content')
  return { success: true }
}
