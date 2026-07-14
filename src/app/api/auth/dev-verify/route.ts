import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { normalizeSaudiPhone } from '@/lib/auth/phone-utils'
import { DEV_OTP, DEV_DEMO_PHONE } from '@/constants'
import crypto from 'crypto'

const DEV_COOKIE_NAME = 'roin_dev_session'
const DEV_COOKIE_SECRET = process.env.DEV_SESSION_SECRET || 'roin-dev-default-secret'

const DEMO_ORGS: { type: string; name: string; name_ar: string; slug: string }[] = [
  { type: 'car_dealer', name: 'Car Dealer', name_ar: 'معرض سيارات', slug: 'demo-car-dealer' },
  { type: 'inspection_center', name: 'Inspection Center', name_ar: 'مركز فحص', slug: 'demo-inspection' },
  { type: 'wholesale_vehicle_trader', name: 'Wholesale Vehicle Trader', name_ar: 'تاجر سيارات بالجملة', slug: 'demo-wholesale' },
  { type: 'spare_parts_supplier', name: 'Spare Parts Supplier', name_ar: 'مورد قطع غيار', slug: 'demo-spare-parts' },
  { type: 'finance_company', name: 'Finance Company', name_ar: 'شركة تمويل', slug: 'demo-finance' },
  { type: 'insurance_company', name: 'Insurance Company', name_ar: 'شركة تأمين', slug: 'demo-insurance' },
  { type: 'advertising_marketing_company', name: 'Advertising & Marketing', name_ar: 'شركة إعلانات وتسويق', slug: 'demo-advertising' },
  { type: 'car_rental_company', name: 'Car Rental Company', name_ar: 'شركة تأجير سيارات', slug: 'demo-car-rental' },
  { type: 'product_shipping_company', name: 'Product Shipping Company', name_ar: 'شركة شحن', slug: 'demo-shipping' },
  { type: 'vehicle_transport_company', name: 'Vehicle Transport Company', name_ar: 'شركة نقل سيارات', slug: 'demo-vehicle-transport' },
]

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
    await ensureDevOrganizations(adminClient, user.id, normalized).catch((e: any) =>
      console.error('[dev-verify] ensureDevOrganizations error:', e.message)
    )

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
    console.error('[dev-verify] Error:', error.message, error.stack)
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

async function ensureDevOrganizations(adminClient: any, userId: string, phone: string) {
  const demoPhone = normalizeSaudiPhone(DEV_DEMO_PHONE)
  if (phone !== demoPhone) return

  const { data: existing } = await adminClient
    .from('organization_members')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (existing && existing.length > 0) return

  for (const org of DEMO_ORGS) {
    const { data: newOrg, error: orgError } = await adminClient
      .from('organizations')
      .insert({
        org_type: org.type,
        name: org.name,
        name_ar: org.name_ar,
        slug: org.slug,
        status: 'active',
        is_active: true,
        created_by: userId,
      })
      .select('id')
      .single()

    if (orgError) {
      console.error(`[dev-verify] Failed to create org ${org.type}:`, orgError.message)
      continue
    }

    const { error: memberError } = await adminClient
      .from('organization_members')
      .insert({
        organization_id: newOrg.id,
        user_id: userId,
        role: 'owner',
        status: 'active',
        is_active: true,
        created_by: userId,
      })

    if (memberError) {
      console.error(`[dev-verify] Failed to create membership for ${org.type}:`, memberError.message)
    }
  }

  console.log(`[dev-verify] Created ${DEMO_ORGS.length} demo organizations for ${phone}`)
}
