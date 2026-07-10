import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success, error } from '@/lib/api-response'
import { corsHeaders, handleApiError } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const supabase = (await createServerSupabaseClient()) as any

    const { data } = await supabase
      .from('ad_placements')
      .select(`
        *,
        campaigns:ad_campaigns(
          id, name, type, status, budget, spent,
          advertiser:advertisers(name, name_ar, logo_url)
        )
      `)
      .eq('is_active', true)
      .order('name', { ascending: true })

    const origin = request.headers.get('origin')
    return success({ placements: data || [] }, 200)
  } catch (err) { return handleApiError(err) }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new Response(null, { headers: corsHeaders(origin) })
}
