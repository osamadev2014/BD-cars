-- =============================================
-- Phase 1: Organization Roles & Permissions
-- Granular role-based access control within orgs
-- =============================================
-- UP: Creates roles/permissions tables + seeds + RLS
-- DOWN: Drop tables

-- ============ ORGANIZATION ROLES ============
create table if not exists public.organization_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  slug text not null,
  name_en text not null,
  name_ar text not null,
  description text,
  is_system boolean not null default false,
  priority int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_org_roles_org_id on public.organization_roles(organization_id);
create unique index if not exists idx_org_roles_slug on public.organization_roles(organization_id, slug);

comment on table public.organization_roles is 'Custom roles per organization with slugs for policy checks';
comment on column public.organization_roles.is_system is 'System roles (owner, admin) cannot be deleted';
comment on column public.organization_roles.priority is 'Higher = more privileged, owner=100, admin=50, member=10';

-- ============ ORGANIZATION PERMISSIONS ============
create table if not exists public.organization_permissions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  category text not null,
  description text
);

create index if not exists idx_org_permissions_category on public.organization_permissions(category);

comment on table public.organization_permissions is 'Flat list of all granular permissions available in the system';

-- ============ ROLE-PERMISSION BRIDGE ============
create table if not exists public.role_permissions (
  role_id uuid not null references public.organization_roles(id) on delete cascade,
  permission_id uuid not null references public.organization_permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

comment on table public.role_permissions is 'Maps roles to their granted permissions';

-- ============ SEED PERMISSIONS ============
insert into public.organization_permissions (slug, name_en, name_ar, category, description) values
  -- Organization
  ('org.view', 'View Organization', 'عرض المنشأة', 'organization', 'View organization details'),
  ('org.edit', 'Edit Organization', 'تعديل المنشأة', 'organization', 'Edit organization profile'),
  ('org.delete', 'Delete Organization', 'حذف المنشأة', 'organization', 'Delete the organization'),
  ('org.manage_billing', 'Manage Billing', 'إدارة الفواتير', 'organization', 'Manage subscription and billing'),
  -- Members
  ('members.view', 'View Members', 'عرض الأعضاء', 'members', 'View organization members'),
  ('members.invite', 'Invite Members', 'دعوة أعضاء', 'members', 'Invite new members'),
  ('members.manage_roles', 'Manage Roles', 'إدارة الصلاحيات', 'members', 'Change member roles'),
  ('members.remove', 'Remove Members', 'حذف أعضاء', 'members', 'Remove members from organization'),
  -- Branches
  ('branches.view', 'View Branches', 'عرض الفروع', 'branches', 'View organization branches'),
  ('branches.create', 'Create Branches', 'إنشاء فرع', 'branches', 'Create new branches'),
  ('branches.edit', 'Edit Branches', 'تعديل فرع', 'branches', 'Edit branch details'),
  ('branches.delete', 'Delete Branches', 'حذف فرع', 'branches', 'Delete branches'),
  -- Listings (car_dealer specific, but generally useful)
  ('listings.view', 'View Listings', 'عرض الإعلانات', 'listings', 'View vehicle listings'),
  ('listings.create', 'Create Listings', 'إنشاء إعلان', 'listings', 'Create new listings'),
  ('listings.edit', 'Edit Listings', 'تعديل إعلان', 'listings', 'Edit existing listings'),
  ('listings.delete', 'Delete Listings', 'حذف إعلان', 'listings', 'Delete listings'),
  ('listings.approve', 'Approve Listings', 'اعتماد إعلان', 'listings', 'Approve pending listings'),
  -- Inventory
  ('inventory.view', 'View Inventory', 'عرض المخزون', 'inventory', 'View inventory'),
  ('inventory.manage', 'Manage Inventory', 'إدارة المخزون', 'inventory', 'Add/edit inventory items'),
  -- Sales & Finance
  ('sales.view', 'View Sales', 'عرض المبيعات', 'sales', 'View sales records'),
  ('sales.manage', 'Manage Sales', 'إدارة المبيعات', 'sales', 'Create/edit sales'),
  ('finance.view', 'View Finance', 'عرض المالية', 'finance', 'View financial records'),
  ('finance.manage', 'Manage Finance', 'إدارة المالية', 'finance', 'Manage financial operations'),
  -- Inspections
  ('inspections.view', 'View Inspections', 'عرض الفحوصات', 'inspections', 'View inspection reports'),
  ('inspections.create', 'Create Inspections', 'إنشاء فحص', 'inspections', 'Perform new inspections'),
  -- Reports
  ('reports.view', 'View Reports', 'عرض التقارير', 'reports', 'View analytics and reports'),
  ('reports.export', 'Export Reports', 'تصدير التقارير', 'reports', 'Export reports as CSV/PDF'),
  -- Settings
  ('settings.view', 'View Settings', 'عرض الإعدادات', 'settings', 'View organization settings'),
  ('settings.manage', 'Manage Settings', 'إدارة الإعدادات', 'settings', 'Modify organization settings')
on conflict (slug) do nothing;

-- ============ SEED SYSTEM ROLES ============
-- Note: owner and admin are special; owner has implicit all permissions
-- These are inserted via the backfill process when orgs are created

-- ============ RLS ============
alter table public.organization_roles enable row level security;
alter table public.organization_permissions enable row level security;
alter table public.role_permissions enable row level security;

-- Organization Roles: members can view their org's roles
create policy "org_roles_select_member" on public.organization_roles
  for select using (
    public.is_org_member(organization_id)
  );

create policy "org_roles_insert_admin" on public.organization_roles
  for insert with check (
    public.is_org_role(organization_id, 'owner') or public.is_org_role(organization_id, 'admin')
  );

create policy "org_roles_update_admin" on public.organization_roles
  for update using (
    public.is_org_role(organization_id, 'owner') or public.is_org_role(organization_id, 'admin')
  );

create policy "org_roles_delete_admin" on public.organization_roles
  for delete using (
    public.is_org_role(organization_id, 'owner') or public.is_org_role(organization_id, 'admin')
  );

-- Permissions: public read-only (reference data)
create policy "org_permissions_select_all" on public.organization_permissions
  for select using (true);

-- Role-Permissions: members can view their org's role-permission mappings
create policy "role_permissions_select_member" on public.role_permissions
  for select using (
    exists (
      select 1 from public.organization_roles r
      where r.id = role_id and public.is_org_member(r.organization_id)
    )
  );

create policy "role_permissions_insert_admin" on public.role_permissions
  for insert with check (
    exists (
      select 1 from public.organization_roles r
      where r.id = role_id
      and (public.is_org_role(r.organization_id, 'owner') or public.is_org_role(r.organization_id, 'admin'))
    )
  );

create policy "role_permissions_delete_admin" on public.role_permissions
  for delete using (
    exists (
      select 1 from public.organization_roles r
      where r.id = role_id
      and (public.is_org_role(r.organization_id, 'owner') or public.is_org_role(r.organization_id, 'admin'))
    )
  );

-- Super admin overrides
create policy "org_roles_all_admin" on public.organization_roles
  for all using (public.is_super_admin());

create policy "role_permissions_all_admin" on public.role_permissions
  for all using (public.is_super_admin());

-- ============ HELPER: Check permission ============
create or replace function public.has_org_permission(org_id uuid, permission_slug text)
returns boolean
language plpgsql
security definer
as $$
begin
  -- Owner implicitly has all permissions
  if public.is_org_role(org_id, 'owner') then
    return true;
  end if;
  -- Check role -> permissions mapping
  return exists (
    select 1
    from public.organization_members om
    join public.organization_roles r on r.organization_id = om.organization_id and r.slug = om.role
    join public.role_permissions rp on rp.role_id = r.id
    join public.organization_permissions p on p.id = rp.permission_id
    where om.organization_id = has_org_permission.org_id
    and om.user_id = auth.uid()
    and om.is_active = true
    and om.status = 'active'
    and p.slug = has_org_permission.permission_slug
  );
end;
$$;

comment on function public.has_org_permission is 'Returns true if the current user has a specific permission within the given organization';

-- ============ DOWN ============
-- drop function if exists public.has_org_permission;
-- drop table if exists public.role_permissions;
-- drop table if exists public.organization_permissions;
-- drop table if exists public.organization_roles;
