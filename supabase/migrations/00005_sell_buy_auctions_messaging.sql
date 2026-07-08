-- Sell/Buy, Auctions & Messaging Tables

create table if not exists public.sell_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  status text not null default 'draft',
  notes text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_sell_requests_updated_at
  before update on public.sell_requests
  for each row execute function public.handle_updated_at();

create index if not exists idx_sell_requests_user on public.sell_requests(user_id);

create table if not exists public.purchase_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  message text,
  proposed_price numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_purchase_requests_updated_at
  before update on public.purchase_requests
  for each row execute function public.handle_updated_at();

create index if not exists idx_purchase_requests_listing on public.purchase_requests(listing_id);
create index if not exists idx_purchase_requests_buyer on public.purchase_requests(buyer_id);

create table if not exists public.viewing_appointments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  requester_id uuid not null references auth.users(id) on delete cascade,
  appointment_date timestamptz not null,
  location text,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_viewing_appointments_updated_at
  before update on public.viewing_appointments
  for each row execute function public.handle_updated_at();

create table if not exists public.instant_buy_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_vehicle_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  make text,
  model text,
  year_from integer,
  year_to integer,
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  description text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.request_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.customer_vehicle_requests(id) on delete cascade,
  dealer_id uuid,
  offerer_id uuid not null references auth.users(id) on delete cascade,
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.request_offer_items (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.request_offers(id) on delete cascade,
  listing_id uuid references public.vehicle_listings(id) on delete set null,
  description text not null,
  price numeric(12,2) not null,
  created_at timestamptz not null default now()
);

-- AUCTIONS

create table if not exists public.auctions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_ar text,
  slug text not null unique,
  auction_type text not null default 'public',
  status text not null default 'draft',
  start_price numeric(12,2) not null,
  reserve_price numeric(12,2),
  buy_now_price numeric(12,2),
  bid_increment numeric(12,2) not null default 100,
  participation_fee numeric(12,2),
  deposit_amount numeric(12,2),
  start_time timestamptz not null,
  end_time timestamptz not null,
  extended_duration_minutes integer default 0,
  seller_id uuid not null references auth.users(id) on delete cascade,
  dealer_id uuid,
  winner_id uuid references auth.users(id) on delete set null,
  winning_bid numeric(12,2),
  commission_amount numeric(12,2),
  commission_percentage numeric(5,2),
  terms text,
  terms_ar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_auctions_updated_at
  before update on public.auctions
  for each row execute function public.handle_updated_at();

create index if not exists idx_auctions_status on public.auctions(status);
create index if not exists idx_auctions_type on public.auctions(auction_type);
create index if not exists idx_auctions_seller on public.auctions(seller_id);
create index if not exists idx_auctions_start_time on public.auctions(start_time);

create table if not exists public.auction_vehicles (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(auction_id, listing_id)
);

create table if not exists public.auction_bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  bidder_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null,
  is_winning boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_auction_bids_auction on public.auction_bids(auction_id);
create index if not exists idx_auction_bids_bidder on public.auction_bids(bidder_id);
create index if not exists idx_auction_bids_amount on public.auction_bids(auction_id, amount desc);

create table if not exists public.auction_watchers (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(auction_id, user_id)
);

create table if not exists public.auction_rules (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  rule_key text not null,
  rule_value jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.auction_results (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  winner_id uuid references auth.users(id) on delete set null,
  winning_bid numeric(12,2),
  status text not null default 'pending',
  payment_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.auction_status_history (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

-- MESSAGING

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.vehicle_listings(id) on delete set null,
  order_id uuid,
  part_request_id uuid,
  subject text,
  is_flagged boolean not null default false,
  is_moderated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  last_read_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(conversation_id, user_id)
);

create index if not exists idx_conversation_participants_user on public.conversation_participants(user_id);
create index if not exists idx_conversation_participants_conversation on public.conversation_participants(conversation_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  message_type text not null default 'text',
  is_edited boolean not null default false,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation on public.messages(conversation_id);
create index if not exists idx_messages_sender on public.messages(sender_id);
create index if not exists idx_messages_created on public.messages(conversation_id, created_at);

create table if not exists public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  file_url text not null,
  file_type text not null,
  file_size integer,
  created_at timestamptz not null default now()
);

create table if not exists public.message_read_receipts (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  unique(message_id, user_id)
);

create table if not exists public.moderation_flags (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references public.messages(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete cascade,
  flagged_by uuid references auth.users(id) on delete set null,
  reason text not null,
  status text not null default 'pending',
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
