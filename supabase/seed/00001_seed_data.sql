-- =============================================
-- BD Platform - Seed Data
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
  ('general', 'app_name', '"BD"', 'string', 'Application Name', true),
  ('general', 'app_description', '"Saudi Automotive Marketplace"', 'string', 'Application Description', true),
  ('general', 'support_email', '"support@bd.evico.sa"', 'string', 'Support Email', true),
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
  ('inspection', 'ryon_inspection_percentage', '20', 'number', 'BD Share of Inspection Fee (%)', false),
  
  ('payment', 'payment_mode', '"sandbox"', 'string', 'Payment Mode (sandbox/live)', false),
  ('payment', 'default_payment_method', '"mada"', 'string', 'Default Payment Method', true),
  ('payment', 'vat_percentage', '15', 'number', 'VAT Percentage', true)
on conflict (key) do nothing;
