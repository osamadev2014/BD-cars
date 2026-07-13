#!/usr/bin/env node
// =============================================
// Ryon - Full Local Development Setup
// =============================================
// Run: node scripts/setup.mjs
// Or: npm run setup
//
// This script:
// 1. Checks prerequisites (Docker, Supabase CLI)
// 2. Starts Supabase locally
// 3. Resets the database (applies all migrations + seed)
// 4. Creates demo users
// 5. Generates TypeScript types
// 6. Updates .env.local with local keys
// 7. Validates no production connections exist

import { execSync, spawn } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const envPath = join(rootDir, '.env.local');
const dbTypesPath = join(rootDir, 'src', 'lib', 'database.types.ts');

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
}

function error(msg) {
  console.error(`\n❌  ${msg}\n`);
  process.exit(1);
}

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { cwd: rootDir, encoding: 'utf-8', stdio: 'pipe', ...opts });
  } catch (e) {
    return null;
  }
}

function runOrExit(cmd, errorMsg) {
  try {
    return execSync(cmd, { cwd: rootDir, encoding: 'utf-8', stdio: 'inherit' });
  } catch {
    error(errorMsg);
  }
}

// =============================================
// Step 1: Check Prerequisites
// =============================================
console.log('\n🔧  Checking prerequisites...\n');

// Check Node.js
const nodeVersion = run('node --version');
if (!nodeVersion) error('Node.js is not installed. Install Node.js 18+.');

// Check Docker
const dockerVersion = run('docker --version');
if (!dockerVersion) {
  error(
    'Docker is not installed.\n' +
    'Install Docker Desktop: https://www.docker.com/products/docker-desktop/\n' +
    'Then restart your terminal and try again.'
  );
}
log('✅', `Docker: ${dockerVersion.trim()}`);

// Check Supabase CLI
const supabaseVersion = run('supabase --version');
if (!supabaseVersion) {
  log('📦', 'Installing Supabase CLI...');
  runOrExit('npm install -g supabase', 'Failed to install Supabase CLI. Run: npm install -g supabase');
}
log('✅', `Supabase CLI: ${supabaseVersion.trim()}`);

// Check Docker daemon
const dockerPs = run('docker ps');
if (!dockerPs) {
  error(
    'Docker daemon is not running.\n' +
    'Start Docker Desktop and wait until it says "Docker Desktop is running".\n' +
    'Then try again.'
  );
}
log('✅', 'Docker daemon is running');

// =============================================
// Step 2: Start Supabase
// =============================================
console.log('\n🐘  Starting Supabase local stack...\n');

try {
  const output = execSync('supabase start', {
    cwd: rootDir,
    encoding: 'utf-8',
    stdio: 'pipe',
    timeout: 300000, // 5 minutes for first run
  });
  console.log(output);

  // Extract keys from output (CLI 2.109.1 outputs JSON, older versions text)
  let anonKey, serviceRoleKey, apiUrl = 'http://127.0.0.1:54321';

  try {
    const json = JSON.parse(output);
    anonKey = json.ANON_KEY;
    serviceRoleKey = json.SERVICE_ROLE_KEY;
    apiUrl = json.API_URL || apiUrl;
  } catch {
    // Fallback: try text format
    const anonMatch = output.match(/anon key:\s*(\S+)/i);
    const serviceRoleMatch = output.match(/service_role key:\s*(\S+)/i);
    const apiUrlMatch = output.match(/API URL:\s*(\S+)/i);
    anonKey = anonMatch?.[1];
    serviceRoleKey = serviceRoleMatch?.[1];
    apiUrl = apiUrlMatch?.[1] || apiUrl;
  }

  if (!anonKey || !serviceRoleKey) {
    console.log('\n⚠️  Could not auto-extract keys from supabase start output.');
    console.log('   Run `supabase status` to see the keys and update .env.local manually.\n');
  } else {
    // =============================================
    // Step 3: Update .env.local
    // =============================================
    log('📝', 'Updating .env.local with local keys...');

    let envContent = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : '';

    if (!envContent) {
      // Create from example
      const examplePath = join(rootDir, '.env.local.example');
      envContent = existsSync(examplePath) ? readFileSync(examplePath, 'utf-8') : '';
    }

    envContent = envContent
      .replace(/NEXT_PUBLIC_SUPABASE_URL=.*/g, `NEXT_PUBLIC_SUPABASE_URL=${apiUrl}`)
      .replace(/NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/g, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`)
      .replace(/SUPABASE_SERVICE_ROLE_KEY=.*/g, `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`)
      .replace(/NEXT_PUBLIC_APP_URL=.*/g, 'NEXT_PUBLIC_APP_URL=http://localhost:3000');

    writeFileSync(envPath, envContent, 'utf-8');
    log('✅', '.env.local updated');
  }
} catch (e) {
  if (e.message?.includes('ECONNREFUSED') || e.message?.includes('docker')) {
    error('Failed to start Supabase. Make sure Docker is running.');
  }
  console.error(e.stdout || e.message);
  error('Failed to start Supabase. Check the error above.');
}

// =============================================
// Step 4: Reset Database (apply all 32 migrations + seed)
// =============================================
console.log('\n🗄️   Resetting database (applying all migrations + seed)...\n');

runOrExit('supabase db reset', 'Failed to reset database. Check migration files for errors.');

// =============================================
// Step 5: Create Demo Users
// =============================================
console.log('\n👥  Creating demo users...\n');

const demoUsersPath = join(rootDir, 'scripts', 'create-demo-users.mjs');
if (existsSync(demoUsersPath)) {
  runOrExit('node scripts/create-demo-users.mjs', 'Failed to create demo users.');
} else {
  log('⚠️  ', 'create-demo-users.mjs not found, skipping demo user creation.');
}

// =============================================
// Step 6: Seed Vehicles, Listings, Dealers
// =============================================
console.log('\n🚗  Seeding vehicles, listings, and dealers...\n');

const seedAfterPath = join(rootDir, 'supabase', 'seed-after-users.sql');
if (existsSync(seedAfterPath)) {
  try {
    execSync(
      `docker cp "${seedAfterPath.replace(/\\/g, '/')}" supabase_db_ryon-local:/tmp/seed-after.sql && docker exec supabase_db_ryon-local psql -U postgres -d postgres -f /tmp/seed-after.sql`,
      { cwd: rootDir, encoding: 'utf-8', stdio: 'pipe' }
    );
    log('✅', 'Vehicles, listings, and dealers seeded');
  } catch (e) {
    log('⚠️  ', `Post-user seed had issues: ${e.message}`);
  }
} else {
  log('⚠️  ', 'seed-after-users.sql not found, skipping.');
}

// =============================================
// Step 7: Generate TypeScript Types
// =============================================
console.log('\n📝  Generating TypeScript types from local database...\n');

const typesOutput = run('npx supabase gen types typescript --local');
if (typesOutput) {
  writeFileSync(dbTypesPath, typesOutput, 'utf-8');
  log('✅', `Types generated: ${dbTypesPath}`);
} else {
  log('⚠️  ', 'Could not generate types via Supabase CLI. Falling back to SQL parser...');
  run('node scripts/generate-types.mjs');
}

// =============================================
// Step 8: Validate No Production Connections
// =============================================
console.log('\n🔍  Validating no production connections...\n');

const prodPatterns = [
  'uxgtgdmnmpehsejmrynt',          // Supabase project ref
  '.supabase.co',                   // Supabase production URLs
  'bd.evico.sa',                    // Production domain
];

let foundIssues = false;

// Check .env.local
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const pattern of prodPatterns) {
    if (envContent.includes(pattern)) {
      log('❌', `.env.local contains production reference: ${pattern}`);
      foundIssues = true;
    }
  }
}

// Check source files for hardcoded keys
const srcDir = join(rootDir, 'src');
const filesToCheck = [
  'src/lib/supabase/admin.ts',
  'src/lib/supabase/server.ts',
  'src/lib/supabase/service-role.ts',
];

for (const file of filesToCheck) {
  const filePath = join(rootDir, file);
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf-8');
    // Only check for hardcoded keys, not env var references
    if (content.includes('eyJ') && !content.includes('process.env')) {
      log('❌', `${file} may contain a hardcoded key`);
      foundIssues = true;
    }
  }
}

if (!foundIssues) {
  log('✅', 'No production connections found in code');
}

// =============================================
// Summary
// =============================================
console.log('\n' + '='.repeat(60));
console.log('🎉  Local development environment is ready!');
console.log('='.repeat(60));
console.log(`
  📌  Commands:
      npm run dev          Start Next.js dev server
      supabase status      Check Supabase services
      supabase db reset    Reset database
      supabase studio      Open Supabase Studio (http://localhost:54323)

  📌  Login:
      URL:  http://localhost:3000/ar/login
      Phone: 0555000001
      OTP:    1234

  📌  Supabase Studio:
      URL:  http://localhost:54323

  📌  Ports:
      API:       http://localhost:54321
      Studio:    http://localhost:54323
      Inbucket:  http://localhost:54324 (email testing)
      Postgres:  localhost:54322
`);
