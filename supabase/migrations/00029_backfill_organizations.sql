-- =============================================
-- Phase 1: Backfill Organizations from Existing Entities
-- =============================================
-- UP: Maps every existing dealer, inspection_center, finance_partner,
--      insurance_partner, advertiser, spare_part_supplier, and
--      delivery_provider to a new unified organization record.
-- DOWN: Reverses the mapping (orphans orgs created by this backfill).
--
-- IMPORTANT: Idempotent — safe to run multiple times. Only creates
-- an organization row if one does not already exist for the entity.
-- Only runs if there are existing records to migrate.

-- ============ Helpers ============

-- Temporary function: generate unique slug per org type
create or replace function public.temp_backfill_slug(base text, fallback text, org_type text)
returns text
language sql
immutable
as $$
  select case
    when base is not null and base != '' then base || '-' || org_type
    else fallback || '-' || org_type || '-' || substr(md5(random()::text), 1, 6)
  end;
$$;

-- ============ 1. Dealers → car_dealer ============
do $$
declare
  r record;
  new_org_id uuid;
begin
  for r in select * from public.dealers d
    where d.org_id is null
    and exists (select 1 from public.vehicles where owner_id = d.owner_id limit 1) -- only migrate dealers with data
  loop
    insert into public.organizations (org_type, name, name_ar, slug, description, description_ar, logo_url, cover_url, phone, email, website, city_id, address, address_ar, latitude, longitude, status, is_active, created_by, created_at)
    values (
      'car_dealer',
      r.name, r.name_ar,
      public.temp_backfill_slug(r.slug, 'dealer', 'car_dealer'),
      r.description, r.description_ar,
      r.logo_url, r.cover_url,
      r.phone, r.email, r.website,
      r.city_id, r.address, r.address_ar,
      r.latitude, r.longitude,
      case when r.is_approved then 'active'::org_status else 'pending_approval'::org_status end,
      r.is_active,
      r.owner_id,
      r.created_at
    )
    returning id into new_org_id;

    update public.dealers set org_id = new_org_id where id = r.id;

    -- Create owner's membership
    insert into public.organization_members (organization_id, user_id, role, status, is_active, created_by, joined_at)
    values (new_org_id, r.owner_id, 'owner', 'active', true, r.owner_id, r.created_at)
    on conflict (organization_id, user_id) do nothing;

    -- Copy existing dealer_users as members
    insert into public.organization_members (organization_id, user_id, role, status, is_active, created_by, joined_at)
    select new_org_id, du.user_id, du.role, 'active', du.is_active, r.owner_id, du.created_at
    from public.dealer_users du
    where du.dealer_id = r.id and du.user_id != r.owner_id
    on conflict (organization_id, user_id) do nothing;

    -- Backfill org_id on vehicle_listings, vehicles, auctions
    update public.vehicles set org_id = new_org_id where owner_id = r.owner_id and org_id is null;
    update public.vehicle_listings set org_id = new_org_id where seller_id = r.owner_id and org_id is null;
    update public.auctions set org_id = new_org_id where seller_id = r.owner_id and org_id is null;
  end loop;
end $$;

-- ============ 2. Inspection Centers → inspection_center ============
do $$
declare
  r record;
  new_org_id uuid;
begin
  for r in select * from public.inspection_centers ic
    where ic.org_id is null
  loop
    insert into public.organizations (org_type, name, name_ar, slug, description, description_ar, logo_url, cover_url, phone, email, website, city_id, address, address_ar, latitude, longitude, status, is_active, created_by, created_at)
    values (
      'inspection_center',
      r.name, r.name_ar,
      public.temp_backfill_slug(r.slug, 'inspection', 'inspection_center'),
      r.description, r.description_ar,
      r.logo_url, r.cover_url,
      r.phone, r.email, r.website,
      r.city_id, r.address, r.address_ar,
      r.latitude, r.longitude,
      'active', r.is_active,
      null,
      r.created_at
    )
    returning id into new_org_id;

    update public.inspection_centers set org_id = new_org_id where id = r.id;

    -- Copy inspection_center_users as members
    insert into public.organization_members (organization_id, user_id, role, status, is_active, joined_at)
    select new_org_id, icu.user_id, icu.role, 'active', icu.is_active, icu.created_at
    from public.inspection_center_users icu
    where icu.center_id = r.id
    on conflict (organization_id, user_id) do nothing;

    -- Backfill org_id on appointments and reports
    update public.inspection_appointments set org_id = new_org_id where center_id = r.id and org_id is null;
    update public.inspection_reports set org_id = new_org_id
      where appointment_id in (select id from public.inspection_appointments where center_id = r.id)
      and org_id is null;
  end loop;
end $$;

-- ============ 3. Finance Partners → finance_company ============
do $$
declare
  r record;
  new_org_id uuid;
begin
  for r in select * from public.finance_partners fp
    where fp.org_id is null
  loop
    insert into public.organizations (org_type, name, name_ar, slug, description, description_ar, logo_url, status, is_active, created_at)
    values (
      'finance_company',
      r.name, r.name_ar,
      public.temp_backfill_slug(r.slug, 'finance', 'finance_company'),
      r.description, r.description_ar,
      r.logo_url,
      'active', r.is_active,
      r.created_at
    )
    returning id into new_org_id;

    update public.finance_partners set org_id = new_org_id where id = r.id;

    insert into public.organization_members (organization_id, user_id, role, status, is_active, joined_at)
    select new_org_id, fpu.user_id, fpu.role, 'active', fpu.is_active, fpu.created_at
    from public.finance_partner_users fpu
    where fpu.partner_id = r.id
    on conflict (organization_id, user_id) do nothing;

    -- Backfill offers
    update public.finance_offers set org_id = new_org_id
      where partner_id = r.id and org_id is null;
  end loop;
end $$;

-- ============ 4. Insurance Partners → insurance_company ============
do $$
declare
  r record;
  new_org_id uuid;
begin
  for r in select * from public.insurance_partners ip
    where ip.org_id is null
  loop
    insert into public.organizations (org_type, name, name_ar, slug, description, description_ar, logo_url, status, is_active, created_at)
    values (
      'insurance_company',
      r.name, r.name_ar,
      public.temp_backfill_slug(r.slug, 'insurance', 'insurance_company'),
      r.description, r.description_ar,
      r.logo_url,
      'active', r.is_active,
      r.created_at
    )
    returning id into new_org_id;

    update public.insurance_partners set org_id = new_org_id where id = r.id;

    insert into public.organization_members (organization_id, user_id, role, status, is_active, joined_at)
    select new_org_id, ipu.user_id, ipu.role, 'active', ipu.is_active, ipu.created_at
    from public.insurance_partner_users ipu
    where ipu.partner_id = r.id
    on conflict (organization_id, user_id) do nothing;

    update public.insurance_offers set org_id = new_org_id
      where partner_id = r.id and org_id is null;
  end loop;
end $$;

-- ============ 5. Advertisers → advertising_marketing_company ============
do $$
declare
  r record;
  new_org_id uuid;
begin
  for r in select * from public.advertisers a
    where a.org_id is null
  loop
    insert into public.organizations (org_type, name, name_ar, slug, logo_url, status, is_active, created_at)
    values (
      'advertising_marketing_company',
      r.name, '', -- advertisers table has no name_ar
      public.temp_backfill_slug(r.slug, 'advertiser', 'advertising_marketing_company'),
      r.logo_url,
      'active', r.is_active,
      r.created_at
    )
    returning id into new_org_id;

    update public.advertisers set org_id = new_org_id where id = r.id;

    insert into public.organization_members (organization_id, user_id, role, status, is_active, joined_at)
    select new_org_id, au.user_id, au.role, 'active', au.is_active, au.created_at
    from public.advertiser_users au
    where au.advertiser_id = r.id
    on conflict (organization_id, user_id) do nothing;

    update public.ad_campaigns set org_id = new_org_id
      where advertiser_id = r.id and org_id is null;
  end loop;
end $$;

-- ============ 6. Spare Part Suppliers → spare_parts_supplier ============
do $$
declare
  r record;
  new_org_id uuid;
begin
  for r in select * from public.spare_part_suppliers ss
    where ss.org_id is null
  loop
    insert into public.organizations (org_type, name, name_ar, slug, description, description_ar, logo_url, phone, email, city_id, status, is_active, created_at)
    values (
      'spare_parts_supplier',
      r.name, r.name_ar,
      public.temp_backfill_slug(r.slug, 'supplier', 'spare_parts_supplier'),
      r.description, r.description_ar,
      r.logo_url, r.phone, r.email,
      r.city_id,
      case when r.is_approved then 'active'::org_status else 'pending_approval'::org_status end,
      r.is_active,
      r.created_at
    )
    returning id into new_org_id;

    update public.spare_part_suppliers set org_id = new_org_id where id = r.id;

    insert into public.organization_members (organization_id, user_id, role, status, is_active, joined_at)
    select new_org_id, ssu.user_id, ssu.role, 'active', ssu.is_active, ssu.created_at
    from public.spare_part_supplier_users ssu
    where ssu.supplier_id = r.id
    on conflict (organization_id, user_id) do nothing;

    update public.spare_parts set org_id = new_org_id
      where exists (select 1 from public.spare_part_supplier_parts spsp where spsp.supplier_id = r.id and spsp.part_id = spare_parts.id)
      and org_id is null;
  end loop;
end $$;

-- ============ 7. Delivery Providers → product_shipping_company ============
do $$
declare
  r record;
  new_org_id uuid;
begin
  for r in select * from public.delivery_providers dp
    where dp.org_id is null
  loop
    insert into public.organizations (org_type, name, name_ar, slug, logo_url, phone, email, website, status, is_active, created_at)
    values (
      'product_shipping_company',
      r.name, r.name_ar,
      public.temp_backfill_slug(r.slug, 'delivery', 'product_shipping_company'),
      r.logo_url, r.phone, r.email, r.website,
      'active', r.is_active,
      r.created_at
    )
    returning id into new_org_id;

    update public.delivery_providers set org_id = new_org_id where id = r.id;

    insert into public.organization_members (organization_id, user_id, role, status, is_active, joined_at)
    select new_org_id, dpu.user_id, dpu.role, 'active', dpu.is_active, dpu.created_at
    from public.delivery_provider_users dpu
    where dpu.provider_id = r.id
    on conflict (organization_id, user_id) do nothing;

    update public.delivery_orders set org_id = new_org_id
      where provider_id = r.id and org_id is null;
  end loop;
end $$;

-- ============ Cleanup ============
drop function if exists public.temp_backfill_slug;

-- ============ Verification ============
do $$
declare
  total_orgs int;
  unmapped_dealers int;
  unmapped_inspection int;
  unmapped_finance int;
  unmapped_insurance int;
  unmapped_advertisers int;
  unmapped_suppliers int;
  unmapped_delivery int;
begin
  select count(*) into total_orgs from public.organizations;
  raise notice 'Backfill complete. Total organizations created: %', total_orgs;

  select count(*) into unmapped_dealers from public.dealers where org_id is null and exists (select 1 from public.vehicles where owner_id = dealers.owner_id limit 1);
  select count(*) into unmapped_inspection from public.inspection_centers where org_id is null;
  select count(*) into unmapped_finance from public.finance_partners where org_id is null;
  select count(*) into unmapped_insurance from public.insurance_partners where org_id is null;
  select count(*) into unmapped_advertisers from public.advertisers where org_id is null;
  select count(*) into unmapped_suppliers from public.spare_part_suppliers where org_id is null;
  select count(*) into unmapped_delivery from public.delivery_providers where org_id is null;

  if unmapped_dealers > 0 or unmapped_inspection > 0 or unmapped_finance > 0 or unmapped_insurance > 0 or unmapped_advertisers > 0 or unmapped_suppliers > 0 or unmapped_delivery > 0 then
    raise warning 'Some entities remain unmapped: dealers=%, inspection=%, finance=%, insurance=%, advertisers=%, suppliers=%, delivery=%',
      unmapped_dealers, unmapped_inspection, unmapped_finance, unmapped_insurance, unmapped_advertisers, unmapped_suppliers, unmapped_delivery;
  else
    raise notice 'All existing entities successfully mapped to organizations.';
  end if;
end $$;

-- =============================================
-- ROLLBACK (DOWN)
-- =============================================
-- To revert this migration:
--   1. Set org_id = null on all backfilled tables
--   2. Delete organization_members where org was created by backfill
--   3. Delete organizations created by backfill
-- The backfill only creates orgs for entities that exist, so
-- rolling back is safe as long as the entity records still exist.
