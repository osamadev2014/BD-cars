import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success, error } from '@/lib/api-response'
import { getAuthUser, handleApiError, badRequest } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getAuthUser(supabase, req)
    if (!user) return error('Unauthorized', 401)

    const body = await req.json()
    const { subscription } = body

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return badRequest('Invalid subscription: endpoint, p256dh, and auth are required')
    }

    const userAgent = req.headers.get('user-agent') || null

    const { error: insertErr } = await (supabase as any)
      .from('push_subscriptions')
      .upsert(
        {
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth_key: subscription.keys.auth,
          user_agent: userAgent,
        },
        { onConflict: 'user_id,endpoint' }
      )

    if (insertErr) return error(insertErr.message, 500)

    return success({ message: 'Push subscription registered' }, 201)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getAuthUser(supabase, req)
    if (!user) return error('Unauthorized', 401)

    const body = await req.json()
    const { endpoint } = body

    if (!endpoint) return badRequest('Endpoint is required')

    const { error: delErr } = await (supabase as any)
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('endpoint', endpoint)

    if (delErr) return error(delErr.message, 500)

    return success({ message: 'Push subscription removed' })
  } catch (err) {
    return handleApiError(err)
  }
}
