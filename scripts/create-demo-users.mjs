#!/usr/bin/env node
// =============================================
// Ryon - Create Demo Users
// =============================================
// Creates demo users for local development.
// Auth users via Supabase Admin API.
// Profiles + roles via direct SQL through Docker (bypasses RLS).
//
// Run: node scripts/create-demo-users.mjs
// Or: npm run seed:users

import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function loadEnv() {
  const envPath = join(rootDir, '.env.local');
  const env = {};
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  return env;
}

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
}

function dockerExec(cmd) {
  return execSync(`docker exec supabase_db_ryon-local ${cmd}`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

function runSqlViaDocker(sql) {
  const tmpFile = join(rootDir, '.tmp-seed.sql');
  writeFileSync(tmpFile, sql, 'utf-8');
  try {
    execSync(`docker cp "${tmpFile}" supabase_db_ryon-local:/tmp/seed.sql`, { stdio: 'pipe' });
    return dockerExec('psql -U postgres -d postgres -f /tmp/seed.sql');
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

async function main() {
  console.log('\n👥  Creating demo users...\n');

  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey || serviceKey.includes('PLACEHOLDER')) {
    console.error('\n❌  Supabase is not running or keys are not configured.');
    console.error('   Run `npm run setup` first.\n');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const users = [
    { phone: '+966555000001', full_name: 'Admin User', role: 'super_admin' },
    { phone: '+966555000002', full_name: 'Dealer User', role: 'dealer_owner' },
    { phone: '+966555000003', full_name: 'Customer User', role: 'customer' },
    { phone: '+966555000004', full_name: 'Inspection Manager', role: 'inspection_manager' },
    { phone: '+966555000005', full_name: 'Content Manager', role: 'content_manager' },
  ];

  const created = [];

  for (const userData of users) {
    try {
      const { data: { users: existingUsers } } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.find((u) => u.phone === userData.phone);

      if (existing) {
        created.push({ ...userData, userId: existing.id });
        log('ℹ️  ', `User ${userData.phone} already exists (${existing.id.slice(0, 8)}...)`);
        continue;
      }

      const { data, error } = await supabase.auth.admin.createUser({
        phone: userData.phone,
        phone_confirm: true,
        user_metadata: { full_name: userData.full_name },
      });

      if (error) {
        log('❌', `Failed to create ${userData.phone}: ${error.message}`);
        continue;
      }

      created.push({ ...userData, userId: data.user.id });
      log('✅', `Created user: ${userData.full_name} (${userData.phone})`);
    } catch (e) {
      log('❌', `Error creating user ${userData.phone}: ${e.message}`);
    }
  }

  if (created.length === 0) {
    console.error('\n❌  No users found or created. Aborting.\n');
    process.exit(1);
  }

  console.log('\n🔧  Inserting profiles + roles via SQL (bypasses RLS)...\n');

  const profileRows = created.map((u) => {
    const phone = u.phone.replace('+966', '');
    return `('${u.userId}', '${phone}', '${u.full_name.replace(/'/g, "''")}', 'ar', true)`;
  }).join(', ');

  const roleInserts = created.map((u) => {
    return `INSERT INTO user_roles (user_id, role_id)
SELECT '${u.userId}', id FROM roles WHERE slug = '${u.role}' LIMIT 1
ON CONFLICT (user_id, role_id) DO NOTHING;`;
  }).join('\n');

  const sql = `
INSERT INTO profiles (id, phone, full_name, locale, is_active)
VALUES ${profileRows}
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  locale = EXCLUDED.locale,
  is_active = EXCLUDED.is_active;

${roleInserts}

SELECT 'profiles' as t, count(*) as cnt FROM profiles
UNION ALL
SELECT 'user_roles', count(*) FROM user_roles;
`;

  try {
    runSqlViaDocker(sql);
    log('✅', 'Profiles + roles inserted successfully');
  } catch (e) {
    log('❌', `SQL error: ${e.message}`);
  }

  // Verify
  try {
    const result = dockerExec(
      `psql -U postgres -d postgres -c "SELECT p.full_name, au.phone, r.slug as role FROM profiles p JOIN auth.users au ON au.id = p.id JOIN user_roles ur ON ur.user_id = au.id JOIN roles r ON r.id = ur.role_id ORDER BY au.phone"`
    );
    console.log('\n' + result);
  } catch {}

  console.log('='.repeat(60));
  console.log('📋  Demo Users Summary');
  console.log('='.repeat(60));
  console.log('\n  Phone          Name                 Role\n  ' + '-'.repeat(55));

  for (const u of created) {
    const phone = u.phone.replace('+966', '0');
    console.log(`  ${phone.padEnd(15)} ${u.full_name.padEnd(20)} ${u.role}`);
  }

  console.log('\n  📌  Login with any phone + OTP: 1234');
  console.log('  📌  Example: 0555000001 / 1234 (Admin)');
  console.log('  📌  Example: 0555000002 / 1234 (Dealer)');
  console.log('  📌  Example: 0555000003 / 1234 (Customer)\n');
}

main().catch((e) => {
  console.error('\n❌  Fatal error:', e.message);
  process.exit(1);
});
