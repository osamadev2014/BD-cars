import { NextRequest, NextResponse } from 'next/server'
import { sendOtp } from '@/lib/auth/otp-service'
import { normalizeSaudiPhone } from '@/lib/auth/phone-utils'
import { SAUDI_PHONE_REGEX } from '@/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'phone_required' },
        { status: 400 }
      )
    }

    const normalized = normalizeSaudiPhone(phone)
    if (!normalized || !SAUDI_PHONE_REGEX.test(normalized)) {
      return NextResponse.json(
        { success: false, error: 'phone_invalid' },
        { status: 400 }
      )
    }

    const result = await sendOtp(normalized)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: { phone: normalized } })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
