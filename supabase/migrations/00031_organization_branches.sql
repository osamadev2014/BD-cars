-- =============================================
-- Phase 1: Organization Branches Table
-- Supports multi-branch orgs with location data
-- =============================================
-- UP: Creates organization_branches table + RLS
-- DOWN: Drop table + policies

-- ============ BRANCHES TABLE ============
create table if not exists public.organization_branches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name_en text not null,
  name_ar text not null,
  slug text not null,
  phone text,
  email text,
  city_id uuid references public.cities(id) on delete set null,
  address text,
  address_ar text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  is_headquarters boolean not null default false,
  is_active boolean not null default true,
  timezone text default 'Asia/Riyadh',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Indexes
create index if not exists idx_org_branches_org_id on public.organization_branches(organization_id);
create index if not exists idx_org_branches_city on public.organization_branches(city_id);
create index if not exists idx_org_branches_active on public.organization_branches(organization_id) where is_active = true;
create unique index if not exists idx_org_branches_slug on public.organization_branches(organization_id, slug);

-- Updated-at trigger (reuse existing function from 00026, or create if not exists)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_org_branches_updated_at
  before update on public.organization_branches
  for each row
  execute function public.set_updated_at();

comment on table public.organization_branches is 'Multi-branch support for organizations with location and contact data';
comment on column public.organization_branches.is_headquarters is 'Only one branch per org should be headquarters';

-- ============ RLS ============
alter table public.organization_branches enable row level security;

-- Members can read branches of their orgs
create policy "branches_select_member" on public.organization_branches
  for select using (
    public.is_org_member(organization_id)
  );

-- Public can read active branches of active orgs
create policy "branches_select_public" on public.organization_branches
  for select using (
    is_active = true
    and exists (
      select 1 from public.organizations o
      where o.id = organization_id and o.status = 'active' and o.is_active = true
    )
  );

-- Org owners/admins can manage branches
create policy "branches_insert_admin" on public.organization_branches
  for insert with check (
    public.is_org_role(organization_id, 'owner')
    or public.is_org_role(organization_id, 'admin')
  );

create policy "branches_update_admin" on public.organization_branches
  for update using (
    public.is_org_role(organization_id, 'owner')
    or public.is_org_role(organization_id, 'admin')
  );

create policy "branches_delete_admin" on public.organization_branches
  for delete using (
    public.is_org_role(organization_id, 'owner')
    or public.is_org_role(organization_id, 'admin')
  );

-- Super admins full access
create policy "branches_all_admin" on public.organization_branches
  for all using (
    public.is_super_admin()
  );

-- ============ DOWN ============
-- drop policy if exists "branches_select_member" on public.organization_branches;
-- drop policy if exists "branches_select_public" on public.organization_branches;
-- drop policy if exists "branches_insert_admin" on public.organization_branches;
-- drop policy if exists "branches_update_admin" on public.organization_branches;
-- drop policy if exists "branches_delete_admin" on public.organization_branches;
-- drop policy if exists "branches_all_admin" on public.organization_branches;
-- drop trigger if exists set_org_branches_updated_at on public.organization_branches;
-- drop table if exists public.organization_branches;
