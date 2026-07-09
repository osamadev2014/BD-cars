-- =============================================
-- Ryon Platform - Seed Data
-- =============================================

-- 1. ROLES
insert into public.roles (slug, name, is_system) values
  ('system_owner', 'System Owner', true),
  ('super_admin', 'Super Admin', true),
  ('admin', 'Admin', true),
  ('operations_manager', 'Operations Manager', true),
  ('sales_manager', 'Sales Manager', true),
  ('sales_agent', 'Sales Agent', true),
  ('inspection_manager', 'Inspection Manager', true),
  ('inspection_center_admin', 'Inspection Center Admin', true),
  ('inspection_technician', 'Inspection Technician', true),
  ('dealer_owner', 'Dealer Owner', true),
  ('dealer_employee', 'Dealer Employee', true),
  ('wholesale_dealer', 'Wholesale Dealer', true),
  ('finance_partner_admin', 'Finance Partner Admin', true),
  ('insurance_partner_admin', 'Insurance Partner Admin', true),
  ('advertiser_partner_admin', 'Advertiser Partner Admin', true),
  ('spare_parts_supplier_admin', 'Spare Parts Supplier Admin', true),
  ('spare_parts_supplier_employee', 'Spare Parts Supplier Employee', true),
  ('delivery_partner_admin', 'Delivery Partner Admin', true),
  ('support_agent', 'Support Agent', true),
  ('accountant', 'Accountant', true),
  ('content_manager', 'Content Manager', true),
  ('customer', 'Customer', true)
on conflict (slug) do nothing;

-- 2. PERMISSIONS
insert into public.permissions (slug, name, group_name) values
  -- Dashboard
  ('view_dashboard', 'View Dashboard', 'dashboard'),
  ('view_analytics', 'View Analytics', 'dashboard'),
  -- Vehicles
  ('view_vehicles', 'View Vehicles', 'vehicles'),
  ('create_vehicles', 'Create Vehicles', 'vehicles'),
  ('edit_vehicles', 'Edit Vehicles', 'vehicles'),
  ('delete_vehicles', 'Delete Vehicles', 'vehicles'),
  ('view_vin', 'View VIN', 'vehicles'),
  ('view_plate', 'View Plate Number', 'vehicles'),
  -- Listings
  ('approve_listings', 'Approve Listings', 'listings'),
  ('reject_listings', 'Reject Listings', 'listings'),
  ('edit_listings', 'Edit Listings', 'listings'),
  ('suspend_listings', 'Suspend Listings', 'listings'),
  ('feature_listings', 'Feature Listings', 'listings'),
  ('bump_listings', 'Bump Listings', 'listings'),
  -- Settings
  ('view_settings', 'View Settings', 'settings'),
  ('edit_settings', 'Edit Settings', 'settings'),
  ('edit_dangerous_settings', 'Edit Dangerous Settings', 'settings'),
  -- Roles
  ('view_roles', 'View Roles', 'roles'),
  ('create_roles', 'Create Roles', 'roles'),
  ('edit_roles', 'Edit Roles', 'roles'),
  ('delete_roles', 'Delete Roles', 'roles'),
  ('assign_roles', 'Assign Roles', 'roles'),
  -- Audit
  ('view_audit', 'View Audit Logs', 'audit'),
  ('export_audit', 'Export Audit Logs', 'audit'),
  -- Reports
  ('view_reports', 'View Reports', 'reports'),
  ('export_reports', 'Export Reports', 'reports'),
  -- Customers
  ('view_customers', 'View Customers', 'customers'),
  ('edit_customers', 'Edit Customers', 'customers'),
  ('suspend_customers', 'Suspend Customers', 'customers'),
  -- Dealers
  ('approve_dealers', 'Approve Dealers', 'dealers'),
  ('suspend_dealers', 'Suspend Dealers', 'dealers'),
  -- Support
  ('view_tickets', 'View Support Tickets', 'support'),
  ('manage_tickets', 'Manage Support Tickets', 'support'),
  -- Finance
  ('view_finance', 'View Finance Data', 'finance'),
  ('view_commissions', 'View Commissions', 'commissions'),
  ('edit_commissions', 'Edit Commission Rules', 'commissions'),
  -- Inspections
  ('view_inspections', 'View Inspections', 'inspections'),
  ('manage_inspections', 'Manage Inspections', 'inspections'),
  -- Auctions
  ('view_auctions', 'View Auctions', 'auctions'),
  ('manage_auctions', 'Manage Auctions', 'auctions'),
  -- Ads
  ('view_ads', 'View Advertisements', 'ads'),
  ('manage_ads', 'Manage Advertisements', 'ads'),
  -- Content
  ('manage_content', 'Manage Content', 'content')
on conflict (slug) do nothing;

-- 3. ASSIGN ALL PERMISSIONS TO SUPER_ADMIN AND ADMIN
do $$
declare
  super_admin_id uuid;
  admin_id uuid;
  perm_record record;
begin
  select id into super_admin_id from public.roles where slug = 'super_admin';
  select id into admin_id from public.roles where slug = 'admin';

  for perm_record in select id from public.permissions loop
    insert into public.role_permissions (role_id, permission_id)
    values (super_admin_id, perm_record.id)
    on conflict (role_id, permission_id) do nothing;

    insert into public.role_permissions (role_id, permission_id)
    values (admin_id, perm_record.id)
    on conflict (role_id, permission_id) do nothing;
  end loop;
end $$;

-- 4. DEFAULT SETTINGS
insert into public.app_settings (category, key, value, type, label, is_public) values
  ('general', 'app_name', '"Ryon"', 'string', 'Application Name', true),
  ('general', 'app_description', '"Saudi Automotive Marketplace"', 'string', 'Application Description', true),
  ('general', 'support_email', '"support@ryon.sa"', 'string', 'Support Email', true),
  ('general', 'support_phone', '"966"', 'string', 'Support Phone', true),
  
  ('branding', 'brand_logo', 'null', 'string', 'Logo URL', true),
  ('branding', 'brand_favicon', 'null', 'string', 'Favicon URL', true),
  ('branding', 'brand_primary_color', '"#1a365d"', 'string', 'Primary Color', true),
  
  ('theme', 'default_theme', '"system"', 'string', 'Default Theme (light/dark/system)', true),
  ('theme', 'allow_dark_mode', 'true', 'boolean', 'Allow Dark Mode', true),
  ('theme', 'allow_light_mode', 'true', 'boolean', 'Allow Light Mode', true),
  
  ('language', 'default_locale', '"ar"', 'string', 'Default Language', true),
  ('language', 'arabic_enabled', 'true', 'boolean', 'Enable Arabic', true),
  ('language', 'english_enabled', 'true', 'boolean', 'Enable English', true),
  
  ('features', 'auctions_enabled', 'false', 'boolean', 'Enable Auctions', true),
  ('features', 'spare_parts_enabled', 'false', 'boolean', 'Enable Spare Parts Marketplace', true),
  ('features', 'delivery_enabled', 'false', 'boolean', 'Enable Delivery Module', true),
  ('features', 'finance_enabled', 'false', 'boolean', 'Enable Finance Module', true),
  ('features', 'insurance_enabled', 'false', 'boolean', 'Enable Insurance Module', true),
  ('features', 'ads_enabled', 'false', 'boolean', 'Enable Advertising Module', true),
  ('features', 'ai_assistant_enabled', 'false', 'boolean', 'Enable AI Features', true),
  ('features', 'wholesale_enabled', 'false', 'boolean', 'Enable Wholesale Module', true),
  
  ('listing', 'require_listing_approval', 'true', 'boolean', 'Require Admin Approval for Listings', false),
  ('listing', 'require_inspection', 'false', 'boolean', 'Require Inspection for Listings', false),
  ('listing', 'show_plate_number', 'false', 'boolean', 'Show Plate Number Publicly', true),
  ('listing', 'show_vin', 'false', 'boolean', 'Show VIN Publicly', true),
  ('listing', 'max_images_per_listing', '20', 'number', 'Maximum Images Per Listing', true),
  ('listing', 'max_videos_per_listing', '3', 'number', 'Maximum Videos Per Listing', true),
  
  ('inspection', 'inspection_enabled', 'true', 'boolean', 'Enable Inspection Module', true),
  ('inspection', 'default_inspection_price', '299', 'number', 'Default Inspection Price (SAR)', true),
  ('inspection', 'ryon_inspection_percentage', '20', 'number', 'Ryon Share of Inspection Fee (%)', false),
  
  ('payment', 'payment_mode', '"sandbox"', 'string', 'Payment Mode (sandbox/live)', false),
  ('payment', 'default_payment_method', '"mada"', 'string', 'Default Payment Method', true),
  ('payment', 'vat_percentage', '15', 'number', 'VAT Percentage', true)
on conflict (key) do nothing;


-- Saudi Arabia Geo Data

-- Country
insert into public.countries (name, name_ar, code, phone_code) values
  ('Saudi Arabia', 'ط§ظ„ظ…ظ…ظ„ظƒط© ط§ظ„ط¹ط±ط¨ظٹط© ط§ظ„ط³ط¹ظˆط¯ظٹط©', 'SA', '966')
on conflict (code) do nothing;

-- Regions
insert into public.regions (country_id, name, name_ar)
select c.id, r.name, r.name_ar
from public.countries c
cross join (values
  ('Riyadh Region', 'ظ…ظ†ط·ظ‚ط© ط§ظ„ط±ظٹط§ط¶'),
  ('Makkah Region', 'ظ…ظ†ط·ظ‚ط© ظ…ظƒط© ط§ظ„ظ…ظƒط±ظ…ط©'),
  ('Eastern Region', 'ط§ظ„ظ…ظ†ط·ظ‚ط© ط§ظ„ط´ط±ظ‚ظٹط©'),
  ('Madinah Region', 'ظ…ظ†ط·ظ‚ط© ط§ظ„ظ…ط¯ظٹظ†ط© ط§ظ„ظ…ظ†ظˆط±ط©'),
  ('Qassim Region', 'ظ…ظ†ط·ظ‚ط© ط§ظ„ظ‚طµظٹظ…'),
  ('Asir Region', 'ظ…ظ†ط·ظ‚ط© ط¹ط³ظٹط±'),
  ('Tabuk Region', 'ظ…ظ†ط·ظ‚ط© طھط¨ظˆظƒ'),
  ('Hail Region', 'ظ…ظ†ط·ظ‚ط© ط­ط§ط¦ظ„'),
  ('Northern Borders Region', 'ظ…ظ†ط·ظ‚ط© ط§ظ„ط­ط¯ظˆط¯ ط§ظ„ط´ظ…ط§ظ„ظٹط©'),
  ('Jazan Region', 'ظ…ظ†ط·ظ‚ط© ط¬ط§ط²ط§ظ†'),
  ('Najran Region', 'ظ…ظ†ط·ظ‚ط© ظ†ط¬ط±ط§ظ†'),
  ('Al-Bahah Region', 'ظ…ظ†ط·ظ‚ط© ط§ظ„ط¨ط§ط­ط©'),
  ('Al-Jawf Region', 'ظ…ظ†ط·ظ‚ط© ط§ظ„ط¬ظˆظپ')
) as r(name, name_ar)
where c.code = 'SA'
on conflict do nothing;

-- Major Cities
do $$
declare
  riyadh_id uuid;
  makkah_id uuid;
  eastern_id uuid;
begin
  select id into riyadh_id from public.regions where name = 'Riyadh Region';
  select id into makkah_id from public.regions where name = 'Makkah Region';
  select id into eastern_id from public.regions where name = 'Eastern Region';

  -- Riyadh
  insert into public.cities (region_id, name, name_ar) values
    (riyadh_id, 'Riyadh', 'ط§ظ„ط±ظٹط§ط¶'),
    (riyadh_id, 'Al-Kharj', 'ط§ظ„ط®ط±ط¬'),
    (riyadh_id, 'Al-Majmaah', 'ط§ظ„ظ…ط¬ظ…ط¹ط©');

  -- Makkah
  insert into public.cities (region_id, name, name_ar) values
    (makkah_id, 'Jeddah', 'ط¬ط¯ط©'),
    (makkah_id, 'Makkah', 'ظ…ظƒط© ط§ظ„ظ…ظƒط±ظ…ط©'),
    (makkah_id, 'Taif', 'ط§ظ„ط·ط§ط¦ظپ'),
    (makkah_id, 'Rabigh', 'ط±ط§ط¨ط؛');

  -- Eastern
  insert into public.cities (region_id, name, name_ar) values
    (eastern_id, 'Dammam', 'ط§ظ„ط¯ظ…ط§ظ…'),
    (eastern_id, 'Khobar', 'ط§ظ„ط®ط¨ط±'),
    (eastern_id, 'Dhahran', 'ط§ظ„ط¸ظ‡ط±ط§ظ†'),
    (eastern_id, 'Hofuf', 'ط§ظ„ط£ط­ط³ط§ط،'),
    (eastern_id, 'Jubail', 'ط§ظ„ط¬ط¨ظٹظ„'),
    (eastern_id, 'Qatif', 'ط§ظ„ظ‚ط·ظٹظپ');
end $$;

-- Car Makes (common in Saudi market)
insert into public.car_makes (name, name_ar, slug) values
  ('Toyota', 'طھظˆظٹظˆطھط§', 'toyota'),
  ('Hyundai', 'ظ‡ظٹظˆظ†ط¯ط§ظٹ', 'hyundai'),
  ('Nissan', 'ظ†ظٹط³ط§ظ†', 'nissan'),
  ('Honda', 'ظ‡ظˆظ†ط¯ط§', 'honda'),
  ('Kia', 'ظƒظٹط§', 'kia'),
  ('Ford', 'ظپظˆط±ط¯', 'ford'),
  ('Chevrolet', 'ط´ظٹظپط±ظˆظ„ظٹظ‡', 'chevrolet'),
  ('Mercedes-Benz', 'ظ…ط±ط³ظٹط¯ط³', 'mercedes-benz'),
  ('BMW', 'ط¨ظٹ ط§ظ… ط¯ط¨ظ„ظٹظˆ', 'bmw'),
  ('Lexus', 'ظ„ظƒط²ط³', 'lexus'),
  ('Mitsubishi', 'ظ…ظٹطھط³ظˆط¨ظٹط´ظٹ', 'mitsubishi'),
  ('Mazda', 'ظ…ط§ط²ط¯ط§', 'mazda'),
  ('GMC', 'ط¬ظٹ ط§ظ… ط³ظٹ', 'gmc'),
  ('Cadillac', 'ظƒط§ط¯ظٹظ„ط§ظƒ', 'cadillac'),
  ('Audi', 'ط£ظˆط¯ظٹ', 'audi'),
  ('Volkswagen', 'ظپظˆظ„ظƒط³ ظپط§ط¬ظ†', 'volkswagen'),
  ('Jeep', 'ط¬ظٹط¨', 'jeep'),
  ('Dodge', 'ط¯ظˆط¯ط¬', 'dodge'),
  ('Chrysler', 'ظƒط±ط§ظٹط³ظ„ط±', 'chrysler'),
  ('Porsche', 'ط¨ظˆط±ط´', 'porsche')
on conflict (slug) do nothing;

-- Body Types
insert into public.body_types (name, name_ar, slug) values
  ('Sedan', 'ط³ظٹط¯ط§ظ†', 'sedan'),
  ('SUV', 'ط¯ظپط¹ ط±ط¨ط§ط¹ظٹ', 'suv'),
  ('Coupe', 'ظƒظˆط¨ظٹظ‡', 'coupe'),
  ('Hatchback', 'ظ‡ط§طھط´ط¨ط§ظƒ', 'hatchback'),
  ('Pickup', 'ط¨ظٹظƒ ط§ط¨', 'pickup'),
  ('Wagon', 'ط¹ط§ط¦ظ„ظٹط©', 'wagon'),
  ('Convertible', 'ظ…ظƒط´ظˆظپط©', 'convertible'),
  ('Minivan', 'ظ…ظٹظ†ظٹ ظپط§ظ†', 'minivan'),
  ('Crossover', 'ظƒط±ظˆط³ ط£ظˆظپط±', 'crossover'),
  ('Sports Car', 'ط³ظٹط§ط±ط© ط±ظٹط§ط¶ظٹط©', 'sports-car')
on conflict (slug) do nothing;

-- Fuel Types
insert into public.fuel_types (name, name_ar, slug) values
  ('Gasoline', 'ط¨ظ†ط²ظٹظ†', 'gasoline'),
  ('Diesel', 'ط¯ظٹط²ظ„', 'diesel'),
  ('Hybrid', 'ظ‡ط§ظٹط¨ط±ط¯', 'hybrid'),
  ('Electric', 'ظƒظ‡ط±ط¨ط§ط،', 'electric'),
  ('Plug-in Hybrid', 'ظ‡ط§ظٹط¨ط±ط¯ ط¨ظ„ug ط¥ظ†', 'plug-in-hybrid')
on conflict (slug) do nothing;

-- Transmission Types
insert into public.transmission_types (name, name_ar, slug) values
  ('Automatic', 'ط£ظˆطھظˆظ…ط§طھظٹظƒ', 'automatic'),
  ('Manual', 'ظٹط¯ظˆظٹ', 'manual'),
  ('CVT', 'ط³ظٹ ظپظٹ طھظٹ', 'cvt'),
  ('DCT', 'ط¯ظٹ ط³ظٹ طھظٹ', 'dct')
on conflict (slug) do nothing;

-- Drivetrain Types
insert into public.drivetrain_types (name, name_ar, slug) values
  ('Front-Wheel Drive', 'ط¯ظپط¹ ط£ظ…ط§ظ…ظٹ', 'fwd'),
  ('Rear-Wheel Drive', 'ط¯ظپط¹ ط®ظ„ظپظٹ', 'rwd'),
  ('All-Wheel Drive', 'ط¯ظپط¹ ظƒظ„ظٹ', 'awd'),
  ('Four-Wheel Drive', 'ط¯ظپط¹ ط±ط¨ط§ط¹ظٹ', '4wd')
on conflict (slug) do nothing;

-- Vehicle Condition Types
insert into public.vehicle_condition_types (name, name_ar, slug) values
  ('New', 'ط¬ط¯ظٹط¯', 'new'),
  ('Used - Excellent', 'ظ…ط³طھط¹ظ…ظ„ - ظ…ظ…طھط§ط²', 'used-excellent'),
  ('Used - Good', 'ظ…ط³طھط¹ظ…ظ„ - ط¬ظٹط¯', 'used-good'),
  ('Used - Fair', 'ظ…ط³طھط¹ظ…ظ„ - ظ…ظ‚ط¨ظˆظ„', 'used-fair'),
  ('Damaged', 'طھط§ظ„ظپ', 'damaged'),
  ('Imported', 'ظ…ط³طھظˆط±ط¯', 'imported')
on conflict (slug) do nothing;

-- Car Colors
insert into public.car_colors (name, name_ar, hex_code, slug) values
  ('White', 'ط£ط¨ظٹط¶', '#FFFFFF', 'white'),
  ('Black', 'ط£ط³ظˆط¯', '#000000', 'black'),
  ('Silver', 'ظپط¶ظٹ', '#C0C0C0', 'silver'),
  ('Gray', 'ط±ظ…ط§ط¯ظٹ', '#808080', 'gray'),
  ('Red', 'ط£ط­ظ…ط±', '#FF0000', 'red'),
  ('Blue', 'ط£ط²ط±ظ‚', '#0000FF', 'blue'),
  ('Green', 'ط£ط®ط¶ط±', '#008000', 'green'),
  ('Brown', 'ط¨ظ†ظٹ', '#A52A2A', 'brown'),
  ('Beige', 'ط¨ظٹط¬', '#F5F5DC', 'beige'),
  ('Gold', 'ط°ظ‡ط¨ظٹ', '#FFD700', 'gold'),
  ('Dark Blue', 'ط£ط²ط±ظ‚ ط؛ط§ظ…ظ‚', '#00008B', 'dark-blue'),
  ('Dark Gray', 'ط±ظ…ط§ط¯ظٹ ط؛ط§ظ…ظ‚', '#A9A9A9', 'dark-gray')
on conflict (slug) do nothing;

-- Vehicle Statuses
insert into public.vehicle_statuses (name, name_ar, slug) values
  ('Available', 'ظ…طھط§ط­', 'available'),
  ('Reserved', 'ظ…ط­ط¬ظˆط²', 'reserved'),
  ('Sold', 'ظ…ط¨ط§ط¹', 'sold'),
  ('Under Maintenance', 'ظ‚ظٹط¯ ط§ظ„طµظٹط§ظ†ط©', 'under-maintenance')
on conflict (slug) do nothing;

-- Dealer Subscription Plans
insert into public.dealer_subscription_plans (name, name_ar, slug, price_monthly, max_listings, max_staff, max_branches, has_analytics, has_wholesale, has_featured) values
  ('Free', 'ظ…ط¬ط§ظ†ظٹ', 'free', 0, 5, 1, 1, false, false, false),
  ('Basic', 'ط£ط³ط§ط³ظٹ', 'basic', 299, 20, 3, 1, true, false, false),
  ('Professional', 'ط§ط­طھط±ط§ظپظٹ', 'professional', 999, 100, 10, 3, true, true, true),
  ('Enterprise', 'ظ…ط¤ط³ط³ظٹ', 'enterprise', 2999, -1, -1, -1, true, true, true)
on conflict (slug) do nothing;

-- Default Payment Methods
insert into public.payment_methods (name, name_ar, slug) values
  ('Mada', 'ظ…ط¯ظ‰', 'mada'),
  ('Visa/Mastercard', 'ظپظٹط²ط§/ظ…ط§ط³طھط±ظƒط§ط±ط¯', 'card'),
  ('Apple Pay', 'ط£ط¨ظ„ ط¨ط§ظٹ', 'apple-pay'),
  ('Bank Transfer', 'طھط­ظˆظٹظ„ ط¨ظ†ظƒظٹ', 'bank-transfer'),
  ('Cash', 'ظ†ظ‚ط¯ط§ظ‹', 'cash')
on conflict (slug) do nothing;

-- Inspection Services
insert into public.inspection_services (name, name_ar, slug, default_price, duration_minutes) values
  ('Comprehensive Inspection', 'ظپط­طµ ط´ط§ظ…ظ„', 'comprehensive', 299, 120),
  ('Basic Inspection', 'ظپط­طµ ط£ط³ط§ط³ظٹ', 'basic', 149, 60),
  ('Pre-Purchase Inspection', 'ظپط­طµ ظ…ط§ ظ‚ط¨ظ„ ط§ظ„ط´ط±ط§ط،', 'pre-purchase', 399, 150),
  ('Engine Diagnostics', 'طھط´ط®ظٹطµ ط§ظ„ظ…ط­ط±ظƒ', 'engine-diagnostics', 199, 45),
  ('Paint & Body Inspection', 'ظپط­طµ ط§ظ„ط¯ظ‡ط§ظ† ظˆط§ظ„ط¨ط¯ظٹ', 'paint-body', 249, 90)
on conflict (slug) do nothing;

-- Spare Part Categories
insert into public.part_categories (name, name_ar, slug) values
  ('Engine Parts', 'ظ‚ط·ط¹ ط§ظ„ظ…ط­ط±ظƒ', 'engine-parts'),
  ('Transmission', 'ظ†ط§ظ‚ظ„ ط§ظ„ط­ط±ظƒط©', 'transmission'),
  ('Brakes', 'ط§ظ„ظپط±ط§ظ…ظ„', 'brakes'),
  ('Suspension', 'ط§ظ„طھط¹ظ„ظٹظ‚', 'suspension'),
  ('Electrical', 'ط§ظ„ظƒظ‡ط±ط¨ط§ط،', 'electrical'),
  ('Body Parts', 'ظ‚ط·ط¹ ط§ظ„ظ‡ظٹظƒظ„', 'body-parts'),
  ('Interior', 'ط§ظ„ط¯ط§ط®ظ„ظٹط©', 'interior'),
  ('Air Conditioning', 'ط§ظ„طھظƒظٹظٹظپ', 'ac'),
  ('Cooling System', 'ظ†ط¸ط§ظ… ط§ظ„طھط¨ط±ظٹط¯', 'cooling-system'),
  ('Exhaust', 'ط§ظ„ط¹ط§ط¯ظ…', 'exhaust'),
  ('Tires & Wheels', 'ط§ظ„ط¥ط·ط§ط±ط§طھ ظˆط§ظ„ط¹ط¬ظ„ط§طھ', 'tires-wheels'),
  ('Lighting', 'ط§ظ„ط¥ط¶ط§ط،ط©', 'lighting'),
  ('Filters', 'ط§ظ„ظپظ„ط§طھط±', 'filters'),
  ('Belts & Hoses', 'ط§ظ„ط³ظٹظˆط± ظˆط§ظ„ط®ط±ط§ط·ظٹظ…', 'belts-hoses')
on conflict (slug) do nothing;

-- Delivery Methods
insert into public.delivery_methods (name, name_ar, slug, estimated_days_min, estimated_days_max) values
  ('Standard Delivery', 'طھظˆطµظٹظ„ ط¹ط§ط¯ظٹ', 'standard', 3, 7),
  ('Express Delivery', 'طھظˆطµظٹظ„ ط³ط±ظٹط¹', 'express', 1, 2),
  ('Same Day Delivery', 'طھظˆطµظٹظ„ ظ†ظپط³ ط§ظ„ظٹظˆظ…', 'same-day', 0, 1),
  ('Pickup from Branch', 'ط§ط³طھظ„ط§ظ… ظ…ظ† ط§ظ„ظپط±ط¹', 'pickup', 0, 0)
on conflict (slug) do nothing;

-- Notification Templates
insert into public.notification_templates (key, title, title_ar, body, body_ar, channels) values
  ('listing_approved', 'Listing Approved', 'طھظ… ط§ظ„ظ…ظˆط§ظپظ‚ط© ط¹ظ„ظ‰ ط§ظ„ط¥ط¹ظ„ط§ظ†', 'Your listing "{title}" has been approved and is now live.', 'طھظ…طھ ط§ظ„ظ…ظˆط§ظپظ‚ط© ط¹ظ„ظ‰ ط¥ط¹ظ„ط§ظ†ظƒ "{title}" ظˆظ‡ظˆ ط§ظ„ط¢ظ† ظ…ظ†ط´ظˆط±.', '["in_app"]'),
  ('listing_rejected', 'Listing Rejected', 'طھظ… ط±ظپط¶ ط§ظ„ط¥ط¹ظ„ط§ظ†', 'Your listing "{title}" has been rejected. Reason: {reason}', 'طھظ… ط±ظپط¶ ط¥ط¹ظ„ط§ظ†ظƒ "{title}". ط§ظ„ط³ط¨ط¨: {reason}', '["in_app"]'),
  ('message_received', 'New Message', 'ط±ط³ط§ظ„ط© ط¬ط¯ظٹط¯ط©', 'You have a new message from {sender}.', 'ظ„ط¯ظٹظƒ ط±ط³ط§ظ„ط© ط¬ط¯ظٹط¯ط© ظ…ظ† {sender}.', '["in_app"]'),
  ('inspection_ready', 'Inspection Report Ready', 'طھظ‚ط±ظٹط± ط§ظ„ظپط­طµ ط¬ط§ظ‡ط²', 'Your inspection report for {vehicle} is ready.', 'طھظ‚ط±ظٹط± ط§ظ„ظپط­طµ ظ„ظ€ {vehicle} ط¬ط§ظ‡ط².', '["in_app"]')
on conflict (key) do nothing;
