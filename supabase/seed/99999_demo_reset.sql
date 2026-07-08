-- =============================================
-- Ryon Platform - Demo Data Reset
-- Run this to remove all demo/test data
-- while preserving roles, permissions, and settings
-- =============================================

-- Clean all user-created data (keep system roles/permissions/settings)
truncate table public.login_events cascade;
truncate table public.audit_logs cascade;
truncate table public.settings_history cascade;
truncate table public.user_roles cascade;
truncate table public.staff_profiles cascade;

-- Remove non-system profiles (keep profiles created by seed)
-- Profiles linked to auth.users are handled separately
delete from public.profiles
where id not in (
  select id from auth.users
);

-- Reset settings to defaults
update public.app_settings set value = 
  case key
    when 'app_name' then '"Ryon"'
    when 'app_description' then '"Saudi Automotive Marketplace"'
    when 'payment_mode' then '"sandbox"'
    when 'vat_percentage' then '15'
    else value
  end,
  updated_at = now();
