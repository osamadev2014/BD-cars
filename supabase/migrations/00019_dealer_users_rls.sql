-- RLS for dealer_users — allow dealer owners to manage staff

create policy "dealer_users_insert" on public.dealer_users
  for insert with check (
    exists (select 1 from public.dealers where id = dealer_users.dealer_id and owner_id = auth.uid())
  );

create policy "dealer_users_update" on public.dealer_users
  for update using (
    exists (select 1 from public.dealers where id = dealer_users.dealer_id and owner_id = auth.uid())
  );

create policy "dealer_users_delete" on public.dealer_users
  for delete using (
    exists (select 1 from public.dealers where id = dealer_users.dealer_id and owner_id = auth.uid())
  );
