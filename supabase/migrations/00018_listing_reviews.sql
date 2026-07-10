-- Listing Reviews table, RLS, and auto-update trigger

create table if not exists public.listing_reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  review text,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  unique(listing_id, user_id)
);

alter table public.listing_reviews enable row level security;

create policy "listing_reviews_select" on public.listing_reviews
  for select using (true);

create policy "listing_reviews_insert" on public.listing_reviews
  for insert with check (auth.uid() = user_id);

create policy "listing_reviews_update" on public.listing_reviews
  for update using (auth.uid() = user_id);

-- Add aggregate columns to vehicle_listings
alter table public.vehicle_listings
  add column if not exists avg_rating numeric(3,2) not null default 0;

alter table public.vehicle_listings
  add column if not exists review_count integer not null default 0;

-- Function to auto-update listing rating
create or replace function public.update_listing_rating()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.vehicle_listings
  set
    avg_rating = (select coalesce(avg(rating)::numeric(3,2), 0) from public.listing_reviews where listing_id = coalesce(new.listing_id, old.listing_id)),
    review_count = (select count(*) from public.listing_reviews where listing_id = coalesce(new.listing_id, old.listing_id))
  where id = coalesce(new.listing_id, old.listing_id);
  return new;
end;
$$;

create trigger trg_listing_rating_upsert
  after insert or update on public.listing_reviews
  for each row execute function public.update_listing_rating();

create trigger trg_listing_rating_delete
  after delete on public.listing_reviews
  for each row execute function public.update_listing_rating();
