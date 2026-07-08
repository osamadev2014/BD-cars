import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '..', 'supabase', 'migrations');
const outputPath = join(__dirname, '..', 'src', 'lib', 'database.types.ts');

const COLUMN_TYPE_MAP = {
  uuid: 'string',
  text: 'string',
  varchar: 'string',
  char: 'string',
  boolean: 'boolean',
  integer: 'number',
  bigint: 'number',
  smallint: 'number',
  numeric: 'number',
  decimal: 'number',
  real: 'number',
  double: 'number',
  float: 'number',
  serial: 'number',
  bigserial: 'number',
  timestamptz: 'string',
  timestamp: 'string',
  date: 'string',
  time: 'string',
  timetz: 'string',
  jsonb: 'unknown',
  json: 'unknown',
  oid: 'number',
  bytea: 'string',
  'text[]': 'string[]',
  'varchar[]': 'string[]',
  'uuid[]': 'string[]',
  'integer[]': 'number[]',
  'bigint[]': 'number[]',
  'numeric[]': 'number[]',
  'jsonb[]': 'unknown[]',
  'boolean[]': 'boolean[]',
};

function mapPostgresType(pgType) {
  const lower = pgType.toLowerCase().split('(')[0].split(' ')[0];
  const base = lower.replace('[]', '[]');
  if (COLUMN_TYPE_MAP[base]) return COLUMN_TYPE_MAP[base];
  // Handle numeric precision
  if (base.startsWith('numeric') || base.startsWith('decimal')) return 'number';
  if (base.startsWith('varchar')) return 'string';
  if (base.startsWith('char')) return 'string';
  if (base.startsWith('timestamp') || base.startsWith('time')) return 'string';
  return 'unknown';
}

function snakeToPascal(str) {
  return str.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

function parseCreateTable(sql) {
  const tables = [];
  const tableRegex = /create\s+(?:or\s+replace\s+)?table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?(\w+)\s*\(([\s\S]*?)\);/gi;
  let match;
  while ((match = tableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const body = match[2];
    const columns = [];
    const lines = body.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('--') || trimmed.startsWith('constraint') ||
          trimmed.startsWith('unique') || trimmed.startsWith('primary key') ||
          trimmed.startsWith('foreign key') || trimmed.startsWith('check') ||
          trimmed.startsWith('exclude') || trimmed.startsWith('like') ||
          trimmed.startsWith('partition') || trimmed.startsWith('inherits') ||
          trimmed.startsWith('index') || trimmed.startsWith('trigger') ||
          trimmed.startsWith('on ') || trimmed.startsWith(',  ') ||
          trimmed.startsWith(')') || trimmed.endsWith(');')) {
        continue;
      }
      // Remove trailing comma
      const colDef = trimmed.replace(/,$/, '').trim();
      if (!colDef) continue;
      // Skip if it starts with a keyword
      if (/^(constraint|unique|primary|foreign|check|exclude|like|partition|index|trigger|on|,)/i.test(colDef)) continue;

      const parts = colDef.split(/\s+/);
      if (parts.length < 2) continue;
      const colName = parts[0].replace(/"/g, '');
      // Collect the type until we hit a keyword or default
      let colType = '';
      let i = 1;
      while (i < parts.length && !/^(not|null|default|primary|references|check|unique|constraint|collate)/i.test(parts[i])) {
        colType += (colType ? ' ' : '') + parts[i];
        i++;
      }
      if (!colType) continue;
      columns.push({ name: colName, type: mapPostgresType(colType) });
    }
    if (columns.length > 0) {
      tables.push({ name: tableName, columns, pascalName: snakeToPascal(tableName) });
    }
  }
  return tables;
}

const files = [
  '00001_initial_schema.sql',
  '00002_geo_tables.sql',
  '00003_vehicle_master_data.sql',
  '00004_vehicles.sql',
  '00005_sell_buy_auctions_messaging.sql',
  '00006_inspection.sql',
  '00007_dealers_wholesale_partners.sql',
  '00008_spare_parts_delivery.sql',
  '00009_financial.sql',
  '00010_crm_support_notifications.sql',
];

let allTables = [];
for (const f of files) {
  const sql = readFileSync(join(migrationsDir, f), 'utf-8');
  const tables = parseCreateTable(sql);
  allTables.push(...tables);
}

// Generate TypeScript
let output = `// Auto-generated from SQL migrations. Do not edit manually.
// Run: node scripts/generate-types.mjs

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
${allTables.map(t => {
  const cols = t.columns.map(c =>
    `        ${c.name}: ${c.type}`
  ).join('\n');
  return `      ${t.name}: {
        Row: {
${cols}
        };
        Insert: Partial<{
${cols}
        }>;
        Update: Partial<{
${cols}
        }>;
      };`;
}).join('\n')}
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
`;

// Deduplicate table definitions (some tables might be defined across files)
const seen = new Set();
const lines = output.split('\n');
const deduped = [];
for (const line of lines) {
  const tableMatch = line.match(/^\s{6}(\w+):/);
  if (tableMatch) {
    if (seen.has(tableMatch[1])) {
      // Skip duplicate table entry
      continue;
    }
    seen.add(tableMatch[1]);
  }
  deduped.push(line);
}

writeFileSync(outputPath, deduped.join('\n'), 'utf-8');
console.log(`Generated types for ${allTables.length} tables -> ${outputPath}`);
