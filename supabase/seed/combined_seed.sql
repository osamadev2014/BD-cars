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
  ('general', 'app_name', '"Ryon"', 'string', 'Application Name', true),
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


-- Saudi Arabia Geo Data

-- Country
insert into public.countries (name, name_ar, code, phone_code) values
  ('Saudi Arabia', 'المملكة العربية السعودية', 'SA', '966')
on conflict (code) do nothing;

-- Regions
insert into public.regions (country_id, name, name_ar)
select c.id, r.name, r.name_ar
from public.countries c
cross join (values
  ('Riyadh Region', 'منطقة الرياض'),
  ('Makkah Region', 'منطقة مكة المكرمة'),
  ('Eastern Region', 'المنطقة الشرقية'),
  ('Madinah Region', 'منطقة المدينة المنورة'),
  ('Qassim Region', 'منطقة القصيم'),
  ('Asir Region', 'منطقة عسير'),
  ('Tabuk Region', 'منطقة تبوك'),
  ('Hail Region', 'منطقة حائل'),
  ('Northern Borders Region', 'منطقة الحدود الشمالية'),
  ('Jazan Region', 'منطقة جازان'),
  ('Najran Region', 'منطقة نجران'),
  ('Al-Bahah Region', 'منطقة الباحة'),
  ('Al-Jawf Region', 'منطقة الجوف')
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
  select id into riyadh_id from public.regions where slug = 'riyadh-region';
  select id into makkah_id from public.regions where slug = 'makkah-region';
  select id into eastern_id from public.regions where slug = 'eastern-region';

  -- Riyadh
  insert into public.cities (region_id, name, name_ar) values
    (riyadh_id, 'Riyadh', 'الرياض'),
    (riyadh_id, 'Al-Kharj', 'الخرج'),
    (riyadh_id, 'Al-Majmaah', 'المجمعة');

  -- Makkah
  insert into public.cities (region_id, name, name_ar) values
    (makkah_id, 'Jeddah', 'جدة'),
    (makkah_id, 'Makkah', 'مكة المكرمة'),
    (makkah_id, 'Taif', 'الطائف'),
    (makkah_id, 'Rabigh', 'رابغ');

  -- Eastern
  insert into public.cities (region_id, name, name_ar) values
    (eastern_id, 'Dammam', 'الدمام'),
    (eastern_id, 'Khobar', 'الخبر'),
    (eastern_id, 'Dhahran', 'الظهران'),
    (eastern_id, 'Hofuf', 'الأحساء'),
    (eastern_id, 'Jubail', 'الجبيل'),
    (eastern_id, 'Qatif', 'القطيف');
end $$;

-- Car Makes (common in Saudi market)
insert into public.car_makes (name, name_ar, slug) values
  ('Toyota', 'تويوتا', 'toyota'),
  ('Hyundai', 'هيونداي', 'hyundai'),
  ('Nissan', 'نيسان', 'nissan'),
  ('Honda', 'هوندا', 'honda'),
  ('Kia', 'كيا', 'kia'),
  ('Ford', 'فورد', 'ford'),
  ('Chevrolet', 'شيفروليه', 'chevrolet'),
  ('Mercedes-Benz', 'مرسيدس', 'mercedes-benz'),
  ('BMW', 'بي ام دبليو', 'bmw'),
  ('Lexus', 'لكزس', 'lexus'),
  ('Mitsubishi', 'ميتسوبيشي', 'mitsubishi'),
  ('Mazda', 'مازدا', 'mazda'),
  ('GMC', 'جي ام سي', 'gmc'),
  ('Cadillac', 'كاديلاك', 'cadillac'),
  ('Audi', 'أودي', 'audi'),
  ('Volkswagen', 'فولكس فاجن', 'volkswagen'),
  ('Jeep', 'جيب', 'jeep'),
  ('Dodge', 'دودج', 'dodge'),
  ('Chrysler', 'كرايسلر', 'chrysler'),
  ('Porsche', 'بورش', 'porsche')
on conflict (slug) do nothing;

-- Body Types
insert into public.body_types (name, name_ar, slug) values
  ('Sedan', 'سيدان', 'sedan'),
  ('SUV', 'دفع رباعي', 'suv'),
  ('Coupe', 'كوبيه', 'coupe'),
  ('Hatchback', 'هاتشباك', 'hatchback'),
  ('Pickup', 'بيك اب', 'pickup'),
  ('Wagon', 'عائلية', 'wagon'),
  ('Convertible', 'مكشوفة', 'convertible'),
  ('Minivan', 'ميني فان', 'minivan'),
  ('Crossover', 'كروس أوفر', 'crossover'),
  ('Sports Car', 'سيارة رياضية', 'sports-car')
on conflict (slug) do nothing;

-- Fuel Types
insert into public.fuel_types (name, name_ar, slug) values
  ('Gasoline', 'بنزين', 'gasoline'),
  ('Diesel', 'ديزل', 'diesel'),
  ('Hybrid', 'هايبرد', 'hybrid'),
  ('Electric', 'كهرباء', 'electric'),
  ('Plug-in Hybrid', 'هايبرد بلug إن', 'plug-in-hybrid')
on conflict (slug) do nothing;

-- Transmission Types
insert into public.transmission_types (name, name_ar, slug) values
  ('Automatic', 'أوتوماتيك', 'automatic'),
  ('Manual', 'يدوي', 'manual'),
  ('CVT', 'سي في تي', 'cvt'),
  ('DCT', 'دي سي تي', 'dct')
on conflict (slug) do nothing;

-- Drivetrain Types
insert into public.drivetrain_types (name, name_ar, slug) values
  ('Front-Wheel Drive', 'دفع أمامي', 'fwd'),
  ('Rear-Wheel Drive', 'دفع خلفي', 'rwd'),
  ('All-Wheel Drive', 'دفع كلي', 'awd'),
  ('Four-Wheel Drive', 'دفع رباعي', '4wd')
on conflict (slug) do nothing;

-- Vehicle Condition Types
insert into public.vehicle_condition_types (name, name_ar, slug) values
  ('New', 'جديد', 'new'),
  ('Used - Excellent', 'مستعمل - ممتاز', 'used-excellent'),
  ('Used - Good', 'مستعمل - جيد', 'used-good'),
  ('Used - Fair', 'مستعمل - مقبول', 'used-fair'),
  ('Damaged', 'تالف', 'damaged'),
  ('Imported', 'مستورد', 'imported')
on conflict (slug) do nothing;

-- Car Colors
insert into public.car_colors (name, name_ar, hex_code, slug) values
  ('White', 'أبيض', '#FFFFFF', 'white'),
  ('Black', 'أسود', '#000000', 'black'),
  ('Silver', 'فضي', '#C0C0C0', 'silver'),
  ('Gray', 'رمادي', '#808080', 'gray'),
  ('Red', 'أحمر', '#FF0000', 'red'),
  ('Blue', 'أزرق', '#0000FF', 'blue'),
  ('Green', 'أخضر', '#008000', 'green'),
  ('Brown', 'بني', '#A52A2A', 'brown'),
  ('Beige', 'بيج', '#F5F5DC', 'beige'),
  ('Gold', 'ذهبي', '#FFD700', 'gold'),
  ('Dark Blue', 'أزرق غامق', '#00008B', 'dark-blue'),
  ('Dark Gray', 'رمادي غامق', '#A9A9A9', 'dark-gray')
on conflict (slug) do nothing;

-- Vehicle Statuses
insert into public.vehicle_statuses (name, name_ar, slug) values
  ('Available', 'متاح', 'available'),
  ('Reserved', 'محجوز', 'reserved'),
  ('Sold', 'مباع', 'sold'),
  ('Under Maintenance', 'قيد الصيانة', 'under-maintenance')
on conflict (slug) do nothing;

-- Dealer Subscription Plans
insert into public.dealer_subscription_plans (name, name_ar, slug, price_monthly, max_listings, max_staff, max_branches, has_analytics, has_wholesale, has_featured) values
  ('Free', 'مجاني', 'free', 0, 5, 1, 1, false, false, false),
  ('Basic', 'أساسي', 'basic', 299, 20, 3, 1, true, false, false),
  ('Professional', 'احترافي', 'professional', 999, 100, 10, 3, true, true, true),
  ('Enterprise', 'مؤسسي', 'enterprise', 2999, -1, -1, -1, true, true, true)
on conflict (slug) do nothing;

-- Default Payment Methods
insert into public.payment_methods (name, name_ar, slug) values
  ('Mada', 'مدى', 'mada'),
  ('Visa/Mastercard', 'فيزا/ماستركارد', 'card'),
  ('Apple Pay', 'أبل باي', 'apple-pay'),
  ('Bank Transfer', 'تحويل بنكي', 'bank-transfer'),
  ('Cash', 'نقداً', 'cash')
on conflict (slug) do nothing;

-- Inspection Services
insert into public.inspection_services (name, name_ar, slug, default_price, duration_minutes) values
  ('Comprehensive Inspection', 'فحص شامل', 'comprehensive', 299, 120),
  ('Basic Inspection', 'فحص أساسي', 'basic', 149, 60),
  ('Pre-Purchase Inspection', 'فحص ما قبل الشراء', 'pre-purchase', 399, 150),
  ('Engine Diagnostics', 'تشخيص المحرك', 'engine-diagnostics', 199, 45),
  ('Paint & Body Inspection', 'فحص الدهان والبدي', 'paint-body', 249, 90)
on conflict (slug) do nothing;

-- Spare Part Categories
insert into public.part_categories (name, name_ar, slug) values
  ('Engine Parts', 'قطع المحرك', 'engine-parts'),
  ('Transmission', 'ناقل الحركة', 'transmission'),
  ('Brakes', 'الفرامل', 'brakes'),
  ('Suspension', 'التعليق', 'suspension'),
  ('Electrical', 'الكهرباء', 'electrical'),
  ('Body Parts', 'قطع الهيكل', 'body-parts'),
  ('Interior', 'الداخلية', 'interior'),
  ('Air Conditioning', 'التكييف', 'ac'),
  ('Cooling System', 'نظام التبريد', 'cooling-system'),
  ('Exhaust', 'العادم', 'exhaust'),
  ('Tires & Wheels', 'الإطارات والعجلات', 'tires-wheels'),
  ('Lighting', 'الإضاءة', 'lighting'),
  ('Filters', 'الفلاتر', 'filters'),
  ('Belts & Hoses', 'السيور والخراطيم', 'belts-hoses')
on conflict (slug) do nothing;

-- Delivery Methods
insert into public.delivery_methods (name, name_ar, slug, estimated_days_min, estimated_days_max) values
  ('Standard Delivery', 'توصيل عادي', 'standard', 3, 7),
  ('Express Delivery', 'توصيل سريع', 'express', 1, 2),
  ('Same Day Delivery', 'توصيل نفس اليوم', 'same-day', 0, 1),
  ('Pickup from Branch', 'استلام من الفرع', 'pickup', 0, 0)
on conflict (slug) do nothing;

-- Notification Templates
insert into public.notification_templates (key, title, title_ar, body, body_ar, channels) values
  ('listing_approved', 'Listing Approved', 'تم الموافقة على الإعلان', 'Your listing "{title}" has been approved and is now live.', 'تمت الموافقة على إعلانك "{title}" وهو الآن منشور.', '["in_app"]'),
  ('listing_rejected', 'Listing Rejected', 'تم رفض الإعلان', 'Your listing "{title}" has been rejected. Reason: {reason}', 'تم رفض إعلانك "{title}". السبب: {reason}', '["in_app"]'),
  ('message_received', 'New Message', 'رسالة جديدة', 'You have a new message from {sender}.', 'لديك رسالة جديدة من {sender}.', '["in_app"]'),
  ('inspection_ready', 'Inspection Report Ready', 'تقرير الفحص جاهز', 'Your inspection report for {vehicle} is ready.', 'تقرير الفحص لـ {vehicle} جاهز.', '["in_app"]')
on conflict (key) do nothing;

