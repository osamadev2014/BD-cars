import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success, error } from '@/lib/api-response'
import { getAuthUser, handleApiError, notFound } from '@/lib/api-helpers'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const user = await getAuthUser(supabase, req)
    if (!user) return error('Unauthorized', 401)

    const { data } = await (supabase as any)
      .from('support_tickets')
      .select('*, messages:ticket_messages(*, sender:profiles!sender_id(id, full_name))')
      .eq('id', id)
      .single()

    if (!data) return notFound('Ticket not found')
    if (data.user_id !== user.id) {
      const { data: roleData } = await (supabase as any).rpc('get_user_role')
      if (roleData !== 'admin') return error('Forbidden', 403)
    }

    return success(data)
  } catch (err) { return handleApiError(err) }
}
