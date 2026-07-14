<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-context -->
# Roin — Multi-Tenant Platform

## Architecture
- **Frontend**: Next.js (with breaking changes — read `node_modules/next/dist/docs/`)
- **Backend**: Supabase (Postgres + RLS + Row Level Security)
- **Auth**: Supabase Auth with OTP (DEV_OTP=1234 in .env.local)
- **i18n**: next-intl with `localePrefix: 'always'` — all routes under `/[locale]/`
- **Middleware**: `src/proxy.ts` (NOT `src/middleware.ts`)
- **DB types**: `src/lib/database.types.ts` — auto-generated from `scripts/generate-types.mjs`

## Security (CRITICAL)
- `.env.local` contains real `SUPABASE_SERVICE_ROLE_KEY` and `DEV_OTP=1234` — **must rotate service role key in Supabase dashboard**
- `scripts/seed-supabase.mjs` and `scripts/run-seed-images.mjs` previously had hardcoded service role JWTs — now read from `process.env.*`
- `.gitignore` covers `.env*`, only `.env.example` is tracked
- Service role key must **never** appear in browser bundles

## Multi-Tenant Design (Phase 1)
### 10 Organization Types (org_type enum)
`car_dealer`, `inspection_center`, `wholesale_vehicle_trader`, `spare_parts_supplier`, `finance_company`, `insurance_company`, `advertising_marketing_company`, `car_rental_company`, `product_shipping_company`, `vehicle_transport_company`

### Key Tables (new, in migrations 00025-00030)
- `public.organizations` — unified org table with type discriminator, status lifecycle, owner reference
- `public.organization_members` — unified membership replacing per-type *_users tables
- Existing entity tables preserved — all get nullable `org_id` FK

### RLS Helpers
- `public.is_org_member(org_id)` — checks active membership
- `public.is_org_role(org_id, role_slug)` — checks specific role in org
- `public.is_super_admin()` — checks for super_admin/system_owner platform role (explicit, never client-controlled)

### Existing Entity → Org Mapping
- `dealers` → `car_dealer` (branches, users, inventory, pages, stats, ratings, badges)
- `inspection_centers` → `inspection_center` (branches, users, services, appointments, reports)
- `finance_partners` → `finance_company` (users, revenue model)
- `insurance_partners` → `insurance_company` (users, revenue model)
- `advertisers` → `advertising_marketing_company` (users, campaigns)
- `spare_part_suppliers` → `spare_parts_supplier` (users, parts, pricing)
- `delivery_providers` → `product_shipping_company` (users, zones, pricing)

## Route Protection
- `src/proxy.ts` uses `stripLocale()` to handle locale-prefixed routes (`/ar/dashboard`, `/en/dashboard`)
- `PROTECTED_PATHS` covers `/dashboard`, `/admin`, `/business`

## DB Conventions
- All timestamps: `timestamptz`, default `now()`
- IDs: `uuid` with `gen_random_uuid()`
- Audit columns: `created_at`, `updated_at`, `created_by`
- No destructive migrations — add columns with `IF NOT EXISTS` guards
- Backfill migrations are idempotent (use `on conflict do nothing`)
- RLS policies: public-read for reference data, owner/member for owned data, super_admin for admin operations

## Testing
- Run `npm run build` before committing
- TypeScript types: `node scripts/generate-types.mjs`
- Lint: `npm run lint` (note: many pre-existing warnings/errors)
<!-- END:project-context -->
