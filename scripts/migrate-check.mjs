/**
 * Migration status checker.
 * Reports which old entity records still lack org_id (need migration).
 *
 * Usage: node scripts/migrate-check.mjs
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const sb = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const TABLES = [
  { table: 'dealers', label: 'Car Dealers', orgType: 'car_dealer' },
  { table: 'inspection_centers', label: 'Inspection Centers', orgType: 'inspection_center' },
  { table: 'finance_partners', label: 'Finance Partners', orgType: 'finance_company' },
  { table: 'insurance_partners', label: 'Insurance Partners', orgType: 'insurance_company' },
  { table: 'advertisers', label: 'Advertisers', orgType: 'advertising_marketing_company' },
  { table: 'spare_part_suppliers', label: 'Spare Part Suppliers', orgType: 'spare_parts_supplier' },
  { table: 'delivery_providers', label: 'Delivery Providers', orgType: 'product_shipping_company' },
]

async function main() {
  console.log('=== Migration Status Check ===\n')

  let totalUnmigrated = 0
  let totalOrgCount = 0
  let totalMemberCount = 0

  for (const { table, label, orgType } of TABLES) {
    const { count: total, error: totalErr } = await sb
      .from(table)
      .select('*', { count: 'exact', head: true })

    const { count: migrated, error: migErr } = await sb
      .from(table)
      .select('*', { count: 'exact', head: true })
      .not('org_id', 'is', null)

    const unmigrated = (total || 0) - (migrated || 0)
    totalUnmigrated += unmigrated

    const { count: orgs } = await sb
      .from('organizations')
      .select('*', { count: 'exact', head: true })
      .eq('org_type', orgType)

    totalOrgCount += orgs || 0

    console.log(`${label} (${orgType})`)
    console.log(`  Records:      ${total || 0}`)
    console.log(`  Migrated:     ${migrated || 0}`)
    console.log(`  Unmigrated:   ${unmigrated}`)
    console.log(`  Orgs created: ${orgs || 0}`)
    console.log('')
  }

  // Member count
  const { count: members } = await sb
    .from('organization_members')
    .select('*', { count: 'exact', head: true })
  totalMemberCount = members || 0

  console.log(`Total unmigrated entity records: ${totalUnmigrated}`)
  console.log(`Total organizations created:       ${totalOrgCount}`)
  console.log(`Total organization members:        ${totalMemberCount}`)
  console.log('')

  if (totalUnmigrated > 0) {
    console.log('⚠️  Some records still need migration. Run: npm run migrate:entities')
  } else {
    console.log('✅ All entity records are migrated.')
  }
}

main().catch(console.error)
