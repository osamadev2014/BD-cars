-- Spare Parts Tables

create table if not exists public.part_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  parent_id uuid references public.part_categories(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.part_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  slug text not null unique,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.spare_parts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_ar text,
  slug text not null unique,
  category_id uuid references public.part_categories(id) on delete set null,
  brand_id uuid references public.part_brands(id) on delete set null,
  part_number text,
  oem_number text,
  description text,
  description_ar text,
  condition text not null default 'new',
  part_type text not null default 'original',
  price numeric(12,2) not null,
  currency text not null default 'SAR',
  stock_quantity integer not null default 0,
  stock_status text not null default 'in_stock',
  min_order_quantity integer not null default 1,
  warranty_months integer,
  return_days integer,
  is_active boolean not null default true,
  is_approved boolean not null default false,
  city_id uuid references public.cities(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_spare_parts_updated_at
  before update on public.spare_parts
  for each row execute function public.handle_updated_at();

create index if not exists idx_spare_parts_category on public.spare_parts(category_id);
create index if not exists idx_spare_parts_brand on public.spare_parts(brand_id);
create index if not exists idx_spare_parts_part_number on public.spare_parts(part_number);
create index if not exists idx_spare_parts_oem on public.spare_parts(oem_number);
create index if not exists idx_spare_parts_stock on public.spare_parts(stock_status);
create index if not exists idx_spare_parts_type on public.spare_parts(part_type);

create table if not exists public.spare_part_images (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references public.spare_parts(id) on delete cascade,
  url text not null,
  thumbnail_url text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.spare_part_compatibility (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references public.spare_parts(id) on delete cascade,
  make_id uuid references public.car_makes(id) on delete cascade,
  model_id uuid references public.car_models(id) on delete cascade,
  year_from integer,
  year_to integer,
  engine_type text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_spare_part_compatibility_part on public.spare_part_compatibility(part_id);
create index if not exists idx_spare_part_compatibility_model on public.spare_part_compatibility(model_id);

create table if not exists public.spare_part_inventory (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references public.spare_parts(id) on delete cascade,
  supplier_id uuid not null references auth.users(id) on delete cascade,
  quantity integer not null default 0,
  location text,
  batch_number text,
  expiry_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spare_part_suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  slug text not null unique,
  description text,
  description_ar text,
  logo_url text,
  phone text,
  email text,
  city_id uuid references public.cities(id) on delete set null,
  is_active boolean not null default true,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spare_part_supplier_users (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.spare_part_suppliers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.spare_part_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  make text,
  model text,
  year integer,
  trim text,
  vin text,
  plate_number text,
  part_name text not null,
  category_id uuid references public.part_categories(id) on delete set null,
  part_number text,
  oem_number text,
  description text,
  urgency text not null default 'normal',
  city_id uuid references public.cities(id) on delete set null,
  delivery_address_id uuid,
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_spare_part_requests_customer on public.spare_part_requests(customer_id);
create index if not exists idx_spare_part_requests_status on public.spare_part_requests(status);

create table if not exists public.spare_part_request_items (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.spare_part_requests(id) on delete cascade,
  part_id uuid references public.spare_parts(id) on delete set null,
  quantity integer not null default 1,
  notes text
);

create table if not exists public.spare_part_quotes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.spare_part_requests(id) on delete cascade,
  supplier_id uuid references public.spare_part_suppliers(id) on delete set null,
  dealer_id uuid,
  quoted_by uuid not null references auth.users(id) on delete cascade,
  price numeric(12,2) not null,
  delivery_fee numeric(10,2) default 0,
  total_price numeric(12,2) not null,
  availability text,
  estimated_delivery_days integer,
  warranty_months integer,
  notes text,
  status text not null default 'sent',
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_spare_part_quotes_request on public.spare_part_quotes(request_id);
create index if not exists idx_spare_part_quotes_status on public.spare_part_quotes(status);

create table if not exists public.spare_part_orders (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.spare_part_requests(id) on delete set null,
  quote_id uuid references public.spare_part_quotes(id) on delete set null,
  customer_id uuid not null references auth.users(id) on delete cascade,
  supplier_id uuid references public.spare_part_suppliers(id) on delete set null,
  total_amount numeric(12,2) not null,
  delivery_fee numeric(10,2) default 0,
  vat_amount numeric(10,2) default 0,
  grand_total numeric(12,2) not null,
  status text not null default 'pending_payment',
  payment_status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_spare_part_orders_customer on public.spare_part_orders(customer_id);
create index if not exists idx_spare_part_orders_status on public.spare_part_orders(status);

create table if not exists public.spare_part_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.spare_part_orders(id) on delete cascade,
  part_id uuid references public.spare_parts(id) on delete set null,
  description text not null,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null,
  total_price numeric(12,2) not null
);

create table if not exists public.spare_part_status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.spare_part_requests(id) on delete cascade,
  order_id uuid references public.spare_part_orders(id) on delete cascade,
  status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

-- DELIVERY TABLES

create table if not exists public.delivery_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  slug text not null unique,
  logo_url text,
  phone text,
  email text,
  website text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_provider_users (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.delivery_providers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  name text not null,
  name_ar text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  slug text not null unique,
  description text,
  estimated_days_min integer,
  estimated_days_max integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_pricing_rules (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references public.delivery_providers(id) on delete cascade,
  zone_id uuid references public.delivery_zones(id) on delete cascade,
  method_id uuid references public.delivery_methods(id) on delete cascade,
  base_fee numeric(10,2) not null default 0,
  fee_per_km numeric(10,4) default 0,
  free_threshold numeric(10,2),
  weight_fee_per_kg numeric(10,4) default 0,
  min_fee numeric(10,2),
  max_fee numeric(10,2),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text,
  city_id uuid references public.cities(id) on delete set null,
  district_id uuid references public.districts(id) on delete set null,
  address text not null,
  address_ar text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_delivery_addresses_user on public.delivery_addresses(user_id);

create table if not exists public.delivery_orders (
  id uuid primary key default gen_random_uuid(),
  order_id uuid, -- generic order reference
  order_type text not null,
  provider_id uuid references public.delivery_providers(id) on delete set null,
  method_id uuid references public.delivery_methods(id) on delete set null,
  pickup_address_id uuid references public.delivery_addresses(id) on delete set null,
  delivery_address_id uuid references public.delivery_addresses(id) on delete set null,
  status text not null default 'pending',
  tracking_number text,
  estimated_delivery_date timestamptz,
  actual_delivery_date timestamptz,
  delivery_fee numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_delivery_orders_status on public.delivery_orders(status);
create index if not exists idx_delivery_orders_provider on public.delivery_orders(provider_id);
create index if not exists idx_delivery_orders_tracking on public.delivery_orders(tracking_number);

create table if not exists public.delivery_tracking_events (
  id uuid primary key default gen_random_uuid(),
  delivery_order_id uuid not null references public.delivery_orders(id) on delete cascade,
  status text not null,
  location text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_delivery_tracking_events_order on public.delivery_tracking_events(delivery_order_id);

create table if not exists public.delivery_status_history (
  id uuid primary key default gen_random_uuid(),
  delivery_order_id uuid not null references public.delivery_orders(id) on delete cascade,
  status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);
