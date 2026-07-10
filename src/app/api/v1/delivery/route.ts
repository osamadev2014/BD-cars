import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success } from '@/lib/api-response'
import { getAuthUser, handleApiError, requireUser } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getAuthUser(supabase, request)
    const blocked = requireUser(user)
    if (blocked) return blocked

    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section') || 'orders'
    const status = searchParams.get('status')

    if (section === 'addresses') {
      const { data } = await (supabase as any)
        .from('delivery_addresses')
        .select('*, city:cities(id, name, name_ar)')
        .eq('user_id', user!.id)
        .order('is_default', { ascending: false })

      return success(data || [])
    }

    let query = (supabase as any)
      .from('delivery_orders')
      .select('*, provider:delivery_providers(id, name, name_ar), method:delivery_methods(id, name, name_ar), delivery_address:delivery_addresses!delivery_address_id(*, city:cities(id, name, name_ar))')
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data } = await query.limit(50)
    return success(data || [])
  } catch (err) { return handleApiError(err) }
}
