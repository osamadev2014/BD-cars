create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  channel_in_app boolean not null default true,
  channel_push boolean not null default false,
  channel_email boolean not null default false,
  channel_sms boolean not null default false,
  pref_listing_updates boolean not null default true,
  pref_messages boolean not null default true,
  pref_inspection boolean not null default true,
  pref_auctions boolean not null default true,
  pref_purchase_requests boolean not null default true,
  pref_finance boolean not null default true,
  pref_spare_parts boolean not null default true,
  pref_delivery boolean not null default true,
  pref_admin_alerts boolean not null default true,
  pref_marketing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notification_preferences_user on public.notification_preferences(user_id);

alter table public.notification_preferences enable row level security;

create policy "Users can view own notification preferences"
  on public.notification_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own notification preferences"
  on public.notification_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own notification preferences"
  on public.notification_preferences for update
  using (auth.uid() = user_id);

grant select, insert, update on public.notification_preferences to authenticated;
