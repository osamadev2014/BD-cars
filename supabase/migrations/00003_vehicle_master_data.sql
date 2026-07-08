-- Vehicle Master Data

create table if not exists public.body_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.fuel_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.transmission_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.drivetrain_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.car_colors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  hex_code text,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.car_makes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  logo_url text,
  country text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.car_models (
  id uuid primary key default gen_random_uuid(),
  make_id uuid not null references public.car_makes(id) on delete cascade,
  name text not null,
  name_ar text not null,
  slug text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(make_id, slug)
);

create index if not exists idx_car_models_make on public.car_models(make_id);

create table if not exists public.car_generations (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.car_models(id) on delete cascade,
  name text not null,
  name_ar text not null,
  year_start integer not null,
  year_end integer,
  slug text not null,
  created_at timestamptz not null default now(),
  unique(model_id, slug)
);

create index if not exists idx_car_generations_model on public.car_generations(model_id);

create table if not exists public.car_trims (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid references public.car_generations(id) on delete cascade,
  model_id uuid not null references public.car_models(id) on delete cascade,
  name text not null,
  name_ar text not null,
  slug text not null,
  engine_type text,
  engine_size numeric(4,1),
  horsepower integer,
  fuel_type_id uuid references public.fuel_types(id) on delete set null,
  transmission_id uuid references public.transmission_types(id) on delete set null,
  drivetrain_id uuid references public.drivetrain_types(id) on delete set null,
  body_type_id uuid references public.body_types(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(model_id, slug)
);

create index if not exists idx_car_trims_model on public.car_trims(model_id);
create index if not exists idx_car_trims_generation on public.car_trims(generation_id);

create table if not exists public.car_specs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicle_condition_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);
