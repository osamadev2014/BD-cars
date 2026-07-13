import { createClient } from '@/lib/supabase/client'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { DEV_OTP, SAUDI_PHONE_REGEX, OTP_LENGTH, IS_DEV } from '@/constants'
import { normalizeSaudiPhone } from './phone-utils'

const devOtpStore = new Map<string, string>()

export interface OtpServiceResult {
  success: boolean
  error?: string
  data?: unknown
}

export interface OtpProvider {
  sendOtp(phone: string, code: string): Promise<OtpServiceResult>
}

class DevOtpProvider implements OtpProvider {
  async sendOtp(phone: string, code: string): Promise<OtpServiceResult> {
    console.log(`[DEV OTP] Code for ${phone}: ${code}`)
    return { success: true }
  }
}

let otpProvider: OtpProvider | null = null

function getOtpProvider(): OtpProvider {
  if (otpProvider) return otpProvider
  otpProvider = new DevOtpProvider()
  return otpProvider
}

export async function sendOtp(phone: string): Promise<OtpServiceResult> {
  const normalized = normalizeSaudiPhone(phone)
  if (!normalized || !SAUDI_PHONE_REGEX.test(normalized)) {
    return { success: false, error: 'phone_invalid' }
  }

  const useDev = IS_DEV || !!DEV_OTP
  const code = useDev ? DEV_OTP : generateOtp()
  const provider = getOtpProvider()
  const result = await provider.sendOtp(normalized, code)

  if (!result.success) {
    return result
  }

  if (!useDev) {
    const supabase = createClient() as any
    const { error: signInError } = await supabase.auth.signInWithOtp({
      phone: `+966${normalized}`,
      options: { data: { otp: code } },
    })

    if (signInError) {
      return { success: false, error: 'Could not send verification code' }
    }
  }

  await logLoginEvent(normalized, 'otp_sent')

  return { success: true, data: { phone: normalized } }
}

export async function verifyOtp(
  phone: string,
  code: string
): Promise<OtpServiceResult> {
  const normalized = normalizeSaudiPhone(phone)
  if (!normalized) {
    return { success: false, error: 'phone_invalid' }
  }

  if (code.length !== OTP_LENGTH) {
    return { success: false, error: 'otp_length' }
  }

  const useDev = IS_DEV || !!DEV_OTP

  if (useDev) {
    if (code !== DEV_OTP) {
      await logLoginEvent(normalized, 'otp_verify_failed')
      return { success: false, error: 'otp_invalid' }
    }

    const res = await fetch('/api/auth/dev-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: normalized, code }),
    })

    if (!res.ok) {
      await logLoginEvent(normalized, 'otp_verify_failed')
      return { success: false, error: 'otp_invalid' }
    }

    const data = await res.json()
    if (!data.success) {
      await logLoginEvent(normalized, 'otp_verify_failed')
      return { success: false, error: 'otp_invalid' }
    }

    await logLoginEvent(normalized, 'otp_verified', data.data?.user?.id)

    return {
      success: true,
      data: { user: data.data?.user, session: null },
    }
  }

  const supabase = createClient() as any
  const { data, error } = await supabase.auth.verifyOtp({
    phone: `+966${normalized}`,
    token: code,
    type: 'sms',
  })

  if (error) {
    await logLoginEvent(normalized, 'otp_verify_failed')
    return { success: false, error: 'otp_invalid' }
  }

  await ensureProfile(data.user)
  await logLoginEvent(normalized, 'otp_verified', data.user?.id)

  return { success: true, data: { user: data.user, session: data.session } }
}

export async function resendOtp(phone: string): Promise<OtpServiceResult> {
  return sendOtp(phone)
}

async function ensureProfile(authUser: { id: string; phone?: string } | null) {
  if (!authUser) return

  const adminClient = getAdminClient() as any
  const { data: existing } = await adminClient
    .from('profiles')
    .select('id')
    .eq('id', authUser.id)
    .single()

  if (!existing) {
    const profilePhone = authUser.phone?.replace('+966', '')
    await adminClient.from('profiles').insert({
      id: authUser.id,
      phone: profilePhone || '',
      locale: 'ar',
      is_active: true,
    })
  }
}

async function logLoginEvent(
  phone: string,
  eventType: string,
  userId?: string
) {
  try {
    const adminClient = getAdminClient() as any
    await adminClient.from('login_events').insert({
      user_id: userId || null,
      phone,
      event_type: eventType,
      ip_address: null,
      user_agent: null,
    })
  } catch {
    // Non-critical
  }
}

function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function oauthSignOut(): Promise<OtpServiceResult> {
  const supabase = createClient() as any
  const { error } = await supabase.auth.signOut()
  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}
