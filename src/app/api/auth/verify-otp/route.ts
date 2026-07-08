import { NextRequest, NextResponse } from 'next/server'
import { verifyOtp } from '@/lib/auth/otp-service'
import { normalizeSaudiPhone } from '@/lib/auth/phone-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, code } = body

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'phone_required' },
        { status: 400 }
      )
    }

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'otp_required' },
        { status: 400 }
      )
    }

    const normalized = normalizeSaudiPhone(phone)
    if (!normalized) {
      return NextResponse.json(
        { success: false, error: 'phone_invalid' },
        { status: 400 }
      )
    }

    const result = await verifyOtp(normalized, code)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
