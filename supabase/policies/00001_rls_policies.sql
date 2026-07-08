-- =============================================
-- Ryon Platform - RLS Policies
-- =============================================

-- Helper function: check if user has a specific permission
create or replace function public.has_permission(permission_slug text)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on rp.role_id = ur.role_id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = auth.uid()
    and p.slug = permission_slug
  );
end;
$$;

-- Helper function: check if user has a specific role
create or replace function public.has_role(role_slug text)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
    and r.slug = role_slug
  );
end;
$$;

-- ============ PROFILES ============
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.has_permission('view_customers'));

create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.has_permission('edit_customers'));

-- ============ ROLES ============
alter table public.roles enable row level security;

create policy "roles_select_all" on public.roles
  for select using (true);

create policy "roles_insert" on public.roles
  for insert with check (public.has_permission('create_roles'));

create policy "roles_update" on public.roles
  for update using (public.has_permission('edit_roles'));

create policy "roles_delete" on public.roles
  for delete using (public.has_permission('delete_roles'));

-- ============ PERMISSIONS ============
alter table public.permissions enable row level security;

create policy "permissions_select_all" on public.permissions
  for select using (true);

-- ============ ROLE_PERMISSIONS ============
alter table public.role_permissions enable row level security;

create policy "role_permissions_select" on public.role_permissions
  for select using (public.has_permission('view_roles'));

create policy "role_permissions_insert" on public.role_permissions
  for insert with check (public.has_permission('edit_roles'));

create policy "role_permissions_delete" on public.role_permissions
  for delete using (public.has_permission('edit_roles'));

-- ============ USER_ROLES ============
alter table public.user_roles enable row level security;

create policy "user_roles_select_own" on public.user_roles
  for select using (user_id = auth.uid() or public.has_permission('view_roles'));

create policy "user_roles_insert" on public.user_roles
  for insert with check (public.has_permission('assign_roles'));

create policy "user_roles_delete" on public.user_roles
  for delete using (public.has_permission('assign_roles'));

-- ============ LOGIN EVENTS ============
alter table public.login_events enable row level security;

create policy "login_events_select_admin" on public.login_events
  for select using (public.has_permission('view_audit'));

create policy "login_events_insert" on public.login_events
  for insert with check (true); -- system inserts

-- ============ AUDIT LOGS ============
alter table public.audit_logs enable row level security;

create policy "audit_logs_select" on public.audit_logs
  for select using (public.has_permission('view_audit'));

create policy "audit_logs_insert" on public.audit_logs
  for insert with check (true); -- system inserts

-- ============ APP SETTINGS ============
alter table public.app_settings enable row level security;

create policy "app_settings_select_public" on public.app_settings
  for select using (is_public = true or public.has_permission('view_settings'));

create policy "app_settings_update" on public.app_settings
  for update using (public.has_permission('edit_settings'));

-- ============ SETTINGS HISTORY ============
alter table public.settings_history enable row level security;

create policy "settings_history_select" on public.settings_history
  for select using (public.has_permission('view_audit'));

create policy "settings_history_insert" on public.settings_history
  for insert with check (true); -- system inserts

-- ============ STAFF PROFILES ============
alter table public.staff_profiles enable row level security;

create policy "staff_profiles_select_admin" on public.staff_profiles
  for select using (public.has_permission('view_customers'));

create policy "staff_profiles_insert" on public.staff_profiles
  for insert with check (public.has_permission('edit_customers'));

-- ============ GEO TABLES (public read) ============
alter table public.countries enable row level security;
alter table public.regions enable row level security;
alter table public.cities enable row level security;
alter table public.districts enable row level security;
alter table public.locations enable row level security;
alter table public.service_zones enable row level security;

create policy "geo_select_all" on public.countries for select using (true);
create policy "geo_select_all" on public.regions for select using (true);
create policy "geo_select_all" on public.cities for select using (true);
create policy "geo_select_all" on public.districts for select using (true);
create policy "geo_select_all" on public.locations for select using (true);
create policy "geo_select_all" on public.service_zones for select using (true);

-- ============ VEHICLE MASTER DATA (public read) ============
alter table public.body_types enable row level security;
alter table public.fuel_types enable row level security;
alter table public.transmission_types enable row level security;
alter table public.drivetrain_types enable row level security;
alter table public.car_colors enable row level security;
alter table public.car_makes enable row level security;
alter table public.car_models enable row level security;
alter table public.car_generations enable row level security;
alter table public.car_trims enable row level security;
alter table public.car_specs enable row level security;
alter table public.vehicle_condition_types enable row level security;
alter table public.vehicle_statuses enable row level security;

create policy "master_data_select" on public.body_types for select using (true);
create policy "master_data_select" on public.fuel_types for select using (true);
create policy "master_data_select" on public.transmission_types for select using (true);
create policy "master_data_select" on public.drivetrain_types for select using (true);
create policy "master_data_select" on public.car_colors for select using (true);
create policy "master_data_select" on public.car_makes for select using (true);
create policy "master_data_select" on public.car_models for select using (true);
create policy "master_data_select" on public.car_generations for select using (true);
create policy "master_data_select" on public.car_trims for select using (true);
create policy "master_data_select" on public.car_specs for select using (true);
create policy "master_data_select" on public.vehicle_condition_types for select using (true);
create policy "master_data_select" on public.vehicle_statuses for select using (true);

-- ============ VEHICLES ============
alter table public.vehicles enable row level security;

create policy "vehicles_select" on public.vehicles
  for select using (
    owner_id = auth.uid()
    or public.has_permission('view_vehicles')
    or exists (
      select 1 from public.vehicle_listings vl
      where vl.vehicle_id = vehicles.id
      and vl.status in ('published', 'published_with_trusted_badge', 'reserved')
    )
  );

create policy "vehicles_insert" on public.vehicles
  for insert with check (owner_id = auth.uid());

create policy "vehicles_update" on public.vehicles
  for update using (owner_id = auth.uid() or public.has_permission('edit_vehicles'));

create policy "vehicles_delete" on public.vehicles
  for delete using (owner_id = auth.uid() or public.has_permission('delete_vehicles'));

-- ============ VEHICLE IMAGES ============
alter table public.vehicle_images enable row level security;

create policy "vehicle_images_select" on public.vehicle_images
  for select using (true); -- images linked to published listings

create policy "vehicle_images_insert" on public.vehicle_images
  for insert with check (
    exists (select 1 from public.vehicles where id = vehicle_id and owner_id = auth.uid())
    or public.has_permission('edit_vehicles')
  );

create policy "vehicle_images_delete" on public.vehicle_images
  for delete using (
    exists (select 1 from public.vehicles where id = vehicle_id and owner_id = auth.uid())
    or public.has_permission('delete_vehicles')
  );

-- ============ VEHICLE VIDEOS ============
alter table public.vehicle_videos enable row level security;
alter table public.vehicle_documents enable row level security;

create policy "vehicle_videos_select" on public.vehicle_videos for select using (true);
create policy "vehicle_documents_select" on public.vehicle_documents for select using (true);

-- ============ VEHICLE STATUS HISTORY ============
alter table public.vehicle_status_history enable row level security;

create policy "vehicle_status_history_select" on public.vehicle_status_history
  for select using (public.has_permission('view_vehicles'));

-- ============ VEHICLE PRICE HISTORY ============
alter table public.vehicle_price_history enable row level security;

create policy "vehicle_price_history_select" on public.vehicle_price_history
  for select using (public.has_permission('view_finance'));

-- ============ VEHICLE LISTINGS ============
alter table public.vehicle_listings enable row level security;

create policy "vehicle_listings_select" on public.vehicle_listings
  for select using (
    seller_id = auth.uid()
    or public.has_permission('view_vehicles')
    or status in ('published', 'published_with_trusted_badge', 'reserved')
  );

create policy "vehicle_listings_insert" on public.vehicle_listings
  for insert with check (seller_id = auth.uid());

create policy "vehicle_listings_update" on public.vehicle_listings
  for update using (seller_id = auth.uid() or public.has_permission('edit_listings'));

create policy "vehicle_listings_delete" on public.vehicle_listings
  for delete using (seller_id = auth.uid() or public.has_permission('suspend_listings'));

-- ============ LISTING STATUS HISTORY ============
alter table public.listing_status_history enable row level security;

create policy "listing_status_history_select" on public.listing_status_history
  for select using (public.has_permission('view_vehicles'));

-- ============ LISTING APPROVALS ============
alter table public.listing_approval_requests enable row level security;

create policy "listing_approvals_select" on public.listing_approval_requests
  for select using (
    requested_by = auth.uid()
    or public.has_permission('approve_listings')
  );

create policy "listing_approvals_insert" on public.listing_approval_requests
  for insert with check (requested_by = auth.uid());

-- ============ LISTING CHANGE REQUESTS ============
alter table public.listing_change_requests enable row level security;

create policy "listing_changes_select" on public.listing_change_requests
  for select using (
    requested_by = auth.uid()
    or public.has_permission('approve_listings')
  );

-- ============ VEHICLE VIEWS ============
alter table public.vehicle_views enable row level security;

create policy "vehicle_views_insert" on public.vehicle_views
  for insert with check (auth.uid() is not null);

-- ============ FAVORITES ============
alter table public.favorites enable row level security;

create policy "favorites_select_own" on public.favorites
  for select using (user_id = auth.uid());

create policy "favorites_insert_own" on public.favorites
  for insert with check (user_id = auth.uid());

create policy "favorites_delete_own" on public.favorites
  for delete using (user_id = auth.uid());

-- ============ SAVED SEARCHES ============
alter table public.saved_searches enable row level security;

create policy "saved_searches_select_own" on public.saved_searches
  for select using (user_id = auth.uid());

create policy "saved_searches_insert_own" on public.saved_searches
  for insert with check (user_id = auth.uid());

create policy "saved_searches_update_own" on public.saved_searches
  for update using (user_id = auth.uid());

create policy "saved_searches_delete_own" on public.saved_searches
  for delete using (user_id = auth.uid());

-- ============ AUCTIONS ============
alter table public.auctions enable row level security;

create policy "auctions_select" on public.auctions
  for select using (
    seller_id = auth.uid()
    or public.has_permission('view_auctions')
    or status = 'live'
  );

create policy "auctions_insert" on public.auctions
  for insert with check (seller_id = auth.uid() or public.has_permission('manage_auctions'));

create policy "auctions_update" on public.auctions
  for update using (seller_id = auth.uid() or public.has_permission('manage_auctions'));

-- ============ AUCTION BIDS ============
alter table public.auction_bids enable row level security;

create policy "auction_bids_select" on public.auction_bids
  for select using (bidder_id = auth.uid() or public.has_permission('view_auctions'));

create policy "auction_bids_insert" on public.auction_bids
  for insert with check (bidder_id = auth.uid());

-- ============ CONVERSATIONS ============
alter table public.conversations enable row level security;

create policy "conversations_select_participant" on public.conversations
  for select using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = conversations.id and user_id = auth.uid()
    )
    or public.has_permission('view_tickets')
  );

create policy "conversations_insert" on public.conversations
  for insert with check (auth.uid() is not null);

-- ============ MESSAGES ============
alter table public.messages enable row level security;

create policy "messages_select_participant" on public.messages
  for select using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
    or public.has_permission('view_tickets')
  );

create policy "messages_insert_participant" on public.messages
  for insert with check (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
  );

-- ============ INSPECTION ============
alter table public.inspection_centers enable row level security;
alter table public.inspection_center_branches enable row level security;
alter table public.inspection_center_users enable row level security;
alter table public.inspection_services enable row level security;
alter table public.inspection_service_pricing enable row level security;

create policy "inspection_centers_select" on public.inspection_centers for select using (true);

create policy "inspection_appointments_select" on public.inspection_appointments
  for select using (
    customer_id = auth.uid()
    or exists (select 1 from public.inspection_center_users where center_id = inspection_appointments.center_id and user_id = auth.uid())
    or public.has_permission('view_inspections')
  );

create policy "inspection_appointments_insert" on public.inspection_appointments
  for insert with check (customer_id = auth.uid());

create policy "inspection_reports_select" on public.inspection_reports
  for select using (
    exists (select 1 from public.inspection_appointments where id = inspection_reports.appointment_id and customer_id = auth.uid())
    or inspector_id = auth.uid()
    or public.has_permission('view_inspections')
  );

-- ============ DEALERS ============
alter table public.dealers enable row level security;

create policy "dealers_select" on public.dealers
  for select using (true); -- public pages

create policy "dealers_insert" on public.dealers
  for insert with check (owner_id = auth.uid());

create policy "dealers_update" on public.dealers
  for update using (owner_id = auth.uid() or public.has_permission('approve_dealers'));

-- ============ DEALER USERS ============
alter table public.dealer_users enable row level security;

create policy "dealer_users_select" on public.dealer_users
  for select using (
    user_id = auth.uid()
    or exists (select 1 from public.dealers where id = dealer_users.dealer_id and owner_id = auth.uid())
  );

-- ============ FINANCIAL TABLES ============
alter table public.payment_transactions enable row level security;

create policy "payment_transactions_select_own" on public.payment_transactions
  for select using (user_id = auth.uid() or public.has_permission('view_finance'));

create policy "payment_transactions_insert" on public.payment_transactions
  for insert with check (user_id = auth.uid());

-- ============ WALLET ============
alter table public.wallet_accounts enable row level security;

create policy "wallet_select_own" on public.wallet_accounts
  for select using (user_id = auth.uid() or public.has_permission('view_finance'));

alter table public.wallet_transactions enable row level security;

create policy "wallet_transactions_select_own" on public.wallet_transactions
  for select using (
    exists (select 1 from public.wallet_accounts where id = wallet_transactions.wallet_id and user_id = auth.uid())
    or public.has_permission('view_finance')
  );

-- ============ INVOICES ============
alter table public.invoices enable row level security;

create policy "invoices_select_own" on public.invoices
  for select using (user_id = auth.uid() or public.has_permission('view_finance'));

-- ============ SUPPORT TICKETS ============
alter table public.support_tickets enable row level security;

create policy "tickets_select_own" on public.support_tickets
  for select using (user_id = auth.uid() or public.has_permission('view_tickets'));

create policy "tickets_insert_own" on public.support_tickets
  for insert with check (user_id = auth.uid());

-- ============ NOTIFICATIONS ============
alter table public.internal_notifications enable row level security;

create policy "notifications_select_own" on public.internal_notifications
  for select using (user_id = auth.uid());

create policy "notifications_update_own" on public.internal_notifications
  for update using (user_id = auth.uid());

-- ============ SPARE PARTS ============
alter table public.spare_parts enable row level security;

create policy "spare_parts_select" on public.spare_parts
  for select using (true); -- public marketplace

create policy "spare_parts_insert" on public.spare_parts
  for insert with check (auth.uid() is not null and public.has_permission('manage_inspections'));

-- ============ SPARE PART REQUESTS ============
alter table public.spare_part_requests enable row level security;

create policy "part_requests_select_own" on public.spare_part_requests
  for select using (customer_id = auth.uid() or public.has_permission('view_tickets'));

create policy "part_requests_insert_own" on public.spare_part_requests
  for insert with check (customer_id = auth.uid());

-- ============ DELIVERY ============
alter table public.delivery_orders enable row level security;

create policy "delivery_orders_select" on public.delivery_orders
  for select using (
    -- Will match based on order type to customer/supplier
    public.has_permission('view_tickets')
    or auth.uid() is not null
  );

-- ============ CRM ============
alter table public.crm_customers enable row level security;

create policy "crm_select" on public.crm_customers
  for select using (public.has_permission('view_customers'));

create policy "crm_update" on public.crm_customers
  for update using (public.has_permission('edit_customers'));
