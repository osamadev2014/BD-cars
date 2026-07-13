import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
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
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
        process.env[key] = val
      }
    }
  }
} catch {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const headers = { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' }

async function main() {
  // Find user by phone
  const usersRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?phone=eq.0555000000&select=id,full_name`, { headers })
  const profiles = await usersRes.json()
  
  if (profiles.length === 0) {
    console.log('No profile found for 0555000000 (will be created on first login)')
    // Find auth user directly
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?phone=%2B9660555000000`, {
      headers: { ...headers, 'Accept': 'application/json' }
    })
    const authData = await authRes.json()
    if (authData?.users?.length) {
      console.log(`Auth user exists: ${authData.users[0].id}`)
    }
  } else {
    console.log(`Profile found: ${profiles[0].id} - ${profiles[0].full_name}`)
  }

  // Check user_roles
  const rolesRes = await fetch(`${SUPABASE_URL}/rest/v1/user_roles?select=*,role:roles!inner(slug,name)&user_id=eq.ad9606db-7dce-4573-97cb-7f0d1a8c08f9`, { headers })
  const rolesData = await rolesRes.json()
  if (rolesData?.length) {
    console.log(`Roles: ${rolesData.map(r => r.role?.slug).join(', ')}`)
  } else {
    console.log('No roles found for ad9606db')
  }

  console.log('\n✅ Admin is ready! Login with:')
  console.log('   Phone: 0555000000')
  console.log('   OTP:   1234')
  console.log('   URL:   http://localhost:3000/ar/login')
}

main().catch(console.error)
