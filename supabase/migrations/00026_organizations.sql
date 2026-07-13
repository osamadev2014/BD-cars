-- =============================================
-- Phase 1: Unified Organizations Table
-- =============================================
-- UP: Creates the unified organizations table that replaces 7 separate entity tables
-- DOWN: Drop organizations table and its indexes

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),

  -- Type discriminator
  org_type public.org_type not null,

  -- Identity
  name text not null,
  name_ar text,
  slug text not null,
  description text,
  description_ar text,
  logo_url text,
  cover_url text,

  -- Contact
  phone text,
  email text,
  website text,

  -- Location
  city_id uuid references public.cities(id) on delete set null,
  address text,
  address_ar text,
  latitude numeric(10,7),
  longitude numeric(10,7),

  -- Legal / Registration
  registration_number text,
  tax_number text,

  -- Status lifecycle
  status org_status not null default 'pending_approval',
  is_active boolean not null default false,
  status_notes text,

  -- Audit trail
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Unique slug per org type (a dealer and an inspection center can have same slug)
create unique index idx_organizations_slug_type on public.organizations(org_type, slug);

-- Partial unique index for active orgs to enforce slug uniqueness across all active orgs
create unique index idx_organizations_active_slug on public.organizations(slug) where is_active = true;

-- Lookup indexes
create index idx_organizations_type on public.organizations(org_type);
create index idx_organizations_status on public.organizations(status);
create index idx_organizations_owner on public.organizations(created_by);
create index idx_organizations_city on public.organizations(city_id);

-- Search index on name/name_ar
create index idx_organizations_name on public.organizations using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(name_ar, '')));

-- Updated_at trigger
create or replace function public.set_organizations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trigger_organizations_updated_at
  before update on public.organizations
  for each row
  execute function public.set_organizations_updated_at();

comment on table public.organizations is 'Unified multi-tenant organizations table replacing dealers, inspection_centers, finance_partners, insurance_partners, advertisers, spare_part_suppliers, delivery_providers';
comment on column public.organizations.org_type is 'Discriminator: which type of organization this is';
comment on column public.organizations.status is 'Approval lifecycle; super_admin promotes pending_approval → active';
comment on column public.organizations.is_active is 'Admin toggle; false means org is disabled regardless of status';
comment on column public.organizations.created_by is 'The auth.users who registered this organization';
