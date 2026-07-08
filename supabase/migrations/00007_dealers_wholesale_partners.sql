-- Dealer Tables

create table if not exists public.dealers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  name_ar text,
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
  is_approved boolean not null default false,
  rating numeric(3,2) default 0,
  review_count integer not null default 0,
  trust_badge text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_dealers_updated_at
  before update on public.dealers
  for each row execute function public.handle_updated_at();

create index if not exists idx_dealers_owner on public.dealers(owner_id);
create index if not exists idx_dealers_slug on public.dealers(slug);
create index if not exists idx_dealers_city on public.dealers(city_id);

-- Add FK from vehicle_listings to dealers
alter table public.vehicle_listings
  add constraint fk_vehicle_listings_dealer
  foreign key (dealer_id) references public.dealers(id) on delete set null;

alter table public.auctions
  add constraint fk_auctions_dealer
  foreign key (dealer_id) references public.dealers(id) on delete set null;

create table if not exists public.dealer_branches (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  name text not null,
  name_ar text,
  phone text,
  city_id uuid references public.cities(id) on delete set null,
  address text,
  address_ar text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.dealer_users (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'employee',
  permissions jsonb default '[]',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(dealer_id, user_id)
);

create table if not exists public.dealer_subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  slug text not null unique,
  description text,
  price_monthly numeric(10,2) not null default 0,
  price_yearly numeric(10,2),
  max_listings integer,
  max_staff integer,
  max_branches integer,
  has_analytics boolean not null default false,
  has_wholesale boolean not null default false,
  has_auctions boolean not null default false,
  has_parts boolean not null default false,
  has_delivery boolean not null default false,
  has_featured boolean not null default false,
  has_api boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.dealer_subscriptions (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  plan_id uuid not null references public.dealer_subscription_plans(id) on delete cascade,
  status text not null default 'active',
  start_date timestamptz not null default now(),
  end_date timestamptz,
  auto_renew boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dealer_pages (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  about text,
  about_ar text,
  working_hours jsonb,
  services jsonb default '[]',
  social_links jsonb default '{}',
  seo_title text,
  seo_description text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dealer_inventory (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  stock_number text,
  purchase_price numeric(12,2),
  status text not null default 'in_stock',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(dealer_id, listing_id)
);

create table if not exists public.dealer_financial_rules (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  commission_percentage numeric(5,2),
  commission_fixed numeric(10,2),
  deposit_percentage numeric(5,2),
  payment_terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dealer_stats (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  date date not null,
  listings_count integer not null default 0,
  views_count integer not null default 0,
  inquiries_count integer not null default 0,
  sales_count integer not null default 0,
  revenue numeric(12,2) default 0,
  created_at timestamptz not null default now(),
  unique(dealer_id, date)
);

create table if not exists public.dealer_ratings (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  review text,
  created_at timestamptz not null default now(),
  unique(dealer_id, user_id)
);

create table if not exists public.dealer_trust_badges (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  badge_type text not null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- WHOLESALE

create table if not exists public.wholesale_requests (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  requester_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'open',
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  deadline timestamptz,
  delivery_city_id uuid references public.cities(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wholesale_request_items (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.wholesale_requests(id) on delete cascade,
  make_id uuid references public.car_makes(id) on delete set null,
  model_id uuid references public.car_models(id) on delete set null,
  year_from integer,
  year_to integer,
  quantity integer not null default 1,
  condition text,
  mileage_max integer,
  color text,
  notes text
);

create table if not exists public.wholesale_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.wholesale_requests(id) on delete cascade,
  offerer_id uuid not null references auth.users(id) on delete cascade,
  notes text,
  total_price numeric(12,2) not null,
  validity_days integer default 7,
  deposit_required numeric(12,2),
  estimated_delivery_days integer,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wholesale_offer_items (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.wholesale_offers(id) on delete cascade,
  description text not null,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null,
  total_price numeric(12,2) not null,
  source_type text,
  notes text
);

create table if not exists public.wholesale_contracts (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.wholesale_requests(id) on delete cascade,
  offer_id uuid not null references public.wholesale_offers(id) on delete cascade,
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  supplier_id uuid not null references auth.users(id) on delete cascade,
  total_amount numeric(12,2) not null,
  deposit_amount numeric(12,2),
  status text not null default 'draft',
  signed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wholesale_status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.wholesale_requests(id) on delete cascade,
  offer_id uuid references public.wholesale_offers(id) on delete cascade,
  status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

-- FINANCE PARTNERS

create table if not exists public.finance_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  logo_url text,
  description text,
  description_ar text,
  is_active boolean not null default true,
  revenue_model text not null default 'per_lead',
  revenue_per_lead numeric(10,2),
  revenue_percentage numeric(5,2),
  revenue_per_approved numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_partner_users (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.finance_partners(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.finance_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.vehicle_listings(id) on delete set null,
  customer_id uuid not null references auth.users(id) on delete cascade,
  partner_id uuid references public.finance_partners(id) on delete set null,
  vehicle_price numeric(12,2) not null,
  down_payment numeric(12,2),
  requested_amount numeric(12,2),
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.finance_requests(id) on delete cascade,
  partner_id uuid not null references public.finance_partners(id) on delete cascade,
  monthly_payment numeric(10,2),
  interest_rate numeric(5,2),
  term_months integer,
  approved_amount numeric(12,2),
  status text not null default 'pending',
  notes text,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.finance_requests(id) on delete cascade,
  status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

-- INSURANCE PARTNERS (future-ready)

create table if not exists public.insurance_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  logo_url text,
  description text,
  description_ar text,
  is_active boolean not null default true,
  revenue_model text not null default 'per_lead',
  revenue_per_lead numeric(10,2),
  revenue_percentage numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.insurance_partner_users (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.insurance_partners(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.insurance_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.vehicle_listings(id) on delete set null,
  customer_id uuid not null references auth.users(id) on delete cascade,
  partner_id uuid references public.insurance_partners(id) on delete set null,
  vehicle_price numeric(12,2),
  insurance_type text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.insurance_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.insurance_requests(id) on delete cascade,
  partner_id uuid not null references public.insurance_partners(id) on delete cascade,
  premium numeric(10,2) not null,
  coverage_details jsonb,
  status text not null default 'pending',
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ADVERTISERS

create table if not exists public.advertisers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.advertiser_users (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references public.advertisers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references public.advertisers(id) on delete cascade,
  name text not null,
  type text not null,
  placement text not null,
  budget numeric(10,2),
  spent numeric(10,2) default 0,
  start_date timestamptz,
  end_date timestamptz,
  status text not null default 'draft',
  media_url text,
  target_url text,
  impressions_target integer,
  clicks_target integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ad_placements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ad_impressions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.ad_campaigns(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);

create table if not exists public.ad_clicks (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.ad_campaigns(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);

create table if not exists public.sponsorship_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  slug text not null unique,
  price numeric(10,2) not null,
  duration_days integer not null,
  description text,
  features jsonb default '[]',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
