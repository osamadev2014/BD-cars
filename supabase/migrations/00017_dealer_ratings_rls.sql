-- RLS for dealer_ratings

alter table public.dealer_ratings enable row level security;

create policy "dealer_ratings_select" on public.dealer_ratings
  for select using (true);

create policy "dealer_ratings_insert" on public.dealer_ratings
  for insert with check (auth.uid() = user_id);

create policy "dealer_ratings_update" on public.dealer_ratings
  for update using (auth.uid() = user_id);

-- Function to auto-update dealer rating
create or replace function public.update_dealer_rating()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.dealers
  set
    rating = (select coalesce(avg(rating)::numeric(3,2), 0) from public.dealer_ratings where dealer_id = coalesce(new.dealer_id, old.dealer_id)),
    review_count = (select count(*) from public.dealer_ratings where dealer_id = coalesce(new.dealer_id, old.dealer_id))
  where id = coalesce(new.dealer_id, old.dealer_id);
  return new;
end;
$$;

create trigger trg_dealer_rating_upsert
  after insert or update on public.dealer_ratings
  for each row execute function public.update_dealer_rating();

create trigger trg_dealer_rating_delete
  after delete on public.dealer_ratings
  for each row execute function public.update_dealer_rating();
