-- GEO Tables
create table if not exists public.countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  code text not null unique,
  phone_code text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.countries(id) on delete cascade,
  name text not null,
  name_ar text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references public.regions(id) on delete cascade,
  name text not null,
  name_ar text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_cities_region on public.cities(region_id);

create table if not exists public.districts (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  name text not null,
  name_ar text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_districts_city on public.districts(city_id);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references public.cities(id) on delete set null,
  district_id uuid references public.districts(id) on delete set null,
  address text,
  address_ar text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  created_at timestamptz not null default now()
);

create table if not exists public.service_zones (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  name text not null,
  name_ar text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
