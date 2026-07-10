'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMyTickets() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await (supabase as any)
    .from('support_tickets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (data as any[]) || []
}

export async function getTicket(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('support_tickets')
    .select('*, messages:ticket_messages(*, sender:profiles!sender_id(id, full_name))')
    .eq('id', id)
    .single()

  return data || null
}

export async function createTicket(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const subject = formData.get('subject') as string
  const category = formData.get('category') as string
  const message = formData.get('message') as string

  if (!subject || !message) return { success: false, error: 'Subject and message required' }

  const { data: ticket, error: ticketErr } = await (supabase as any)
    .from('support_tickets')
    .insert({ user_id: user.id, subject, category: category || 'general', priority: 'normal' })
    .select()
    .single()

  if (ticketErr) return { success: false, error: ticketErr.message }

  const { error: msgErr } = await (supabase as any)
    .from('ticket_messages')
    .insert({ ticket_id: ticket.id, sender_id: user.id, content: message })

  if (msgErr) return { success: false, error: msgErr.message }

  revalidatePath('/dashboard/tickets')
  return { success: true, ticket_id: ticket.id }
}

export async function addTicketMessage(ticketId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const content = formData.get('content') as string
  if (!content) return { success: false, error: 'Message required' }

  const { error } = await (supabase as any)
    .from('ticket_messages')
    .insert({ ticket_id: ticketId, sender_id: user.id, content })

  if (error) return { success: false, error: error.message }

  await (supabase as any)
    .from('support_tickets')
    .update({ status: 'open', updated_at: new Date().toISOString() })
    .eq('id', ticketId)

  revalidatePath(`/dashboard/tickets/${ticketId}`)
  return { success: true }
}

export async function getAllTickets() {
  const supabase = await createServerSupabaseClient()
  const { data } = await (supabase as any)
    .from('support_tickets')
    .select('*, customer:profiles!user_id(id, full_name, phone)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (data as any[]) || []
}

export async function updateTicketStatus(ticketId: string, status: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await (supabase as any)
    .from('support_tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', ticketId)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/tickets')
  revalidatePath(`/admin/tickets/${ticketId}`)
  return { success: true }
}
