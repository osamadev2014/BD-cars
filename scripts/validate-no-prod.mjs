#!/usr/bin/env node
// =============================================
// Ryon - Validate No Production Connections
// =============================================
// Scans the entire codebase for hardcoded production
// URLs, API keys, and external service credentials.
//
// Run: node scripts/validate-no-prod.mjs
// Or: npm run validate:prod

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const PRODUCTION_PATTERNS = [
  { pattern: /uxgtgdmnmpehsejmrynt/g, description: 'Supabase project reference ID' },
  { pattern: /https:\/\/[a-z0-9]+\.supabase\.co/g, description: 'Supabase production URL' },
  { pattern: /bd\.evico\.sa/g, description: 'Production domain' },
];

const HARDCODED_KEY_PATTERNS = [
  { pattern: /eyJ[A-Za-z0-9_-]{50,}/g, description: 'Possible JWT/hardcoded key', excludeInComments: true },
  { pattern: /sk_live_[A-Za-z0-9]+/g, description: 'Stripe live secret key' },
  { pattern: /pk_live_[A-Za-z0-9]+/g, description: 'Stripe live publishable key' },
  { pattern: /AC[a-f0-9]{32}/g, description: 'Twilio Account SID (real)' },
  { pattern: /re_[A-Za-z0-9]{20,}/g, description: 'Resend API key (real, not placeholder)' },
];

const SKIP_DIRS = [
  'node_modules', '.next', '.git', 'dist', 'build',
  'supabase/.temp', '.vercel',
];

const SKIP_FILES = [
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  '.env.local.example', '.env.production.example',
  'supabase/.temp',
];

function shouldSkipDir(dir) {
  return SKIP_DIRS.some((skip) => dir.includes(skip));
}

function getFiles(dir) {
  const files = [];
  try {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);
      if (shouldSkipDir(fullPath)) continue;

      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          files.push(...getFiles(fullPath));
        } else if (stat.isFile()) {
          const ext = extname(entry).toLowerCase();
          if (['.ts', '.tsx', '.js', '.mjs', '.json', '.toml', '.env', '.sql', '.md'].includes(ext) ||
              entry.startsWith('.env')) {
            files.push(fullPath);
          }
        }
      } catch { /* skip inaccessible */ }
    }
  } catch { /* skip inaccessible */ }
  return files;
}

function main() {
  console.log('\n🔍  Scanning codebase for production connections and hardcoded keys...\n');

  const files = getFiles(rootDir);
  let issues = 0;
  let warnings = 0;
  const results = [];

  for (const file of files) {
    // Skip the validation script itself
    if (file.includes('validate-no-prod.mjs')) continue;

    let content;
    try {
      content = readFileSync(file, 'utf-8');
    } catch { continue; }

    const relPath = file.replace(rootDir + '\\', '').replace(rootDir + '/', '');

    // Check for production patterns
    for (const { pattern, description } of PRODUCTION_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match;
      while ((match = regex.exec(content)) !== null) {
        const lineNum = content.slice(0, match.index).split('\n').length;
        results.push({
          file: relPath,
          line: lineNum,
          issue: description,
          match: match[0].slice(0, 60),
          severity: 'error',
        });
        issues++;
      }
    }

    // Check for hardcoded keys (exclude env files and .example files)
    if (!relPath.includes('.example') && !relPath.includes('.env.')) {
      for (const { pattern, description } of HARDCODED_KEY_PATTERNS) {
        const regex = new RegExp(pattern.source, pattern.flags);
        let match;
        while ((match = regex.exec(content)) !== null) {
          // Skip if it's clearly a placeholder
          if (match[0].includes('placeholder')) continue;

          const lineNum = content.slice(0, match.index).split('\n').length;
          results.push({
            file: relPath,
            line: lineNum,
            issue: description,
            match: match[0].slice(0, 40) + '...',
            severity: 'warning',
          });
          warnings++;
        }
      }
    }
  }

  // Print results
  if (results.length === 0) {
    console.log('  ✅  No production connections or hardcoded keys found!\n');
    console.log('  All services are properly configured via environment variables.\n');
  } else {
    console.log('  Found issues:\n');
    for (const r of results) {
      const icon = r.severity === 'error' ? '❌' : '⚠️ ';
      console.log(`  ${icon}  ${r.file}:${r.line}`);
      console.log(`       ${r.issue}: ${r.match}\n`);
    }

    console.log(`  Summary: ${issues} errors, ${warnings} warnings\n`);
  }

  // Check .env.local for production keys
  const envPath = join(rootDir, '.env.local');
  try {
    const envContent = readFileSync(envPath, 'utf-8');
    for (const { pattern, description } of PRODUCTION_PATTERNS) {
      if (pattern.test(envContent)) {
        console.log(`  ❌  .env.local contains production reference: ${description}`);
        issues++;
      }
    }
  } catch { /* .env.local doesn't exist, that's fine */ }

  if (issues > 0) {
    console.log('\n  ⚠️  Issues found! Fix them before deploying to production.\n');
    process.exit(1);
  }

  console.log('  🎉  Validation passed. Local development environment is safe.\n');
}

main();
