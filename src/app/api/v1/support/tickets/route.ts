import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success, error } from '@/lib/api-response'
import { getAuthUser, handleApiError, badRequest, parsePagination } from '@/lib/api-helpers'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getAuthUser(supabase, req)
    if (!user) return error('Unauthorized', 401)

    const { searchParams } = new URL(req.url)
    const { page, perPage, offset } = parsePagination(searchParams)
    const status = searchParams.get('status')

    let query = (supabase as any)
      .from('support_tickets')
      .select('*, messages:ticket_messages(count)', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data, count } = await query.range(offset, offset + perPage - 1)
    return success({
      tickets: data || [],
      pagination: { page, perPage, total: count || 0, totalPages: Math.ceil((count || 0) / perPage) },
    })
  } catch (err) { return handleApiError(err) }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getAuthUser(supabase, req)
    if (!user) return error('Unauthorized', 401)

    const body = await req.json()
    const { subject, category, message } = body

    if (!subject || !message) return badRequest('Subject and message required')

    const { data: ticket, error: ticketErr } = await (supabase as any)
      .from('support_tickets')
      .insert({ user_id: user.id, subject, category: category || 'general', priority: 'normal' })
      .select()
      .single()

    if (ticketErr) return error(ticketErr.message, 500)

    const { error: msgErr } = await (supabase as any)
      .from('ticket_messages')
      .insert({ ticket_id: ticket.id, sender_id: user.id, content: message })

    if (msgErr) return error(msgErr.message, 500)

    return success(ticket, 201)
  } catch (err) { return handleApiError(err) }
}
