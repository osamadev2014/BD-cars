-- RLS for coupons: all authenticated users can read active coupons
alter table public.coupons enable row level security;

drop policy if exists "Authenticated users can view active coupons" on public.coupons;
create policy "Authenticated users can view active coupons" on public.coupons
  for select
  to authenticated
  using (is_active = true);

drop policy if exists "Only admins can manage coupons" on public.coupons;
create policy "Only admins can manage coupons" on public.coupons
  for all
  to authenticated
  using (false)
  with check (false);

-- RLS for coupon_redemptions
alter table public.coupon_redemptions enable row level security;

drop policy if exists "Users can view own redemptions" on public.coupon_redemptions;
create policy "Users can view own redemptions" on public.coupon_redemptions
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own redemptions" on public.coupon_redemptions;
create policy "Users can insert own redemptions" on public.coupon_redemptions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow service role full access (admin client bypasses RLS)
