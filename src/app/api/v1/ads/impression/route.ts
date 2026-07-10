import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success, error } from '@/lib/api-response'
import { corsHeaders, handleApiError } from '@/lib/api-helpers'
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateCheck = checkRateLimit(`ad_impression:${ip}`, { windowMs: 10000, maxRequests: 10 })

    if (!rateCheck.allowed) {
      return error('Rate limit exceeded', 429)
    }

    const body = await request.json()
    const { campaign_id } = body

    if (!campaign_id) {
      return error('campaign_id is required', 400)
    }

    const supabase = (await createServerSupabaseClient()) as any
    const userAgent = request.headers.get('user-agent')

    const { error: insertError } = await supabase
      .from('ad_impressions')
      .insert({
        campaign_id,
        ip_address: ip,
        user_agent: userAgent,
      })

    if (insertError) throw insertError

    const origin = request.headers.get('origin')
    return success({ recorded: true }, 201)
  } catch (err) { return handleApiError(err) }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new Response(null, { headers: corsHeaders(origin) })
}
