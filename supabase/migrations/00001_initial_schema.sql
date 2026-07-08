-- =============================================
-- Ryon Platform - Initial Schema Migration
-- =============================================

-- 1. EXTENSIONS
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;

-- 2. HELPER FUNCTIONS
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_id()
returns trigger
language plpgsql
as $$
begin
  if new.id is null then
    new.id = gen_random_uuid();
  end if;
  return new;
end;
$$;

-- 3. PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text not null unique,
  full_name text,
  avatar_url text,
  locale text not null default 'ar',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- 4. ROLES
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_roles_updated_at
  before update on public.roles
  for each row
  execute function public.handle_updated_at();

-- 5. PERMISSIONS
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  group_name text not null default 'general',
  description text,
  created_at timestamptz not null default now()
);

-- 6. ROLE PERMISSIONS
create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(role_id, permission_id)
);

-- 7. USER ROLES
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, role_id)
);

-- 8. LOGIN EVENTS
create table if not exists public.login_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  phone text not null,
  event_type text not null,
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_login_events_user on public.login_events(user_id);
create index if not exists idx_login_events_phone on public.login_events(phone);
create index if not exists idx_login_events_type on public.login_events(event_type);
create index if not exists idx_login_events_created on public.login_events(created_at desc);

-- 9. AUDIT LOGS
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  old_values jsonb,
  new_values jsonb,
  metadata jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_user on public.audit_logs(user_id);
create index if not exists idx_audit_logs_action on public.audit_logs(action);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);

-- 10. APP SETTINGS
create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  key text not null unique,
  value jsonb not null,
  type text not null default 'string',
  label text not null default '',
  description text,
  is_public boolean not null default false,
  is_dangerous boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_app_settings_updated_at
  before update on public.app_settings
  for each row
  execute function public.handle_updated_at();

create index if not exists idx_app_settings_category on public.app_settings(category);
create index if not exists idx_app_settings_key on public.app_settings(key);

-- 11. SETTINGS HISTORY
create table if not exists public.settings_history (
  id uuid primary key default gen_random_uuid(),
  setting_id uuid not null references public.app_settings(id) on delete cascade,
  old_value jsonb,
  new_value jsonb not null,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_settings_history_setting on public.settings_history(setting_id);
create index if not exists idx_settings_history_created on public.settings_history(created_at desc);

-- 12. STAFF PROFILES
create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  employee_id text unique,
  department text,
  job_title text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_staff_profiles_updated_at
  before update on public.staff_profiles
  for each row
  execute function public.handle_updated_at();
