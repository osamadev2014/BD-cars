import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success, error } from '@/lib/api-response'
import { getAuthUser, handleApiError, requireUser, badRequest } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getAuthUser(supabase, request)
    const blocked = requireUser(user)
    if (blocked) return blocked

    const body = await request.json()
    const { label, city_id, address, address_ar, phone, is_default } = body

    if (!city_id || !address) return badRequest('City and address are required')

    if (is_default) {
      await (supabase as any)
        .from('delivery_addresses')
        .update({ is_default: false })
        .eq('user_id', user!.id)
    }

    const { data, error: insertError } = await (supabase as any)
      .from('delivery_addresses')
      .insert({
        user_id: user!.id,
        label,
        city_id,
        address,
        address_ar,
        phone,
        is_default: is_default || false,
      })
      .select()
      .single()

    if (insertError) return error(insertError.message, 500)
    return success(data, 201)
  } catch (err) { return handleApiError(err) }
}
