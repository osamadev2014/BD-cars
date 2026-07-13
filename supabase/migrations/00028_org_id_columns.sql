-- =============================================
-- Phase 1: Add org_id to Existing Tables
-- =============================================
-- UP: Add nullable org_id foreign keys to existing entity and business tables
-- DOWN: Drop the org_id column from each table
--
-- IMPORTANT: No tables are dropped or altered destructively. Existing FKs,
-- columns, and data are fully preserved.

-- ============ Entity Tables (type-specific profiles) ============

do $$
begin
  -- Dealers → car_dealer
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'dealers' and column_name = 'org_id') then
    alter table public.dealers add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_dealers_org on public.dealers(org_id);
  end if;

  -- Inspection Centers
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'inspection_centers' and column_name = 'org_id') then
    alter table public.inspection_centers add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_inspection_centers_org on public.inspection_centers(org_id);
  end if;

  -- Finance Partners
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'finance_partners' and column_name = 'org_id') then
    alter table public.finance_partners add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_finance_partners_org on public.finance_partners(org_id);
  end if;

  -- Insurance Partners
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'insurance_partners' and column_name = 'org_id') then
    alter table public.insurance_partners add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_insurance_partners_org on public.insurance_partners(org_id);
  end if;

  -- Advertisers
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'advertisers' and column_name = 'org_id') then
    alter table public.advertisers add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_advertisers_org on public.advertisers(org_id);
  end if;

  -- Spare Part Suppliers
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'spare_part_suppliers' and column_name = 'org_id') then
    alter table public.spare_part_suppliers add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_spare_part_suppliers_org on public.spare_part_suppliers(org_id);
  end if;

  -- Delivery Providers
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'delivery_providers' and column_name = 'org_id') then
    alter table public.delivery_providers add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_delivery_providers_org on public.delivery_providers(org_id);
  end if;
end $$;

-- ============ Business Tables (owned by organizations) ============

do $$
begin
  -- Vehicle listings
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'vehicle_listings' and column_name = 'org_id') then
    alter table public.vehicle_listings add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_vehicle_listings_org on public.vehicle_listings(org_id);
  end if;

  -- Vehicles
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'vehicles' and column_name = 'org_id') then
    alter table public.vehicles add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_vehicles_org on public.vehicles(org_id);
  end if;

  -- Auctions
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'auctions' and column_name = 'org_id') then
    alter table public.auctions add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_auctions_org on public.auctions(org_id);
  end if;

  -- Ad campaigns
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'ad_campaigns' and column_name = 'org_id') then
    alter table public.ad_campaigns add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_ad_campaigns_org on public.ad_campaigns(org_id);
  end if;

  -- Inspection appointments
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'inspection_appointments' and column_name = 'org_id') then
    alter table public.inspection_appointments add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_inspection_appointments_org on public.inspection_appointments(org_id);
  end if;

  -- Inspection reports
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'inspection_reports' and column_name = 'org_id') then
    alter table public.inspection_reports add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_inspection_reports_org on public.inspection_reports(org_id);
  end if;

  -- Finance offers (created by finance companies)
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'finance_offers' and column_name = 'org_id') then
    alter table public.finance_offers add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_finance_offers_org on public.finance_offers(org_id);
  end if;

  -- Insurance offers (created by insurance companies)
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'insurance_offers' and column_name = 'org_id') then
    alter table public.insurance_offers add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_insurance_offers_org on public.insurance_offers(org_id);
  end if;

  -- Wholesale requests (created by wholesale vehicle traders)
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'wholesale_requests' and column_name = 'org_id') then
    alter table public.wholesale_requests add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_wholesale_requests_org on public.wholesale_requests(org_id);
  end if;

  -- Spare parts (created by spare part suppliers)
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'spare_parts' and column_name = 'org_id') then
    alter table public.spare_parts add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_spare_parts_org on public.spare_parts(org_id);
  end if;

  -- Delivery orders
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'delivery_orders' and column_name = 'org_id') then
    alter table public.delivery_orders add column org_id uuid references public.organizations(id) on delete set null;
    create index idx_delivery_orders_org on public.delivery_orders(org_id);
  end if;
end $$;

comment on column public.dealers.org_id is 'FK to unified organizations table (type=car_dealer)';
comment on column public.inspection_centers.org_id is 'FK to unified organizations table (type=inspection_center)';
comment on column public.finance_partners.org_id is 'FK to unified organizations table (type=finance_company)';
comment on column public.insurance_partners.org_id is 'FK to unified organizations table (type=insurance_company)';
comment on column public.advertisers.org_id is 'FK to unified organizations table (type=advertising_marketing_company)';
comment on column public.spare_part_suppliers.org_id is 'FK to unified organizations table (type=spare_parts_supplier)';
comment on column public.delivery_providers.org_id is 'FK to unified organizations table (type=product_shipping_company or vehicle_transport_company)';
comment on column public.vehicle_listings.org_id is 'FK to the car_dealer organization that owns this listing';
comment on column public.vehicles.org_id is 'FK to the car_dealer organization that owns this vehicle';
comment on column public.auctions.org_id is 'FK to the car_dealer organization running this auction';
comment on column public.ad_campaigns.org_id is 'FK to the advertising/marketing organization running this campaign';
comment on column public.inspection_appointments.org_id is 'FK to the inspection_center organization handling this appointment';
comment on column public.inspection_reports.org_id is 'FK to the inspection_center organization that produced this report';
comment on column public.finance_offers.org_id is 'FK to the finance_company organization that created this offer';
comment on column public.insurance_offers.org_id is 'FK to the insurance_company organization that created this offer';
comment on column public.wholesale_requests.org_id is 'FK to the wholesale_vehicle_trader organization that created this request';
comment on column public.spare_parts.org_id is 'FK to the spare_parts_supplier organization listing this part';
comment on column public.delivery_orders.org_id is 'FK to the product_shipping_company or vehicle_transport_company handling this order';
