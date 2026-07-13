// Creates a super admin user, assigns role, and prints login info
// Uses raw REST API (like seed-supabase.mjs) to avoid WebSocket issue
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
const envPath = resolve(__dirname, '..', '.env.local')
try {
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim()
        let val = trimmed.slice(eqIdx + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        process.env[key] = val
      }
    }
  }
} catch { /* fallback */ }

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing Supabase URL or SERVICE_ROLE_KEY')
  process.exit(1)
}

const headers = { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }

async function api(table, method = 'GET', body = null, params = '') {
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  const url = `${SUPABASE_URL}/rest/v1/${table}${params ? '?' + params : ''}`
  const res = await fetch(url, opts)
  if (!res.ok) { const t = await res.text(); throw new Error(`${method} ${table}: ${res.status} ${t}`) }
  if (res.status === 204) return null
  return res.json()
}

async function authApi(endpoint, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
    method: 'POST',
    headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) { const t = await res.text(); throw new Error(`Auth ${endpoint}: ${res.status} ${t}`) }
  return res.json()
}

async function main() {
  const ADMIN_PHONE = '0555000000'
  const ADMIN_NAME = 'مدير النظام'
  const ADMIN_NAME_EN = 'System Admin'

  // 1. Check if user profile already exists
  let existing = null
  try {
    const data = await api('profiles', 'GET', null, `phone=eq.${ADMIN_PHONE}&select=id&limit=1`)
    existing = data?.[0]
  } catch { /* ignore */ }

  let userId

  if (existing) {
    console.log(`User ${ADMIN_PHONE} already exists (${existing.id})`)
    userId = existing.id
  } else {
    // 2. Create auth user via Supabase Auth admin API
    console.log(`Creating auth user: +966${ADMIN_PHONE}...`)
    const userData = await authApi('admin/users', {
      phone: `+966${ADMIN_PHONE}`,
      phone_confirm: true,
      user_metadata: { full_name: ADMIN_NAME, full_name_en: ADMIN_NAME_EN },
    })
    userId = userData.id
    console.log(`Created auth user: ${userId}`)

    // 3. Create profile
    try {
      await api('profiles', 'POST', { id: userId, phone: ADMIN_PHONE, full_name: ADMIN_NAME })
      console.log('Profile created')
    } catch (e) {
      console.log(`Profile note: ${e.message}`)
    }
  }

  if (!userId) { console.error('No user ID'); process.exit(1) }

  // 4. Get super_admin role ID
  let roleData
  try {
    const data = await api('roles', 'GET', null, 'slug=eq.super_admin&select=id&limit=1')
    roleData = data?.[0]
  } catch {}
  if (!roleData) { console.error('super_admin role not found. Run migrations.'); process.exit(1) }

  // 5. Assign super_admin role
  try {
    await api('user_roles', 'POST', { user_id: userId, role_id: roleData.id })
    console.log('Super admin role assigned')
  } catch (e) {
    if (e.message?.includes('duplicate')) { console.log('Role already assigned') }
    else { console.error(`Role error: ${e.message}`) }
  }

  console.log('\n========================================')
  console.log('  ✅ Admin account ready!')
  console.log('========================================')
  console.log(`  Phone:    ${ADMIN_PHONE}`)
  console.log(`  OTP:      1234`)
  console.log(`  Login:    /ar/login`)
  console.log('========================================')
  console.log('1. Open http://localhost:3000/ar/login')
  console.log('2. Enter phone: 0555000000')
  console.log('3. Enter OTP:   1234')
  console.log('4. Go to /ar/admin to see admin panel')
  console.log('========================================\n')
}

main().catch(console.error)
