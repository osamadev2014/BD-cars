-- =============================================
-- Phase 1: Organization Type & Status Enums
-- =============================================
-- UP: Create enums for multi-tenant organizations
-- DOWN: DROP TYPE public.org_member_status, public.org_status, public.org_type

-- Organization types (extensible: add values with ALTER TYPE)
create type public.org_type as enum (
  'car_dealer',
  'inspection_center',
  'wholesale_vehicle_trader',
  'spare_parts_supplier',
  'finance_company',
  'insurance_company',
  'advertising_marketing_company',
  'car_rental_company',
  'product_shipping_company',
  'vehicle_transport_company'
);

-- Organization lifecycle status
create type public.org_status as enum (
  'pending_approval',
  'active',
  'suspended',
  'rejected',
  'closed'
);

-- Organization membership status
create type public.org_member_status as enum (
  'active',
  'invited',
  'suspended',
  'left'
);

comment on type public.org_type is 'Ten discriminated organization types for multi-tenant platform';
comment on type public.org_status is 'Lifecycle status of an organization registration';
comment on type public.org_member_status is 'Status of a user membership within an organization';
