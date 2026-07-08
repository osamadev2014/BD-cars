-- Inspection Tables

create table if not exists public.inspection_centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  description text,
  description_ar text,
  logo_url text,
  cover_url text,
  phone text,
  email text,
  website text,
  city_id uuid references public.cities(id) on delete set null,
  address text,
  address_ar text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  is_active boolean not null default true,
  revenue_share_percentage numeric(5,2) default 80,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_inspection_centers_updated_at
  before update on public.inspection_centers
  for each row execute function public.handle_updated_at();

create table if not exists public.inspection_center_branches (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.inspection_centers(id) on delete cascade,
  name text not null,
  name_ar text not null,
  phone text,
  city_id uuid references public.cities(id) on delete set null,
  address text,
  address_ar text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_inspection_branches_center on public.inspection_center_branches(center_id);

create table if not exists public.inspection_center_users (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.inspection_centers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'technician',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(center_id, user_id)
);

create table if not exists public.inspection_services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  description text,
  description_ar text,
  default_price numeric(10,2),
  duration_minutes integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.inspection_service_pricing (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.inspection_services(id) on delete cascade,
  center_id uuid references public.inspection_centers(id) on delete cascade,
  city_id uuid references public.cities(id) on delete set null,
  car_make_id uuid references public.car_makes(id) on delete set null,
  price numeric(10,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.inspection_appointments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.vehicle_listings(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  center_id uuid not null references public.inspection_centers(id) on delete cascade,
  branch_id uuid references public.inspection_center_branches(id) on delete set null,
  service_id uuid references public.inspection_services(id) on delete set null,
  customer_id uuid not null references auth.users(id) on delete cascade,
  appointment_date timestamptz not null,
  status text not null default 'pending',
  notes text,
  price numeric(10,2),
  payment_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_inspection_appointments_updated_at
  before update on public.inspection_appointments
  for each row execute function public.handle_updated_at();

create index if not exists idx_inspection_appointments_center on public.inspection_appointments(center_id);
create index if not exists idx_inspection_appointments_customer on public.inspection_appointments(customer_id);
create index if not exists idx_inspection_appointments_date on public.inspection_appointments(appointment_date);
create index if not exists idx_inspection_appointments_status on public.inspection_appointments(status);

create table if not exists public.inspection_reports (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.inspection_appointments(id) on delete set null,
  listing_id uuid references public.vehicle_listings(id) on delete set null,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  inspector_id uuid references auth.users(id) on delete set null,
  score integer,
  max_score integer default 100,
  status text not null default 'in_progress',
  outcome text,
  summary text,
  summary_ar text,
  recommendation text,
  recommendation_ar text,
  estimated_repair_cost numeric(12,2),
  is_public boolean not null default false,
  admin_approved boolean not null default false,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  share_token text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_inspection_reports_updated_at
  before update on public.inspection_reports
  for each row execute function public.handle_updated_at();

create index if not exists idx_inspection_reports_vehicle on public.inspection_reports(vehicle_id);
create index if not exists idx_inspection_reports_listing on public.inspection_reports(listing_id);
create index if not exists idx_inspection_reports_status on public.inspection_reports(status);

create table if not exists public.inspection_report_sections (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.inspection_reports(id) on delete cascade,
  name text not null,
  name_ar text not null,
  slug text not null,
  score integer,
  max_score integer default 100,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_inspection_report_sections_report on public.inspection_report_sections(report_id);

create table if not exists public.inspection_report_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.inspection_report_sections(id) on delete cascade,
  name text not null,
  name_ar text not null,
  status text,
  score integer,
  notes text,
  notes_ar text,
  severity text,
  estimated_repair_cost numeric(10,2),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_inspection_report_items_section on public.inspection_report_items(section_id);

create table if not exists public.inspection_media (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.inspection_reports(id) on delete cascade,
  section_id uuid references public.inspection_report_sections(id) on delete cascade,
  item_id uuid references public.inspection_report_items(id) on delete cascade,
  url text not null,
  thumbnail_url text,
  media_type text not null default 'image',
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists public.inspection_defects (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.inspection_reports(id) on delete cascade,
  item_id uuid references public.inspection_report_items(id) on delete cascade,
  name text not null,
  name_ar text not null,
  severity text not null default 'minor',
  description text,
  description_ar text,
  estimated_repair_cost numeric(10,2),
  position_x numeric(5,2),
  position_y numeric(5,2),
  created_at timestamptz not null default now()
);

create table if not exists public.inspection_status_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.inspection_reports(id) on delete cascade,
  status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.inspection_report_approval_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.inspection_reports(id) on delete cascade,
  action text not null,
  performed_by uuid not null references auth.users(id) on delete cascade,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.inspection_revenue_shares (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.inspection_appointments(id) on delete cascade,
  center_id uuid not null references public.inspection_centers(id) on delete cascade,
  total_amount numeric(10,2) not null,
  center_share numeric(10,2) not null,
  ryon_share numeric(10,2) not null,
  share_percentage numeric(5,2) not null,
  created_at timestamptz not null default now()
);
