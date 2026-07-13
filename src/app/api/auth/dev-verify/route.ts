import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { normalizeSaudiPhone } from '@/lib/auth/phone-utils'
import { DEV_OTP } from '@/constants'
import crypto from 'crypto'

const DEV_COOKIE_NAME = 'roin_dev_session'
const DEV_COOKIE_SECRET = process.env.DEV_SESSION_SECRET || 'roin-dev-default-secret'

function signSession(payload: object): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', DEV_COOKIE_SECRET).update(encoded).digest('hex')
  return `${encoded}.${sig}`
}

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    if (code !== DEV_OTP) {
      return NextResponse.json({ success: false, error: 'otp_invalid' }, { status: 400 })
    }

    const normalized = normalizeSaudiPhone(phone)
    if (!normalized) {
      return NextResponse.json({ success: false, error: 'phone_invalid' }, { status: 400 })
    }

    const phoneWithCode = `+966${normalized}`
    const phoneNoPlus = `966${normalized}`
    const adminClient = getAdminClient()

    const { data: { users } } = await adminClient.auth.admin.listUsers()
    let user = users?.find((u: any) => u.phone === phoneWithCode || u.phone === phoneNoPlus)

    if (!user) {
      const { data, error } = await adminClient.auth.admin.createUser({
        phone: phoneWithCode,
        phone_confirm: true,
      })
      if (error) throw error
      user = data.user
    }

    await ensureDevProfile(adminClient, user.id, normalized)

    // Always set dev session cookie — this is the auth mechanism in dev mode
    const sessionToken = signSession({
      sub: user.id,
      phone: normalized,
      exp: Math.floor(Date.now() / 1000) + 86400 * 7,
    })

    const response = NextResponse.json({
      success: true,
      data: { user: { id: user.id, phone: normalized } },
    })

    response.cookies.set(DEV_COOKIE_NAME, sessionToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 * 7,
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

async function ensureDevProfile(adminClient: any, userId: string, phone: string) {
  const { data: existing } = await adminClient
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single()

  if (!existing) {
    const { error } = await adminClient.from('profiles').insert({
      id: userId,
      phone,
      locale: 'ar',
      is_active: true,
    })
    if (error) {
      console.error('[dev-verify] Failed to create profile:', error.message)
    }
  }
}
