-- Financial Tables

create table if not exists public.payment_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  is_sandbox boolean not null default true,
  config jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text not null,
  slug text not null unique,
  provider_id uuid references public.payment_providers(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_method_id uuid references public.payment_methods(id) on delete set null,
  amount numeric(12,2) not null,
  fee_amount numeric(10,2) default 0,
  vat_amount numeric(10,2) default 0,
  total_amount numeric(12,2) not null,
  currency text not null default 'SAR',
  status text not null default 'pending',
  reference_id text, -- payment provider reference
  description text,
  entity_type text,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payment_transactions_user on public.payment_transactions(user_id);
create index if not exists idx_payment_transactions_status on public.payment_transactions(status);
create index if not exists idx_payment_transactions_entity on public.payment_transactions(entity_type, entity_id);
create index if not exists idx_payment_transactions_reference on public.payment_transactions(reference_id);

create table if not exists public.payment_status_history (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.payment_transactions(id) on delete cascade,
  status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.wallet_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  balance numeric(12,2) not null default 0,
  currency text not null default 'SAR',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallet_accounts(id) on delete cascade,
  transaction_type text not null,
  amount numeric(12,2) not null,
  balance_before numeric(12,2) not null,
  balance_after numeric(12,2) not null,
  reference_type text,
  reference_id text,
  description text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_wallet_transactions_wallet on public.wallet_transactions(wallet_id);
create index if not exists idx_wallet_transactions_type on public.wallet_transactions(transaction_type);
create index if not exists idx_wallet_transactions_created on public.wallet_transactions(created_at desc);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  invoice_type text not null,
  status text not null default 'draft',
  subtotal numeric(12,2) not null,
  discount_amount numeric(10,2) default 0,
  vat_percentage numeric(5,2) not null default 15,
  vat_amount numeric(10,2) not null,
  total_amount numeric(12,2) not null,
  currency text not null default 'SAR',
  notes text,
  due_date timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_invoices_user on public.invoices(user_id);
create index if not exists idx_invoices_number on public.invoices(invoice_number);
create index if not exists idx_invoices_status on public.invoices(status);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  description_ar text,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null,
  total_price numeric(12,2) not null,
  reference_type text,
  reference_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.commission_rules (
  id uuid primary key default gen_random_uuid(),
  rule_type text not null,
  name text not null,
  description text,
  percentage numeric(5,2),
  fixed_amount numeric(10,2),
  min_amount numeric(10,2),
  max_amount numeric(10,2),
  applies_to text, -- seller/buyer/both
  category text,
  is_active boolean not null default true,
  priority integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null, -- percentage/fixed
  discount_value numeric(10,2) not null,
  min_order_amount numeric(10,2),
  max_uses integer,
  used_count integer not null default 0,
  max_uses_per_user integer default 1,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_id uuid references public.payment_transactions(id) on delete set null,
  discount_amount numeric(10,2) not null,
  created_at timestamptz not null default now(),
  unique(coupon_id, user_id)
);
