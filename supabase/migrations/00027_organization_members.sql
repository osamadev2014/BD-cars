-- =============================================
-- Phase 1: Organization Members
-- =============================================
-- UP: Creates the unified organization members table, replacing all *_users tables
-- DOWN: Drop organization_members table

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),

  -- Relationships
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Role within the org (matches pattern: dealer_users.role text)
  role text not null default 'member',

  -- Status
  status org_member_status not null default 'active',
  is_active boolean not null default true,

  -- Invitation tracking (for invited members)
  invited_by uuid references auth.users(id) on delete set null,
  invited_at timestamptz,
  joined_at timestamptz default now(),

  -- Audit trail
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,

  -- A user can only be a member of an org once
  constraint uq_organization_members unique (organization_id, user_id)
);

-- Indexes for common queries
create index idx_org_members_org on public.organization_members(organization_id);
create index idx_org_members_user on public.organization_members(user_id);
create index idx_org_members_role on public.organization_members(role);
create index idx_org_members_status on public.organization_members(status);
create index idx_org_members_active on public.organization_members(organization_id, user_id) where is_active = true;

-- Updated_at trigger
create trigger trigger_org_members_updated_at
  before update on public.organization_members
  for each row
  execute function public.set_organizations_updated_at();

comment on table public.organization_members is 'Unified user-to-organization membership, replacing per-org-type user tables (dealer_users, finance_partner_users, etc.)';
comment on column public.organization_members.role is 'Org-specific role text (e.g. owner, admin, employee, technician). Will later map to public.roles';
comment on column public.organization_members.invited_by is 'The existing member who invited this user';
