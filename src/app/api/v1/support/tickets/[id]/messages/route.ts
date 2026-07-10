import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success, error } from '@/lib/api-response'
import { getAuthUser, handleApiError, badRequest } from '@/lib/api-helpers'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const user = await getAuthUser(supabase, req)
    if (!user) return error('Unauthorized', 401)

    const body = await req.json()
    const { content } = body
    if (!content) return badRequest('Content required')

    const { data: msg, error: msgErr } = await (supabase as any)
      .from('ticket_messages')
      .insert({ ticket_id: id, sender_id: user.id, content })
      .select()
      .single()

    if (msgErr) return error(msgErr.message, 500)

    await (supabase as any)
      .from('support_tickets')
      .update({ status: 'open', updated_at: new Date().toISOString() })
      .eq('id', id)

    return success(msg, 201)
  } catch (err) { return handleApiError(err) }
}
