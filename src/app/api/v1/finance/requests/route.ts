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
    const { listing_id, partner_id, vehicle_price, down_payment } = body

    if (!listing_id || !partner_id) return badRequest('listing_id and partner_id required')

    const requestedAmount = vehicle_price - (down_payment || 0)

    const { data, error: insertError } = await (supabase as any)
      .from('finance_requests')
      .insert({
        listing_id,
        customer_id: user!.id,
        partner_id,
        vehicle_price,
        down_payment: down_payment || 0,
        requested_amount: requestedAmount,
      })
      .select()
      .single()

    if (insertError) return error(insertError.message, 500)
    return success(data, 201)
  } catch (err) { return handleApiError(err) }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getAuthUser(supabase, request)
    const blocked = requireUser(user)
    if (blocked) return blocked

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = (supabase as any)
      .from('finance_requests')
      .select('*, partner:finance_partners(id, name, name_ar, logo_url)')
      .eq('customer_id', user!.id)
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data } = await query
    return success(data || [])
  } catch (err) { return handleApiError(err) }
}
