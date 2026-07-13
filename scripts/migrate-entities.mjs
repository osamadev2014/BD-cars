/**
 * Runtime entity-to-organization migration script.
 * Migrates old entity tables to the new `organizations` + `organization_members` system.
 * Idempotent — safe to run multiple times.
 *
 * Usage: node scripts/migrate-entities.mjs
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL in .env.local
 * or environment variables.
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

const ENTITY_MAP = [
  {
    table: 'dealers',
    orgType: 'car_dealer',
    usersTable: 'dealer_users',
    nameColumn: 'company_name',
    ownerColumn: 'user_id',
    columns: ['id', 'user_id', 'company_name', 'company_name_ar', 'email', 'phone', 'city', 'created_at', 'updated_at'],
  },
  {
    table: 'inspection_centers',
    orgType: 'inspection_center',
    usersTable: 'inspection_center_users',
    nameColumn: 'company_name',
    ownerColumn: 'user_id',
    columns: ['id', 'user_id', 'company_name', 'email', 'phone', 'city', 'created_at', 'updated_at'],
  },
  {
    table: 'finance_partners',
    orgType: 'finance_company',
    usersTable: 'finance_partner_users',
    nameColumn: 'name',
    ownerColumn: 'user_id',
    columns: ['id', 'user_id', 'name', 'email', 'phone', 'created_at', 'updated_at'],
  },
  {
    table: 'insurance_partners',
    orgType: 'insurance_company',
    usersTable: 'insurance_partner_users',
    nameColumn: 'company_name',
    ownerColumn: 'user_id',
    columns: ['id', 'user_id', 'company_name', 'email', 'phone', 'created_at', 'updated_at'],
  },
  {
    table: 'advertisers',
    orgType: 'advertising_marketing_company',
    usersTable: 'advertiser_users',
    nameColumn: 'company_name',
    ownerColumn: 'user_id',
    columns: ['id', 'user_id', 'company_name', 'email', 'phone', 'created_at', 'updated_at'],
  },
  {
    table: 'spare_part_suppliers',
    orgType: 'spare_parts_supplier',
    usersTable: 'spare_part_supplier_users',
    nameColumn: 'company_name',
    ownerColumn: 'user_id',
    columns: ['id', 'user_id', 'company_name', 'company_name_ar', 'email', 'phone', 'city', 'created_at', 'updated_at'],
  },
  {
    table: 'delivery_providers',
    orgType: 'product_shipping_company',
    usersTable: 'delivery_provider_users',
    nameColumn: 'company_name',
    ownerColumn: 'user_id',
    columns: ['id', 'user_id', 'company_name', 'email', 'phone', 'city', 'created_at', 'updated_at'],
  },
]

async function migrateEntities(entity) {
  console.log(`\n--- Migrating ${entity.table} → ${entity.orgType} ---`)

  // Fetch all records from old entity table
  const { data: records, error: fetchError } = await sb
    .from(entity.table)
    .select(entity.columns.join(', '))

  if (fetchError) {
    console.error(`  Error fetching ${entity.table}:`, fetchError.message)
    return { migrated: 0, skipped: 0, errors: 0 }
  }

  if (!records || records.length === 0) {
    console.log(`  No records found in ${entity.table}`)
    return { migrated: 0, skipped: 0, errors: 0 }
  }

  console.log(`  Found ${records.length} records`)

  let migrated = 0
  let skipped = 0
  let errors = 0

  for (const record of records) {
    // Check if org already exists for this entity (by checking org_id on the record)
    const { data: existingOrg } = await sb
      .from('organizations')
      .select('id')
      .eq('org_type', entity.orgType)
      .eq('email', record.email || '')
      .maybeSingle()

    if (existingOrg) {
      skipped++
      continue
    }

    // Create organization
    const name = record[entity.nameColumn] || record.company_name || `${entity.orgType}-${record.id}`
    const nameAr = record.company_name_ar || record.company_name_ar || null

    const { data: org, error: orgError } = await sb
      .from('organizations')
      .insert({
        org_type: entity.orgType,
        name: name,
        name_ar: nameAr,
        email: record.email || null,
        phone: record.phone || null,
        city: record.city || null,
        status: 'active',
        created_by: record[entity.ownerColumn] || record.user_id,
        metadata: { migrated_from: entity.table, original_id: record.id },
      })
      .select('id')
      .single()

    if (orgError || !org) {
      console.error(`  Error creating org for ${entity.table} id=${record.id}:`, orgError?.message)
      errors++
      continue
    }

    // Link the entity record to the new org
    const { error: linkError } = await sb
      .from(entity.table)
      .update({ org_id: org.id })
      .eq('id', record.id)

    if (linkError) {
      console.error(`  Error linking ${entity.table} id=${record.id} to org ${org.id}:`, linkError.message)
    }

    // Add owner as org member with admin role
    const ownerId = record[entity.ownerColumn] || record.user_id
    if (ownerId) {
      const { error: memberError } = await sb
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: ownerId,
          role: 'admin',
          status: 'active',
          added_by: ownerId,
        })
        .select('id')
        .maybeSingle()

      if (memberError) {
        console.error(`  Error adding owner member for org ${org.id}:`, memberError.message)
      }
    }

    migrated++
  }

  console.log(`  Result: ${migrated} migrated, ${skipped} skipped, ${errors} errors`)
  return { migrated, skipped, errors }
}

// Migrate members from old *__users tables
async function migrateMembers(entity) {
  if (!entity.usersTable) return { migrated: 0, skipped: 0, errors: 0 }

  console.log(`\n--- Migrating members from ${entity.usersTable} ---`)

  const { data: members, error: fetchError } = await sb
    .from(entity.usersTable)
    .select('*')

  if (fetchError) {
    console.error(`  Error fetching ${entity.usersTable}:`, fetchError.message)
    return { migrated: 0, skipped: 0, errors: 0 }
  }

  if (!members || members.length === 0) {
    console.log(`  No records in ${entity.usersTable}`)
    return { migrated: 0, skipped: 0, errors: 0 }
  }

  let migrated = 0
  let skipped = 0
  let errors = 0

  for (const member of members) {
    const entityId = member[`${entity.table.replace(/s$/, '')}_id`] || member[`${entity.table.slice(0, -1)}_id`]
    if (!entityId) { skipped++; continue }

    // Find org by the entity's org_id
    const { data: entityRecord } = await sb
      .from(entity.table)
      .select('org_id')
      .eq('id', entityId)
      .maybeSingle()

    if (!entityRecord?.org_id) { skipped++; continue }

    // Check if membership already exists
    const { data: existing } = await sb
      .from('organization_members')
      .select('id')
      .eq('organization_id', entityRecord.org_id)
      .eq('user_id', member.user_id)
      .maybeSingle()

    if (existing) { skipped++; continue }

    const { error: insertError } = await sb
      .from('organization_members')
      .insert({
        organization_id: entityRecord.org_id,
        user_id: member.user_id,
        role: member.role || 'member',
        status: member.status || 'active',
        added_by: member.added_by || null,
      })
      .select('id')
      .maybeSingle()

    if (insertError) {
      console.error(`  Error inserting member for org ${entityRecord.org_id}, user ${member.user_id}:`, insertError.message)
      errors++
    } else {
      migrated++
    }
  }

  console.log(`  Result: ${migrated} migrated, ${skipped} skipped, ${errors} errors`)
  return { migrated, skipped, errors }
}

async function main() {
  console.log('=== Runtime Entity → Organization Migration ===')
  console.log(`Target: ${supabaseUrl}`)
  console.log('')

  let totalMigrated = 0
  let totalSkipped = 0
  let totalErrors = 0

  for (const entity of ENTITY_MAP) {
    const r1 = await migrateEntities(entity)
    totalMigrated += r1.migrated
    totalSkipped += r1.skipped
    totalErrors += r1.errors

    const r2 = await migrateMembers(entity)
    totalMigrated += r2.migrated
    totalSkipped += r2.skipped
    totalErrors += r2.errors
  }

  console.log('\n=== Migration Complete ===')
  console.log(`Total: ${totalMigrated} migrated, ${totalSkipped} skipped, ${totalErrors} errors`)

  if (totalErrors > 0) process.exit(1)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
