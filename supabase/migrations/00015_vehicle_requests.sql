-- VEHICLE REQUESTS (buyers request vehicles not found on platform)

create table if not exists public.vehicle_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  make_id uuid references public.car_makes(id) on delete set null,
  model_id uuid references public.car_models(id) on delete set null,
  make_name text,
  model_name text,
  year_from integer,
  year_to integer,
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  body_type_id uuid references public.body_types(id) on delete set null,
  notes text,
  status text not null default 'open',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vehicle_requests_user on public.vehicle_requests(user_id);
create index if not exists idx_vehicle_requests_status on public.vehicle_requests(status);

alter table public.vehicle_requests enable row level security;

create policy "req_select_own" on public.vehicle_requests
  for select using (user_id = auth.uid() or exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));

create policy "req_insert_own" on public.vehicle_requests
  for insert with check (user_id = auth.uid());

create policy "req_update_admin" on public.vehicle_requests
  for update using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));

-- NOTIFICATION ON STATUS CHANGE
create or replace function public.handle_request_status_change()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into public.internal_notifications (user_id, title, title_ar, body, body_ar, type, reference_type, reference_id)
    values (
      new.user_id,
      'Request Update',
      'تحديث الطلب',
      'Your vehicle request status has been updated to ' || new.status,
      'تم تحديث حالة طلب مركبتك إلى ' || new.status,
      'info',
      'vehicle_request',
      new.id::text
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_request_status_change
  after update on public.vehicle_requests
  for each row
  when (old.status is distinct from new.status)
  execute function public.handle_request_status_change();
