-- RLS Policies for Advertising System
-- Ad tables were created without policies after RLS was enabled

-- ============ AD PLACEMENTS ============
create policy "ad_placements_select" on public.ad_placements
  for select using (true);

-- ============ ADVERTISERS ============
create policy "advertisers_select" on public.advertisers
  for select using (true);

-- ============ AD CAMPAIGNS ============
create policy "ad_campaigns_select" on public.ad_campaigns
  for select using (status = 'active' or public.has_permission('edit_vehicles'));

-- ============ AD CLICKS ============
create policy "ad_clicks_insert" on public.ad_clicks
  for insert with check (true);

create policy "ad_clicks_select" on public.ad_clicks
  for select using (public.has_permission('edit_vehicles'));

-- ============ AD IMPRESSIONS ============
create policy "ad_impressions_insert" on public.ad_impressions
  for insert with check (true);

create policy "ad_impressions_select" on public.ad_impressions
  for select using (public.has_permission('edit_vehicles'));

-- ============ ADVERTISER USERS ============
create policy "advertiser_users_select" on public.advertiser_users
  for select using (user_id = auth.uid() or public.has_permission('edit_vehicles'));
