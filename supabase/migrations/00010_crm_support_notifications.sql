-- CRM Tables

create table if not exists public.crm_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assigned_to uuid references auth.users(id) on delete set null,
  tags jsonb default '[]',
  notes text,
  last_contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_notes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.crm_customers(id) on delete cascade,
  added_by uuid not null references auth.users(id) on delete cascade,
  content text not null,
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_timeline (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  description text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_customer_timeline_user on public.customer_timeline(user_id);
create index if not exists idx_customer_timeline_created on public.customer_timeline(created_at desc);

-- SUPPORT TABLES

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  category text,
  priority text not null default 'normal',
  status text not null default 'open',
  assigned_to uuid references auth.users(id) on delete set null,
  reference_type text,
  reference_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_support_tickets_user on public.support_tickets(user_id);
create index if not exists idx_support_tickets_status on public.support_tickets(status);
create index if not exists idx_support_tickets_assigned on public.support_tickets(assigned_to);
create index if not exists idx_support_tickets_priority on public.support_tickets(priority);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.ticket_attachments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.support_tickets(id) on delete cascade,
  message_id uuid references public.ticket_messages(id) on delete cascade,
  file_url text not null,
  file_type text not null,
  file_size integer,
  created_at timestamptz not null default now()
);

-- NOTIFICATIONS

create table if not exists public.notification_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  title_ar text,
  body text not null,
  body_ar text,
  channels jsonb not null default '["in_app"]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.internal_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  title_ar text,
  body text not null,
  body_ar text,
  type text not null default 'info',
  reference_type text,
  reference_id text,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_internal_notifications_user on public.internal_notifications(user_id);
create index if not exists idx_internal_notifications_read on public.internal_notifications(user_id, is_read);
create index if not exists idx_internal_notifications_created on public.internal_notifications(created_at desc);

create table if not exists public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid references public.internal_notifications(id) on delete cascade,
  channel text not null,
  status text not null default 'pending',
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

-- EMPLOYEE MANAGEMENT

create table if not exists public.employee_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null,
  target_value numeric(12,2) not null,
  achieved_value numeric(12,2) default 0,
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employee_commissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_id uuid references public.payment_transactions(id) on delete set null,
  amount numeric(12,2) not null,
  commission_type text not null,
  status text not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.task_assignments (
  id uuid primary key default gen_random_uuid(),
  assigned_by uuid not null references auth.users(id) on delete cascade,
  assigned_to uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  due_date timestamptz,
  priority text not null default 'normal',
  status text not null default 'pending',
  reference_type text,
  reference_id text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.report_exports (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null references auth.users(id) on delete cascade,
  report_type text not null,
  filters jsonb,
  format text not null default 'csv',
  status text not null default 'pending',
  file_url text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- SPARE PART SUPPLIER TO PARTS RELATION (M2M)
create table if not exists public.spare_part_supplier_parts (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.spare_part_suppliers(id) on delete cascade,
  part_id uuid not null references public.spare_parts(id) on delete cascade,
  price numeric(12,2),
  stock_quantity integer default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(supplier_id, part_id)
);
