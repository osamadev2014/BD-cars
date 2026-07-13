#!/usr/bin/env node
// =============================================
// Ryon - Create Demo Users
// =============================================
// Creates demo users for local development.
// Requires Supabase to be running locally.
//
// Run: node scripts/create-demo-users.mjs
// Or: npm run seed:users

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
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
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    env[key] = val;
  }
  return env;
}

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
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
    {
      phone: '+966555000001',
      full_name: 'Admin User',
      role: 'super_admin',
      description: 'Super Admin (full access)',
    },
    {
      phone: '+966555000002',
      full_name: 'Dealer User',
      role: 'dealer_owner',
      description: 'Dealer Owner (manage listings)',
    },
    {
      phone: '+966555000003',
      full_name: 'Customer User',
      role: 'customer',
      description: 'Regular Customer (browse & buy)',
    },
    {
      phone: '+966555000004',
      full_name: 'Inspection Manager',
      role: 'inspection_manager',
      description: 'Inspection Center Manager',
    },
    {
      phone: '+966555000005',
      full_name: 'Content Manager',
      role: 'content_manager',
      description: 'Content Manager',
    },
  ];

  const createdUsers = [];

  for (const userData of users) {
    try {
      // Check if user already exists
      const { data: { users: existingUsers } } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.find((u) => u.phone === userData.phone);

      let userId;

      if (existing) {
        userId = existing.id;
        log('ℹ️  ', `User ${userData.phone} already exists (${userId.slice(0, 8)}...)`);
      } else {
        // Create user via Auth Admin API
        const { data, error } = await supabase.auth.admin.createUser({
          phone: userData.phone,
          phone_confirm: true,
          user_metadata: { full_name: userData.full_name },
        });

        if (error) {
          log('❌', `Failed to create ${userData.phone}: ${error.message}`);
          continue;
        }

        userId = data.user.id;
        log('✅', `Created user: ${userData.full_name} (${userData.phone})`);
      }

      // Ensure profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (!profile) {
        const phoneClean = userData.phone.replace('+966', '');
        await supabase.from('profiles').insert({
          id: userId,
          phone: phoneClean,
          full_name: userData.full_name,
          locale: 'ar',
          is_active: true,
        });
        log('✅', `  → Profile created for ${userData.full_name}`);
      }

      // Assign role
      const { data: role } = await supabase
        .from('roles')
        .select('id')
        .eq('slug', userData.role)
        .single();

      if (role) {
        // Check if role already assigned
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', userId)
          .eq('role_id', role.id)
          .single();

        if (!existingRole) {
          await supabase.from('user_roles').insert({
            user_id: userId,
            role_id: role.id,
          });
          log('✅', `  → Assigned role: ${userData.role}`);
        } else {
          log('ℹ️  ', `  → Role ${userData.role} already assigned`);
        }
      }

      createdUsers.push({ ...userData, userId });
    } catch (e) {
      log('❌', `Error with ${userData.phone}: ${e.message}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋  Demo Users Summary');
  console.log('='.repeat(60));
  console.log('\n  Phone          Name                 Role\n  ' + '-'.repeat(55));

  for (const u of createdUsers) {
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
