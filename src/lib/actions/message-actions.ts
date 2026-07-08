'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/server/guards'
import { revalidatePath } from 'next/cache'

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export async function getUserConversations() {
  const user = await requireAuth()
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('conversation_participants')
      .select(`
        conversation_id,
        last_read_at,
        conversations!inner(
          id,
          subject,
          listing_id,
          updated_at,
          vehicle_listings!listing_id(
            title,
            title_ar,
            slug
          )
        )
      `)
      .eq('user_id', user.userId)
      .order('conversations(updated_at)', { ascending: false })
    return data || []
  }, [])
}

export async function getConversation(conversationId: string) {
  const user = await requireAuth()
  if (!user.allowed) return null
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data: conv } = await (supabase as any)
      .from('conversations')
      .select(`
        *,
        vehicle_listings!listing_id(title, title_ar, slug),
        conversation_participants(
          user_id,
          user:profiles!user_id(id, name, avatar_url)
        )
      `)
      .eq('id', conversationId)
      .single()
    if (!conv) return null

    const isParticipant = conv.conversation_participants?.some((p: any) => p.user_id === user.userId)
    if (!isParticipant) return null

    const { count } = await (supabase as any)
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.userId)
      .is('is_deleted', false)

    const participant = conv.conversation_participants?.find((p: any) => p.user_id !== user.userId)
    return { ...conv, unread_count: count || 0, other_participant: participant }
  }, null)
}

export async function getMessages(conversationId: string) {
  const user = await requireAuth()
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
    return data || []
  }, [])
}

export async function sendMessage(conversationId: string, content: string) {
  const user = await requireAuth()
  if (!content?.trim()) return { success: false, error: 'Message is required' } as const

  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data: msg, error } = await (supabase as any)
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: user.userId, content: content.trim() })
      .select()
      .single()

    if (error) return { success: false, error: error.message } as const

    await (supabase as any)
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    revalidatePath('/dashboard/messages')
    return { success: true, data: msg } as const
  }, { success: false, error: 'Failed to send message' } as const)
}

export async function startConversation(params: { listingId: string; content: string; subject?: string }) {
  const user = await requireAuth()
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    const { data: listing } = await (supabase as any)
      .from('vehicle_listings')
      .select('id, user_id, title, title_ar, slug')
      .eq('id', params.listingId)
      .single()
    if (!listing) return { success: false, error: 'Listing not found' } as const
    if (listing.user_id === user.userId) return { success: false, error: 'Cannot message yourself' } as const

    const { data: existing } = await (supabase as any)
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.userId)
    const convIds = existing?.map((e: any) => e.conversation_id) || []

    const { data: match } = await (supabase as any)
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', listing.user_id)
      .in('conversation_id', convIds)
      .maybeSingle()

    if (match) {
      await (supabase as any)
        .from('messages')
        .insert({ conversation_id: match.conversation_id, sender_id: user.userId, content: params.content.trim() })
      return { success: true, conversation_id: match.conversation_id } as const
    }

    const { data: conv, error } = await (supabase as any)
      .from('conversations')
      .insert({ listing_id: params.listingId, subject: params.subject })
      .select()
      .single()
    if (error || !conv) return { success: false, error: error?.message } as const

    await (supabase as any).from('conversation_participants').insert([
      { conversation_id: conv.id, user_id: user.userId },
      { conversation_id: conv.id, user_id: listing.user_id },
    ])

    await (supabase as any).from('messages').insert({
      conversation_id: conv.id,
      sender_id: user.userId,
      content: params.content.trim(),
    })

    revalidatePath('/dashboard/messages')
    return { success: true, conversation_id: conv.id } as const
  }, { success: false, error: 'Failed to start conversation' } as const)
}

export async function markConversationRead(conversationId: string) {
  const user = await requireAuth()
  return safeDb(async () => {
    const supabase = await createServerSupabaseClient()
    await (supabase as any)
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.userId)
    return { success: true }
  }, { success: false })
}
