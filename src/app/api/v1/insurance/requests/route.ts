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
    const { listing_id, partner_id, vehicle_price, insurance_type } = body

    if (!listing_id || !partner_id) return badRequest('listing_id and partner_id required')

    const { data, error: insertError } = await (supabase as any)
      .from('insurance_requests')
      .insert({
        listing_id,
        customer_id: user!.id,
        partner_id,
        vehicle_price: vehicle_price || null,
        insurance_type: insurance_type || 'comprehensive',
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
      .from('insurance_requests')
      .select('*, partner:insurance_partners(id, name, name_ar, logo_url)')
      .eq('customer_id', user!.id)
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data } = await query
    return success(data || [])
  } catch (err) { return handleApiError(err) }
}
