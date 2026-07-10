-- BD Platform - Corrected Demo Seed Data
-- Verified against live database schema (2026-07-10)
BEGIN;

-- =============================================
-- 1. Demo Auth User
-- =============================================
DO $$ DECLARE
  demo_uuid uuid := '00000000-0000-0000-0000-000000000001'::uuid;
  inst_uuid uuid := '00000000-0000-0000-0000-000000000000'::uuid;
BEGIN
  -- Ensure an auth instance exists (required FK for auth.users)
  INSERT INTO auth.instances (id, uuid, raw_base_config, created_at, updated_at)
  SELECT inst_uuid, inst_uuid, '{}', NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM auth.instances LIMIT 1);

  -- Create auth user (required FK for public.profiles)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, phone, is_sso_user, is_anonymous)
  SELECT demo_uuid, COALESCE((SELECT id FROM auth.instances LIMIT 1), inst_uuid), 'authenticated', 'authenticated', 'demo@bd.evico.sa', '$2a$10$dummy', NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW(), '0555000001', false, false
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo@bd.evico.sa');

  -- Create profile linked to auth user
  INSERT INTO public.profiles (id, phone, full_name, locale, is_active, created_at, updated_at)
  SELECT demo_uuid, '0555000001', 'معرض الرياض للسيارات', 'ar', true, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE phone = '0555000001');
END $$;

-- =============================================
-- 2. Vehicle Reference Data (idempotent)
-- =============================================
INSERT INTO public.vehicle_condition_types (name, name_ar, slug) VALUES
  ('New', 'جديد', 'new'), ('Used', 'مستعمل', 'used'), ('Certified Pre-Owned', 'مُعتمد', 'certified-pre-owned')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.fuel_types (name, name_ar, slug) VALUES
  ('Gasoline', 'بنزين', 'gasoline'), ('Diesel', 'ديزل', 'diesel'),
  ('Hybrid', 'هايبرد', 'hybrid'), ('Electric', 'كهرباء', 'electric')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.transmission_types (name, name_ar, slug) VALUES
  ('Automatic', 'أوتوماتيك', 'automatic'), ('CVT', 'CVT', 'cvt'), ('Dual-Clutch', 'دبل كلتش', 'dual-clutch')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.drivetrain_types (name, name_ar, slug) VALUES
  ('FWD', 'دفع أمامي', 'fwd'), ('RWD', 'دفع خلفي', 'rwd'), ('AWD', 'دفع كلي', 'awd'), ('4WD', 'دفع رباعي', '4wd')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.body_types (name, name_ar, slug) VALUES
  ('Sedan', 'سيدان', 'sedan'), ('SUV', 'دفع رباعي', 'suv'), ('Crossover', 'كروس أوفر', 'crossover'),
  ('Coupe', 'كوبيه', 'coupe'), ('Convertible', 'مكشوف', 'convertible'), ('Truck', 'شاحنة', 'truck'),
  ('Hatchback', 'هاتشباك', 'hatchback')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.car_colors (name, name_ar, hex_code, slug) VALUES
  ('White', 'أبيض', '#FFFFFF', 'white'), ('Black', 'أسود', '#000000', 'black'),
  ('Silver', 'فضي', '#C0C0C0', 'silver'), ('Gray', 'رمادي', '#808080', 'gray'),
  ('Blue', 'أزرق', '#0000FF', 'blue'), ('Red', 'أحمر', '#FF0000', 'red')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 3. Car Makes (15 brands)
-- =============================================
INSERT INTO public.car_makes (name, name_ar, slug, country, is_active) VALUES
  ('Toyota', 'تويوتا', 'toyota', 'Japan', true), ('Nissan', 'نيسان', 'nissan', 'Japan', true),
  ('Hyundai', 'هيونداي', 'hyundai', 'South Korea', true), ('Mercedes-Benz', 'مرسيدس', 'mercedes-benz', 'Germany', true),
  ('BMW', 'بي ام دبليو', 'bmw', 'Germany', true), ('Ford', 'فورد', 'ford', 'USA', true),
  ('Kia', 'كيا', 'kia', 'South Korea', true), ('Chevrolet', 'شيفروليه', 'chevrolet', 'USA', true),
  ('Honda', 'هوندا', 'honda', 'Japan', true), ('Mazda', 'مازدا', 'mazda', 'Japan', true),
  ('Lexus', 'لكزس', 'lexus', 'Japan', true), ('GMC', 'جي ام سي', 'gmc', 'USA', true),
  ('Cadillac', 'كاديلاك', 'cadillac', 'USA', true), ('BYD', 'بي واي دي', 'byd', 'China', true),
  ('Tesla', 'تسلا', 'tesla', 'USA', true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 4. Car Models
-- =============================================
DO $$ DECLARE v uuid; BEGIN
  SELECT id INTO v FROM public.car_makes WHERE slug = 'toyota';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Camry', 'كامري', 'camry'), (v, 'Corolla', 'كورولا', 'corolla'),
    (v, 'Land Cruiser', 'لاند كروزر', 'land-cruiser'), (v, 'RAV4', 'راف فور', 'rav4'),
    (v, 'Hilux', 'هايلكس', 'hilux') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'nissan';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Altima', 'التيمة', 'altima'), (v, 'Patrol', 'باترول', 'patrol'),
    (v, 'Sunny', 'صني', 'sunny'), (v, 'X-Trail', 'اكس تريل', 'x-trail'),
    (v, 'Pathfinder', 'باثفايندر', 'pathfinder') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'hyundai';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Sonata', 'سوناتا', 'sonata'), (v, 'Tucson', 'توسان', 'tucson'),
    (v, 'Elantra', 'النترا', 'elantra'), (v, 'Santa Fe', 'سانتا في', 'santa-fe'),
    (v, 'Palisade', 'باليسيد', 'palisade') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'mercedes-benz';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'C-Class', 'سي كلاس', 'c-class'), (v, 'E-Class', 'إي كلاس', 'e-class'),
    (v, 'S-Class', 'إس كلاس', 's-class'), (v, 'GLE', 'جي إل إي', 'gle'),
    (v, 'GLC', 'جي إل سي', 'glc') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'bmw';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, '3 Series', 'الفئة الثالثة', '3-series'), (v, '5 Series', 'الفئة الخامسة', '5-series'),
    (v, 'X5', 'إكس 5', 'x5'), (v, 'X3', 'إكس 3', 'x3'),
    (v, '7 Series', 'الفئة السابعة', '7-series') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'ford';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Explorer', 'إكسبلورر', 'explorer'), (v, 'Mustang', 'موستانج', 'mustang'),
    (v, 'Focus', 'فوكس', 'focus'), (v, 'F-150', 'إف 150', 'f-150'),
    (v, 'Edge', 'إيدج', 'edge') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'kia';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Sportage', 'سبورتاج', 'sportage'), (v, 'Seltos', 'سيلتوس', 'seltos'),
    (v, 'K5', 'كي 5', 'k5'), (v, 'Sorento', 'سورينتو', 'sorento'),
    (v, 'Picanto', 'بيكانتو', 'picanto') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'chevrolet';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Tahoe', 'تاهو', 'tahoe'), (v, 'Malibu', 'ماليبو', 'malibu'),
    (v, 'Camaro', 'كامارو', 'camaro'), (v, 'Suburban', 'سابربربان', 'suburban'),
    (v, 'Traverse', 'ترافيرس', 'traverse') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'honda';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Civic', 'سيفيك', 'civic'), (v, 'Accord', 'أكورد', 'accord'),
    (v, 'CR-V', 'سي آر في', 'cr-v'), (v, 'HR-V', 'إتش آر في', 'hr-v'),
    (v, 'Pilot', 'بايلوت', 'pilot') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'mazda';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'CX-5', 'سي إكس 5', 'cx-5'), (v, 'Mazda3', 'مازدا 3', 'mazda3'),
    (v, 'Mazda6', 'مازدا 6', 'mazda6'), (v, 'CX-9', 'سي إكس 9', 'cx-9'),
    (v, 'MX-5', 'إم إكس 5', 'mx-5') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'lexus';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'ES', 'إي إس', 'es'), (v, 'RX', 'آر إكس', 'rx'),
    (v, 'NX', 'إن إكس', 'nx'), (v, 'LX', 'إل إكس', 'lx'),
    (v, 'LS', 'إل إس', 'ls') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'byd';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Atto 3', 'أتو 3', 'atto-3'), (v, 'Seal', 'سيل', 'seal'),
    (v, 'Han', 'هان', 'han'), (v, 'Tang', 'تانغ', 'tang'),
    (v, 'Dolphin', 'دولفين', 'dolphin') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'tesla';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Model 3', 'موديل 3', 'model-3'), (v, 'Model Y', 'موديل واي', 'model-y'),
    (v, 'Model S', 'موديل إس', 'model-s'), (v, 'Model X', 'موديل إكس', 'model-x'),
    (v, 'Cybertruck', 'سايبرتراك', 'cybertruck') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'gmc';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Yukon', 'يوكن', 'yukon'), (v, 'Sierra', 'سييرا', 'sierra'),
    (v, 'Terrain', 'تيرين', 'terrain'), (v, 'Acadia', 'أكاديا', 'acadia'),
    (v, 'Canyon', 'كانيون', 'canyon') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'cadillac';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Escalade', 'إسكاليد', 'escalade'), (v, 'CT5', 'سي تي 5', 'ct5'),
    (v, 'XT5', 'إكس تي 5', 'xt5'), (v, 'XT4', 'إكس تي 4', 'xt4'),
    (v, 'Lyriq', 'ليريك', 'lyriq') ON CONFLICT (make_id, slug) DO NOTHING;
END $$;

-- =============================================
-- 5. Demo Vehicles + Listings
-- =============================================
DO $$ DECLARE
  demo_user_id uuid;
  riyadh_id uuid; jeddah_id uuid; dammam_id uuid; khobar_id uuid;
  makes RECORD; models RECORD; colors RECORD; fuels RECORD; trans RECORD; drives RECORD; bodies RECORD; conds RECORD;
  v_id uuid; city_id uuid;
  c_white uuid; c_black uuid; c_silver uuid; c_gray uuid; c_blue uuid; c_red uuid;
  f_gas uuid; f_electric uuid; t_auto uuid; t_cvt uuid;
  d_fwd uuid; d_rwd uuid; d_awd uuid; d_4wd uuid;
  b_sedan uuid; b_suv uuid; b_coupe uuid;
  n_new uuid; n_used uuid;
BEGIN
  demo_user_id := '00000000-0000-0000-0000-000000000001'::uuid;
  SELECT id INTO riyadh_id FROM public.cities WHERE name = 'Riyadh';
  SELECT id INTO jeddah_id FROM public.cities WHERE name = 'Jeddah';
  SELECT id INTO dammam_id FROM public.cities WHERE name = 'Dammam';
  SELECT id INTO khobar_id FROM public.cities WHERE name = 'Al-Khobar';
  SELECT id INTO c_white FROM public.car_colors WHERE slug = 'white';
  SELECT id INTO c_black FROM public.car_colors WHERE slug = 'black';
  SELECT id INTO c_silver FROM public.car_colors WHERE slug = 'silver';
  SELECT id INTO c_gray FROM public.car_colors WHERE slug = 'gray';
  SELECT id INTO c_blue FROM public.car_colors WHERE slug = 'blue';
  SELECT id INTO c_red FROM public.car_colors WHERE slug = 'red';
  SELECT id INTO f_gas FROM public.fuel_types WHERE slug = 'gasoline';
  SELECT id INTO f_electric FROM public.fuel_types WHERE slug = 'electric';
  SELECT id INTO t_auto FROM public.transmission_types WHERE slug = 'automatic';
  SELECT id INTO t_cvt FROM public.transmission_types WHERE slug = 'cvt';
  SELECT id INTO d_fwd FROM public.drivetrain_types WHERE slug = 'fwd';
  SELECT id INTO d_rwd FROM public.drivetrain_types WHERE slug = 'rwd';
  SELECT id INTO d_awd FROM public.drivetrain_types WHERE slug = 'awd';
  SELECT id INTO d_4wd FROM public.drivetrain_types WHERE slug = '4wd';
  SELECT id INTO b_sedan FROM public.body_types WHERE slug = 'sedan';
  SELECT id INTO b_suv FROM public.body_types WHERE slug = 'suv';
  SELECT id INTO b_coupe FROM public.body_types WHERE slug = 'coupe';
  SELECT id INTO n_new FROM public.vehicle_condition_types WHERE slug = 'new';
  SELECT id INTO n_used FROM public.vehicle_condition_types WHERE slug = 'used';

  -- Helper macro simulation: create_vehicle(make_slug, model_slug, year, mileage, color_id, fuel_id, trans_id, drive_id, body_id, cond_id, city_id, price, is_featured, price_text, slug)
  -- Done manually for each vehicle

  -- 1. Toyota Camry 2024
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'camry' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'toyota');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar, is_agency)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'toyota'), v_id, 2024, 15000, 'km', c_white, f_gas, t_auto, d_fwd, b_sedan, n_used, riyadh_id, 4, 203, 2.5, 4, 5, 'تويوتا كامري 2024 بحالة ممتازة. صيانة دورية كاملة.', true)
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Toyota Camry 2024 LE', 'تويوتا كامري 2024 LE', 'toyota-camry-2024', 'كامري 2024 بحالة ممتازة. صيانة وكالة. مواصفات خليجية.', 85000, 'SAR', 'active', 'private', true, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/camry-1.jpg', true, 1), (v_id, '/images/demo/camry-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 2. Nissan Altima 2023
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'altima' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'nissan');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'nissan'), v_id, 2023, 25000, 'km', c_black, f_gas, t_cvt, d_fwd, b_sedan, n_used, jeddah_id, 4, 188, 2.5, 4, 5, 'نيسان التيما 2023 SV. نظيفة ومضمونة.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Nissan Altima SV 2023', 'نيسان التيما 2023 SV', 'nissan-altima-2023', 'SV كاملة. فتحة سقف. جلد. مواصفات خليجية.', 72000, 'SAR', 'active', 'private', false, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/altima-1.jpg', true, 1);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 3. Hyundai Sonata 2024
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'sonata' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'hyundai');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'hyundai'), v_id, 2024, 10000, 'km', c_silver, f_gas, t_auto, d_fwd, b_sedan, n_new, riyadh_id, 4, 191, 2.5, 4, 5, 'هيونداي سوناتا 2024 فل كامل. بحالة الوكالة.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, is_instant_buy, has_inspection)
  VALUES (v_id, demo_user_id, 'Hyundai Sonata Limited 2024', 'هيونداي سوناتا 2024 لمتد', 'hyundai-sonata-2024', 'لمتد كاملة. بانوراما. بوز. كاميرا 360.', 95000, 'SAR', 'active', 'private', true, true, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/sonata-1.jpg', true, 1), (v_id, '/images/demo/sonata-2.jpg', false, 2), (v_id, '/images/demo/sonata-3.jpg', false, 3);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 4. Mercedes C300 2022
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'c-class' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'mercedes-benz');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'mercedes-benz'), v_id, 2022, 30000, 'km', c_gray, f_gas, t_auto, d_rwd, b_sedan, n_used, dammam_id, 4, 255, 2.0, 4, 5, 'مرسيدس C300 AMG 2022. وكالة. فئة Premium.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Mercedes C300 AMG 2022', 'مرسيدس C300 AMG 2022', 'mercedes-c300-2022', 'AMG لاين. بريميوم. بورميستر. مواصفات خليجية.', 145000, 'SAR', 'active', 'private', false, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/c300-1.jpg', true, 1), (v_id, '/images/demo/c300-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 5. BMW 320i 2023
  SELECT id INTO v_id FROM public.car_models WHERE slug = '3-series' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'bmw');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'bmw'), v_id, 2023, 20000, 'km', c_white, f_gas, t_auto, d_rwd, b_sedan, n_used, khobar_id, 4, 255, 2.0, 4, 5, 'بي ام دبليو 320i 2023. M سبورت. وكالة.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'BMW 320i M Sport 2023', 'بي إم دبليو 320i إم سبورت 2023', 'bmw-320i-2023', 'M سبورت. لايف كوكpit. هارمان كاردون.', 135000, 'SAR', 'active', 'private', false, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/320i-1.jpg', true, 1);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 6. Ford Explorer 2024
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'explorer' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'ford');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'ford'), v_id, 2024, 8000, 'km', c_black, f_gas, t_auto, d_4wd, b_suv, n_new, riyadh_id, 6, 300, 3.0, 4, 7, 'فورد إكسبلورر XLT 2024. 7 مقاعد. دفع رباعي.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Ford Explorer XLT 2024', 'فورد إكسبلورر XLT 2024', 'ford-explorer-2024', 'XLT. 7 مقاعد. الصف الثالث. فتحة سقف.', 165000, 'SAR', 'active', 'private', false, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/explorer-1.jpg', true, 1), (v_id, '/images/demo/explorer-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 7. Kia Sportage 2023
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'sportage' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'kia');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'kia'), v_id, 2023, 18000, 'km', c_blue, f_gas, t_auto, d_fwd, b_suv, n_used, riyadh_id, 4, 187, 2.5, 4, 5, 'كيا سبورتاج 2023 LX. دفع أمامي. اقتصادية.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Kia Sportage LX 2023', 'كيا سبورتاج LX 2023', 'kia-sportage-2023', 'LX. مفتاح ذكي. كاميرا خلفية.', 78000, 'SAR', 'active', 'private', false, false);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/sportage-1.jpg', true, 1);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 8. Chevy Tahoe 2022
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'tahoe' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'chevrolet');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'chevrolet'), v_id, 2022, 35000, 'km', c_white, f_gas, t_auto, d_4wd, b_suv, n_used, riyadh_id, 8, 355, 5.3, 4, 7, 'شيفروليه تاهو LT 2022. 7 مقاعد. V8.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Chevrolet Tahoe LT 2022', 'شيفروليه تاهو LT 2022', 'chevrolet-tahoe-2022', 'LT. V8. الصف الثالث. بوز. فتحة سقف.', 185000, 'SAR', 'active', 'private', false, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/tahoe-1.jpg', true, 1), (v_id, '/images/demo/tahoe-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 9. Honda Civic 2024
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'civic' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'honda');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'honda'), v_id, 2024, 5000, 'km', c_silver, f_gas, t_cvt, d_fwd, b_sedan, n_new, dammam_id, 4, 180, 1.5, 4, 5, 'هوندا سيفيك LX 2024. تيربو. بحالة الوكالة.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Honda Civic LX 2024', 'هوندا سيفيك LX 2024', 'honda-civic-2024', 'LX. 1.5 تيربو. CVT. هوندا سينسنج.', 82000, 'SAR', 'active', 'private', false, false);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/civic-1.jpg', true, 1);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 10. Mazda CX-5 2023
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'cx-5' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'mazda');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'mazda'), v_id, 2023, 22000, 'km', c_red, f_gas, t_auto, d_awd, b_suv, n_used, jeddah_id, 4, 187, 2.5, 4, 5, 'مازدا CX-5 تورينج 2023. دفع كلي.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Mazda CX-5 Touring 2023', 'مازدا CX-5 تورينج 2023', 'mazda-cx5-2023', 'تورينج. دفع كلي. جلد. بوز. فتحة سقف.', 88000, 'SAR', 'active', 'private', false, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/cx5-1.jpg', true, 1), (v_id, '/images/demo/cx5-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 11. Lexus ES350 2024
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'es' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'lexus');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'lexus'), v_id, 2024, 7000, 'km', c_white, f_gas, t_auto, d_fwd, b_sedan, n_new, riyadh_id, 6, 302, 3.5, 4, 5, 'لكزس ES350 لكجري 2024. سيدان فاخرة.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Lexus ES350 Luxury 2024', 'لكزس ES350 لكجري 2024', 'lexus-es350-2024', 'لكجري. مارك ليفنسون. مقاعد مدفأة ومبردة.', 195000, 'SAR', 'active', 'private', true, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/es350-1.jpg', true, 1), (v_id, '/images/demo/es350-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 12. Nissan Patrol 2023
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'patrol' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'nissan');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'nissan'), v_id, 2023, 15000, 'km', c_white, f_gas, t_auto, d_4wd, b_suv, n_used, riyadh_id, 6, 400, 4.0, 4, 7, 'نيسان باترول LE 2023. 7 مقاعد.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Nissan Patrol LE 2023', 'نيسان باترول LE 2023', 'nissan-patrol-2023', 'LE. V6. 7 مقاعد. صوت ممتاز.', 220000, 'SAR', 'active', 'private', true, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/patrol-1.jpg', true, 1), (v_id, '/images/demo/patrol-2.jpg', false, 2), (v_id, '/images/demo/patrol-3.jpg', false, 3);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 13. Toyota Land Cruiser 2024
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'land-cruiser' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'toyota');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'toyota'), v_id, 2024, 3000, 'km', c_gray, f_gas, t_auto, d_4wd, b_suv, n_new, jeddah_id, 6, 415, 3.5, 4, 7, 'تويوتا لاند كروزر GXR 2024. V6 توين تيربو.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Toyota Land Cruiser GXR 2024', 'تويوتا لاند كروزر GXR 2024', 'toyota-lc-2024', 'GXR. 3.5 توين تيربو V6. 7 مقاعد. متعدد التضاريس.', 285000, 'SAR', 'active', 'private', true, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/lc300-1.jpg', true, 1), (v_id, '/images/demo/lc300-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 14. BMW X5 2022
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'x5' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'bmw');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'bmw'), v_id, 2022, 28000, 'km', c_black, f_gas, t_auto, d_awd, b_suv, n_used, khobar_id, 6, 335, 3.0, 4, 5, 'بي ام دبليو X5 xDrive40i 2022. M سبورت.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'BMW X5 xDrive40i 2022', 'بي إم دبليو X5 xDrive40i 2022', 'bmw-x5-2022', 'M سبورت. 3.0. باورز آند ويلكنز. إكسيكيوتيف.', 245000, 'SAR', 'active', 'private', false, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/x5-1.jpg', true, 1), (v_id, '/images/demo/x5-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 15. Mercedes GLE 2023
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'gle' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'mercedes-benz');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'mercedes-benz'), v_id, 2023, 12000, 'km', c_white, f_gas, t_auto, d_awd, b_suv, n_used, riyadh_id, 6, 362, 3.0, 4, 5, 'مرسيدس GLE300 2023. 4MATIC.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Mercedes GLE300 4MATIC 2023', 'مرسيدس GLE300 4MATIC 2023', 'mercedes-gle-2023', 'AMG لاين. بريميوم بلس. بانوراما. بورميستر.', 265000, 'SAR', 'active', 'private', true, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/gle-1.jpg', true, 1), (v_id, '/images/demo/gle-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 16. BYD Atto 3 2024
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'atto-3' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'byd');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'byd'), v_id, 2024, 2000, 'km', c_blue, f_electric, t_auto, d_fwd, b_suv, n_new, riyadh_id, 4, 5, 'بي واي دي أتو 3 2024. كهرباء. مدى 420 كم.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'BYD Atto 3 Electric 2024', 'بي واي دي أتو 3 كهرباء 2024', 'byd-atto3-2024', 'SUV كهربائية. مدى 420 كم. شاحن 7 كيلوواط.', 115000, 'SAR', 'active', 'private', false, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/atto3-1.jpg', true, 1), (v_id, '/images/demo/atto3-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 17. Tesla Model 3 2023
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'model-3' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'tesla');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'tesla'), v_id, 2023, 10000, 'km', c_white, f_electric, t_auto, d_rwd, b_sedan, n_used, dammam_id, 4, 5, 'تسلا موديل 3 2023. لونج رينج.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Tesla Model 3 Long Range 2023', 'تسلا موديل 3 لونج رينج 2023', 'tesla-model3-2023', 'لونج رينج. مقاعد بيضاء. FSD.', 145000, 'SAR', 'active', 'private', true, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/model3-1.jpg', true, 1), (v_id, '/images/demo/model3-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 18. Ford Mustang GT 2021
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'mustang' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'ford');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'ford'), v_id, 2021, 40000, 'km', c_red, f_gas, t_auto, d_rwd, b_coupe, n_used, jeddah_id, 8, 450, 5.0, 2, 4, 'فورد موستانج GT 2021. V8. رياضية.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Ford Mustang GT V8 2021', 'فورد موستانج GT V8 2021', 'ford-mustang-2021', 'GT بريميوم. 5.0 V8. حزمة المسار. عادم رياضي.', 155000, 'SAR', 'active', 'private', false, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/mustang-1.jpg', true, 1);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 19. GMC Yukon 2024
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'yukon' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'gmc');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'gmc'), v_id, 2024, 6000, 'km', c_black, f_gas, t_auto, d_4wd, b_suv, n_new, riyadh_id, 8, 420, 6.2, 4, 7, 'جي ام سي يوكن دينالي 2024. V8. فخامة.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'GMC Yukon Denali 2024', 'جي إم سي يوكن دينالي 2024', 'gmc-yukon-2024', 'دينالي ألتيميت. 6.2 V8. سوبر كروز. جنوط 22.', 275000, 'SAR', 'active', 'private', false, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/yukon-1.jpg', true, 1), (v_id, '/images/demo/yukon-2.jpg', false, 2);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

  -- 20. Cadillac Escalade 2022
  SELECT id INTO v_id FROM public.car_models WHERE slug = 'escalade' AND make_id = (SELECT id FROM public.car_makes WHERE slug = 'cadillac');
  INSERT INTO public.vehicles (id, owner_id, make_id, model_id, year, mileage, mileage_unit, color_id, fuel_type_id, transmission_id, drivetrain_id, body_type_id, condition_id, city_id, cylinders, horsepower, engine_size, doors, seats, description_ar)
  VALUES (gen_random_uuid(), demo_user_id, (SELECT id FROM public.car_makes WHERE slug = 'cadillac'), v_id, 2022, 20000, 'km', c_white, f_gas, t_auto, d_4wd, b_suv, n_used, jeddah_id, 8, 420, 6.2, 4, 7, 'كاديلاك إسكاليد 2022. بريميوم لكجري.')
  RETURNING id INTO v_id;
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, title, title_ar, slug, description_ar, price, currency, status, seller_type, is_featured, has_inspection)
  VALUES (v_id, demo_user_id, 'Cadillac Escalade Premium Luxury 2022', 'كاديلاك إسكاليد بريميوم لكجري 2022', 'cadillac-escalade-2022', 'بريميوم لكجري. 6.2 V8. AKG. سوبر كروز. جنوط 22.', 310000, 'SAR', 'active', 'private', false, true);
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_id, '/images/demo/escalade-1.jpg', true, 1), (v_id, '/images/demo/escalade-2.jpg', false, 2), (v_id, '/images/demo/escalade-3.jpg', false, 3);
  INSERT INTO public.vehicle_status_history (vehicle_id, status) VALUES (v_id, 'active');

END $$;

-- =============================================
-- 6. Ad Placements
-- =============================================
INSERT INTO public.ad_placements (name, slug, description, is_active) VALUES
  ('Homepage Banner', 'homepage_banner', 'Main banner on homepage', true),
  ('Search Results Sidebar', 'search_sidebar', 'Sidebar ad on search results', true),
  ('Listing Detail Sidebar', 'listing_sidebar', 'Sidebar ad on listing detail page', true),
  ('Homepage Sponsor', 'homepage_sponsor', 'Sponsored section on homepage', true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 7. Demo Advertiser + Campaigns
-- =============================================
DO $$ DECLARE adv_id uuid; BEGIN
  INSERT INTO public.advertisers (name, slug, is_active)
  VALUES ('معرض الرياض للسيارات', 'riyadh-showroom', true)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO adv_id FROM public.advertisers WHERE slug = 'riyadh-showroom';

  INSERT INTO public.ad_campaigns (advertiser_id, name, type, placement, budget, spent, start_date, end_date, status, target_url)
  VALUES (adv_id, 'ترويج السيارات', 'banner', 'homepage_banner', 5000, 1200, NOW(), NOW() + INTERVAL '30 days', 'active', '/listings');

  INSERT INTO public.ad_campaigns (advertiser_id, name, type, placement, budget, spent, start_date, end_date, status, target_url)
  VALUES (adv_id, 'راعي الصفحة الرئيسية', 'sponsor', 'homepage_sponsor', 10000, 3400, NOW(), NOW() + INTERVAL '30 days', 'active', '/dealers/riyadh-showroom');
END $$;

COMMIT;
