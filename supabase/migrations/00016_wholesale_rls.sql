-- RLS for wholesale tables

alter table public.wholesale_requests enable row level security;
alter table public.wholesale_request_items enable row level security;
alter table public.wholesale_offers enable row level security;
alter table public.wholesale_offer_items enable row level security;
alter table public.wholesale_contracts enable row level security;
alter table public.wholesale_status_history enable row level security;

-- Wholesale requests: dealer can see own, admin can see all
create policy "wr_select" on public.wholesale_requests
  for select using (
    dealer_id in (select id from public.dealers where owner_id = auth.uid())
    or exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner'))
  );
create policy "wr_insert" on public.wholesale_requests
  for insert with check (dealer_id in (select id from public.dealers where owner_id = auth.uid()));
create policy "wr_update" on public.wholesale_requests
  for update using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));

-- Request items: same as parent
create policy "wri_select" on public.wholesale_request_items
  for select using (exists (select 1 from public.wholesale_requests wr
    join public.dealers d on d.id = wr.dealer_id
    where wr.id = request_id and (d.owner_id = auth.uid() or exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')))));
create policy "wri_insert" on public.wholesale_request_items
  for insert with check (exists (select 1 from public.wholesale_requests wr
    join public.dealers d on d.id = wr.dealer_id
    where wr.id = request_id and d.owner_id = auth.uid()));

-- Offers: offerer can see own, admins all
create policy "wo_select" on public.wholesale_offers
  for select using (
    offerer_id = auth.uid()
    or exists (select 1 from public.wholesale_requests wr
      join public.dealers d on d.id = wr.dealer_id
      where wr.id = request_id and (d.owner_id = auth.uid() or exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner'))))
  );
create policy "wo_insert" on public.wholesale_offers
  for insert with check (offerer_id = auth.uid());
create policy "wo_update" on public.wholesale_offers
  for update using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));

-- Contracts: involved parties see
create policy "wc_select" on public.wholesale_contracts
  for select using (
    dealer_id in (select id from public.dealers where owner_id = auth.uid())
    or supplier_id = auth.uid()
    or exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner'))
  );
create policy "wc_insert" on public.wholesale_contracts
  for insert with check (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));
