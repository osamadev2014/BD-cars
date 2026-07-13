-- =============================================
-- Phase 1: RLS Policies for Organization Tables
-- =============================================
-- UP: Enables RLS and creates strict tenant-isolation policies
-- DOWN: Drops the policies created here

-- ============ Helper: Check if user is member of org ============
create or replace function public.is_org_member(org_id uuid)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1
    from public.organization_members om
    where om.organization_id = is_org_member.org_id
    and om.user_id = auth.uid()
    and om.is_active = true
    and om.status = 'active'
  );
end;
$$;

-- ============ Helper: Check if user has a specific role in an org ============
create or replace function public.is_org_role(org_id uuid, role_slug text)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1
    from public.organization_members om
    where om.organization_id = is_org_role.org_id
    and om.user_id = auth.uid()
    and om.role = is_org_role.role_slug
    and om.is_active = true
    and om.status = 'active'
  );
end;
$$;

-- ============ Helper: Check if user is super_admin ============
create or replace function public.is_super_admin()
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
    and r.slug in ('super_admin', 'system_owner')
  );
end;
$$;

comment on function public.is_org_member is 'Returns true if the current user is an active member of the given organization';
comment on function public.is_org_role is 'Returns true if the current user holds a specific role within the given organization';
comment on function public.is_super_admin is 'Returns true if the current user has a super_admin or system_owner platform-level role';

-- ============ ORGANIZATIONS ============
alter table public.organizations enable row level security;

-- Anyone can read published/active organizations (public directory)
create policy "orgs_select_public" on public.organizations
  for select using (
    status = 'active' and is_active = true
  );

-- Members can always see their own organizations
create policy "orgs_select_member" on public.organizations
  for select using (
    public.is_org_member(id)
  );

-- Super admins can see everything
create policy "orgs_select_admin" on public.organizations
  for select using (
    public.is_super_admin()
  );

-- Any authenticated user can create a new organization
create policy "orgs_insert_auth" on public.organizations
  for insert with check (
    auth.uid() is not null
    and created_by = auth.uid()
  );

-- Only org members with 'owner' or 'admin' role can update their org
create policy "orgs_update_member" on public.organizations
  for update using (
    public.is_org_role(id, 'owner')
    or public.is_org_role(id, 'admin')
  );

-- Only super admins can update status/is_active (approval flow)
create policy "orgs_update_status_admin" on public.organizations
  for update using (
    public.is_super_admin()
  );

-- Only super admins can delete organizations
create policy "orgs_delete_admin" on public.organizations
  for delete using (
    public.is_super_admin()
  );

-- ============ ORGANIZATION MEMBERS ============
alter table public.organization_members enable row level security;

-- Members can see all members of their orgs
create policy "org_members_select_org" on public.organization_members
  for select using (
    public.is_org_member(organization_id)
  );

-- Users can always see their own memberships
create policy "org_members_select_own" on public.organization_members
  for select using (
    user_id = auth.uid()
  );

-- Super admins can see all memberships
create policy "org_members_select_admin" on public.organization_members
  for select using (
    public.is_super_admin()
  );

-- Users can join an org via invitation flow (self-insert with invited_by)
create policy "org_members_insert_self" on public.organization_members
  for insert with check (
    user_id = auth.uid()
    and invited_by is not null
  );

-- Org owners/admins can add members
create policy "org_members_insert_admin" on public.organization_members
  for insert with check (
    public.is_org_role(organization_id, 'owner')
    or public.is_org_role(organization_id, 'admin')
  );

-- Org owners/admins can update members (change roles, suspend)
create policy "org_members_update_admin" on public.organization_members
  for update using (
    public.is_org_role(organization_id, 'owner')
    or public.is_org_role(organization_id, 'admin')
  );

-- Users can update their own membership (e.g. leave org, accept invite)
create policy "org_members_update_self" on public.organization_members
  for update using (
    user_id = auth.uid()
  );

-- Org owners/admins can remove members
create policy "org_members_delete_admin" on public.organization_members
  for delete using (
    public.is_org_role(organization_id, 'owner')
    or public.is_org_role(organization_id, 'admin')
  );

-- Users can delete their own membership (leave org)
create policy "org_members_delete_self" on public.organization_members
  for delete using (
    user_id = auth.uid()
  );

-- Super admins can manage all memberships
create policy "org_members_all_admin" on public.organization_members
  for all using (
    public.is_super_admin()
  );

comment on table public.organizations is 'RLS: public read for active orgs, member read for own orgs, super_admin full access';
comment on table public.organization_members is 'RLS: members see org members, users see own memberships, super_admin full access';
