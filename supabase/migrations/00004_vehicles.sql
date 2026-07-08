-- Vehicle & Listing Tables

create table if not exists public.vehicle_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  make_id uuid references public.car_makes(id) on delete set null,
  model_id uuid references public.car_models(id) on delete set null,
  trim_id uuid references public.car_trims(id) on delete set null,
  generation_id uuid references public.car_generations(id) on delete set null,
  year integer,
  mileage integer,
  mileage_unit text not null default 'km',
  color_id uuid references public.car_colors(id) on delete set null,
  fuel_type_id uuid references public.fuel_types(id) on delete set null,
  transmission_id uuid references public.transmission_types(id) on delete set null,
  drivetrain_id uuid references public.drivetrain_types(id) on delete set null,
  body_type_id uuid references public.body_types(id) on delete set null,
  condition_id uuid references public.vehicle_condition_types(id) on delete set null,
  vin text,
  plate_number text,
  chassis_number text,
  engine_number text,
  cylinders integer,
  horsepower integer,
  engine_size numeric(4,1),
  doors integer,
  seats integer,
  color text,
  interior_color text,
  description text,
  description_ar text,
  city_id uuid references public.cities(id) on delete set null,
  district_id uuid references public.districts(id) on delete set null,
  is_imported boolean not null default false,
  is_agency boolean not null default false,
  has_accident_history boolean not null default false,
  has_service_history boolean not null default false,
  warranty_months integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_vehicles_updated_at
  before update on public.vehicles
  for each row
  execute function public.handle_updated_at();

create index if not exists idx_vehicles_owner on public.vehicles(owner_id);
create index if not exists idx_vehicles_make on public.vehicles(make_id);
create index if not exists idx_vehicles_model on public.vehicles(model_id);
create index if not exists idx_vehicles_city on public.vehicles(city_id);
create index if not exists idx_vehicles_year on public.vehicles(year);
create index if not exists idx_vehicles_condition on public.vehicles(condition_id);

create table if not exists public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  url text not null,
  thumbnail_url text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_vehicle_images_vehicle on public.vehicle_images(vehicle_id);

create table if not exists public.vehicle_videos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  url text not null,
  thumbnail_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_vehicle_videos_vehicle on public.vehicle_videos(vehicle_id);

create table if not exists public.vehicle_documents (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  title text not null,
  file_url text not null,
  document_type text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_vehicle_documents_vehicle on public.vehicle_documents(vehicle_id);

create table if not exists public.vehicle_status_history (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_vehicle_status_history_vehicle on public.vehicle_status_history(vehicle_id);

create table if not exists public.vehicle_price_history (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  old_price numeric(12,2),
  new_price numeric(12,2) not null,
  changed_by uuid references auth.users(id) on delete set null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists idx_vehicle_price_history_vehicle on public.vehicle_price_history(vehicle_id);

create table if not exists public.vehicle_listings (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  dealer_id uuid, -- FK added in dealer migration
  title text not null,
  title_ar text,
  slug text not null unique,
  description text,
  description_ar text,
  price numeric(12,2) not null,
  original_price numeric(12,2),
  currency text not null default 'SAR',
  status text not null default 'draft',
  seller_type text not null default 'individual',
  is_featured boolean not null default false,
  featured_until timestamptz,
  is_instant_buy boolean not null default false,
  instant_buy_price numeric(12,2),
  has_inspection boolean not null default false,
  inspection_report_id uuid,
  is_auction boolean not null default false,
  is_wholesale boolean not null default false,
  is_dealer_only boolean not null default false,
  views_count integer not null default 0,
  inquiry_count integer not null default 0,
  favorite_count integer not null default 0,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_vehicle_listings_updated_at
  before update on public.vehicle_listings
  for each row
  execute function public.handle_updated_at();

create index if not exists idx_vehicle_listings_vehicle on public.vehicle_listings(vehicle_id);
create index if not exists idx_vehicle_listings_seller on public.vehicle_listings(seller_id);
create index if not exists idx_vehicle_listings_dealer on public.vehicle_listings(dealer_id);
create index if not exists idx_vehicle_listings_status on public.vehicle_listings(status);
create index if not exists idx_vehicle_listings_price on public.vehicle_listings(price);
create index if not exists idx_vehicle_listings_featured on public.vehicle_listings(is_featured);
create index if not exists idx_vehicle_listings_published on public.vehicle_listings(published_at);
create index if not exists idx_vehicle_listings_slug on public.vehicle_listings(slug);

create table if not exists public.listing_status_history (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_listing_status_history_listing on public.listing_status_history(listing_id);

create table if not exists public.listing_approval_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  requested_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  review_notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.listing_change_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  requested_by uuid not null references auth.users(id) on delete cascade,
  changes jsonb not null,
  status text not null default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  review_notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicle_views (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  viewer_id uuid references auth.users(id) on delete set null,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists idx_vehicle_views_listing on public.vehicle_views(listing_id);
create index if not exists idx_vehicle_views_date on public.vehicle_views(created_at);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, listing_id)
);

create index if not exists idx_favorites_user on public.favorites(user_id);
create index if not exists idx_favorites_listing on public.favorites(listing_id);

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  filters jsonb not null,
  notify boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_saved_searches_user on public.saved_searches(user_id);

create table if not exists public.saved_search_alerts (
  id uuid primary key default gen_random_uuid(),
  saved_search_id uuid not null references public.saved_searches(id) on delete cascade,
  frequency text not null default 'daily',
  last_sent_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicle_comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  listings jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vehicle_comparisons_user on public.vehicle_comparisons(user_id);
