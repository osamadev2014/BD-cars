-- =============================================
-- Ryon - Unified Seed Data (for Supabase CLI)
-- =============================================
-- This file is auto-loaded by `supabase db reset`
-- and `supabase db seed`.
--
-- NOTE: Roles, permissions, settings, and reference
-- data are already in migration 00012_seed_data.sql
-- and run automatically. This file adds demo data
-- for local development.
--
-- Run: supabase db seed
-- Or it runs automatically with: supabase db reset

-- =============================================
-- 1. DEMO USERS (via Supabase Auth)
-- =============================================
-- NOTE: Users must be created via Supabase Auth API.
-- The create-admin.mjs and create-demo-users.mjs
-- scripts handle this. See: npm run seed:users

-- =============================================
-- 2. DEMO VEHICLES & LISTINGS
-- =============================================

do $$
declare
  v_vehicle_1 uuid := gen_random_uuid();
  v_vehicle_2 uuid := gen_random_uuid();
  v_vehicle_3 uuid := gen_random_uuid();
  v_vehicle_4 uuid := gen_random_uuid();
  v_vehicle_5 uuid := gen_random_uuid();
  v_vehicle_6 uuid := gen_random_uuid();
  v_vehicle_7 uuid := gen_random_uuid();
  v_vehicle_8 uuid := gen_random_uuid();
  v_vehicle_9 uuid := gen_random_uuid();
  v_vehicle_10 uuid := gen_random_uuid();
  v_vehicle_11 uuid := gen_random_uuid();
  v_vehicle_12 uuid := gen_random_uuid();
  v_vehicle_13 uuid := gen_random_uuid();
  v_vehicle_14 uuid := gen_random_uuid();
  v_vehicle_15 uuid := gen_random_uuid();
  v_vehicle_16 uuid := gen_random_uuid();
  v_vehicle_17 uuid := gen_random_uuid();
  v_vehicle_18 uuid := gen_random_uuid();
  v_vehicle_19 uuid := gen_random_uuid();
  v_vehicle_20 uuid := gen_random_uuid();

  v_toyota_id uuid;
  v_hyundai_id uuid;
  v_nissan_id uuid;
  v_honda_id uuid;
  v_bmw_id uuid;
  v_mercedes_id uuid;
  v_ford_id uuid;
  v_chevrolet_id uuid;
  v_kia_id uuid;
  v_lexus_id uuid;

  v_sedan_id uuid;
  v_suv_id uuid;
  v_coupe_id uuid;
  v_pickup_id uuid;

  v_gasoline_id uuid;
  v_diesel_id uuid;
  v_hybrid_id uuid;

  v_auto_id uuid;
  v_manual_id uuid;

  v_available_id uuid;
  v_used_excellent_id uuid;
  v_used_good_id uuid;
  v_new_id uuid;
  v_riyadh_id uuid;
  v_jeddah_id uuid;
  v_dammam_id uuid;
  v_seller_id uuid;
begin
  -- Get reference data IDs
  select id into v_toyota_id from public.car_makes where slug = 'toyota';
  select id into v_hyundai_id from public.car_makes where slug = 'hyundai';
  select id into v_nissan_id from public.car_makes where slug = 'nissan';
  select id into v_honda_id from public.car_makes where slug = 'honda';
  select id into v_bmw_id from public.car_makes where slug = 'bmw';
  select id into v_mercedes_id from public.car_makes where slug = 'mercedes-benz';
  select id into v_ford_id from public.car_makes where slug = 'ford';
  select id into v_chevrolet_id from public.car_makes where slug = 'chevrolet';
  select id into v_kia_id from public.car_makes where slug = 'kia';
  select id into v_lexus_id from public.car_makes where slug = 'lexus';

  select id into v_sedan_id from public.body_types where slug = 'sedan';
  select id into v_suv_id from public.body_types where slug = 'suv';
  select id into v_coupe_id from public.body_types where slug = 'coupe';
  select id into v_pickup_id from public.body_types where slug = 'pickup';

  select id into v_gasoline_id from public.fuel_types where slug = 'gasoline';
  select id into v_diesel_id from public.fuel_types where slug = 'diesel';
  select id into v_hybrid_id from public.fuel_types where slug = 'hybrid';

  select id into v_auto_id from public.transmission_types where slug = 'automatic';
  select id into v_manual_id from public.transmission_types where slug = 'manual';

  select id into v_available_id from public.vehicle_statuses where slug = 'available';

  -- Get condition type IDs
  select id into v_used_excellent_id from public.vehicle_condition_types where slug = 'used-excellent';
  select id into v_used_good_id from public.vehicle_condition_types where slug = 'used-good';
  select id into v_new_id from public.vehicle_condition_types where slug = 'new';

  select id into v_riyadh_id from public.cities where name = 'Riyadh';
  select id into v_jeddah_id from public.cities where name = 'Jeddah';
  select id into v_dammam_id from public.cities where name = 'Dammam';

  -- Get first available auth user as seller
  select id into v_seller_id from auth.users limit 1;

  -- Skip if no reference data (migrations haven't run seed_data yet)
  if v_toyota_id is null then
    raise notice 'Reference data not found. Run migrations first.';
    return;
  end if;

  -- If no auth users exist, skip vehicle inserts (owner_id is NOT NULL FK)
  if v_seller_id is null then
    raise notice 'No auth users found. Skipping vehicle inserts. Run create-demo-users first.';
  end if;

  -- =============================================
  -- INSERT 20 VEHICLES (only if seller exists)
  -- =============================================
  -- vehicles table columns: id, owner_id, make_id, model_id, trim_id,
  -- generation_id, year, mileage, mileage_unit, color_id, fuel_type_id,
  -- transmission_id, drivetrain_id, body_type_id, condition_id, vin,
  -- plate_number, chassis_number, engine_number, cylinders, horsepower,
  -- engine_size, doors, seats, color, interior_color, description,
  -- description_ar, city_id, district_id, is_imported, is_agency,
  -- has_accident_history, has_service_history, warranty_months, created_at, updated_at

  if v_seller_id is not null then

    -- Vehicle 1: Toyota Camry 2023
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_1, v_seller_id, v_toyota_id, 2023, 15000, 'أبيض', 'JTDKN3DU5A0123456', v_riyadh_id, v_used_excellent_id, v_gasoline_id, v_auto_id, v_sedan_id);

    -- Vehicle 2: Hyundai Tucson 2024
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_2, v_seller_id, v_hyundai_id, 2024, 5000, 'أسود', 'TMAJ38LF5R1234567', v_riyadh_id, v_new_id, v_gasoline_id, v_auto_id, v_suv_id);

    -- Vehicle 3: Nissan Patrol 2022
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_3, v_seller_id, v_nissan_id, 2022, 45000, 'فضي', 'JN8BTMJD1NW1234567', v_riyadh_id, v_used_good_id, v_gasoline_id, v_auto_id, v_suv_id);

    -- Vehicle 4: Honda Accord 2023
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_4, v_seller_id, v_honda_id, 2023, 20000, 'أزرق', '1HGCV2F34NA123456', v_jeddah_id, v_used_excellent_id, v_gasoline_id, v_auto_id, v_sedan_id);

    -- Vehicle 5: BMW X5 2024
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_5, v_seller_id, v_bmw_id, 2024, 3000, 'أسود', 'WBAPH5C55BA123456', v_riyadh_id, v_new_id, v_gasoline_id, v_auto_id, v_suv_id);

    -- Vehicle 6: Mercedes C-Class 2023
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_6, v_seller_id, v_mercedes_id, 2023, 18000, 'أبيض', 'WDDWF8DB5JA1234567', v_jeddah_id, v_used_excellent_id, v_gasoline_id, v_auto_id, v_sedan_id);

    -- Vehicle 7: Ford Ranger 2023
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_7, v_seller_id, v_ford_id, 2023, 30000, 'رمادي', '1FTER4FH5NKA12345', v_dammam_id, v_used_good_id, v_diesel_id, v_auto_id, v_pickup_id);

    -- Vehicle 8: Chevrolet Tahoe 2024
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_8, v_seller_id, v_chevrolet_id, 2024, 1000, 'أبيض', '1GNSKBKC8RR1234567', v_riyadh_id, v_new_id, v_gasoline_id, v_auto_id, v_suv_id);

    -- Vehicle 9: Kia Sportage 2023
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_9, v_seller_id, v_kia_id, 2023, 12000, 'أحمر', 'U5YPB81ABNK123456', v_jeddah_id, v_used_excellent_id, v_gasoline_id, v_auto_id, v_suv_id);

    -- Vehicle 10: Lexus RX 2024
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_10, v_seller_id, v_lexus_id, 2024, 2000, 'نيلي', 'JTJHK1FF5R2123456', v_riyadh_id, v_new_id, v_hybrid_id, v_auto_id, v_suv_id);

    -- Vehicle 11: Toyota Land Cruiser 2023
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_11, v_seller_id, v_toyota_id, 2023, 25000, 'بيج', 'JTEBX3FJ10K1234567', v_riyadh_id, v_used_good_id, v_gasoline_id, v_auto_id, v_suv_id);

    -- Vehicle 12: Hyundai Elantra 2024
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_12, v_seller_id, v_hyundai_id, 2024, 8000, 'فضي', '5NPEC4AC5RH1234567', v_dammam_id, v_used_excellent_id, v_gasoline_id, v_auto_id, v_sedan_id);

    -- Vehicle 13: Nissan Altima 2023
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_13, v_seller_id, v_nissan_id, 2023, 16000, 'رمادي', '4N1BL3BB5RC1234567', v_jeddah_id, v_used_excellent_id, v_gasoline_id, v_auto_id, v_sedan_id);

    -- Vehicle 14: BMW 320i 2023
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_14, v_seller_id, v_bmw_id, 2023, 22000, 'أبيض', 'WBA5R7C02NFD12345', v_riyadh_id, v_used_excellent_id, v_gasoline_id, v_auto_id, v_sedan_id);

    -- Vehicle 15: Ford Explorer 2024
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_15, v_seller_id, v_ford_id, 2024, 4000, 'أسود', '1FMSK8GC5RKA12345', v_dammam_id, v_new_id, v_gasoline_id, v_auto_id, v_suv_id);

    -- Vehicle 16: Honda Civic 2023
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_16, v_seller_id, v_honda_id, 2023, 10000, 'أزرق', '2HGFC2F69NH123456', v_riyadh_id, v_used_excellent_id, v_gasoline_id, v_auto_id, v_sedan_id);

    -- Vehicle 17: Mercedes E-Class 2024
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_17, v_seller_id, v_mercedes_id, 2024, 1500, 'أسود', 'W1K6G6FB5RA1234567', v_riyadh_id, v_new_id, v_gasoline_id, v_auto_id, v_sedan_id);

    -- Vehicle 18: Kia Sorento 2023
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_18, v_seller_id, v_kia_id, 2023, 14000, 'أبيض', '5XYPGDA59NG1234567', v_jeddah_id, v_used_good_id, v_gasoline_id, v_auto_id, v_suv_id);

    -- Vehicle 19: Chevrolet Camaro 2023
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_19, v_seller_id, v_chevrolet_id, 2023, 8000, 'أحمر', '2G1FB1ED3N91234567', v_riyadh_id, v_used_excellent_id, v_gasoline_id, v_auto_id, v_coupe_id);

    -- Vehicle 20: Toyota Corolla 2024
    insert into public.vehicles (id, owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
    values (v_vehicle_20, v_seller_id, v_toyota_id, 2024, 2000, 'فضي', '2T1BURHE5RC1234567', v_dammam_id, v_new_id, v_gasoline_id, v_auto_id, v_sedan_id);

    -- =============================================
    -- INSERT VEHICLE LISTINGS
    -- =============================================
  -- vehicle_listings columns: id, vehicle_id, seller_id, dealer_id, title,
  -- title_ar, slug, description, description_ar, price, original_price,
  -- currency, status, seller_type, is_featured, featured_until,
  -- is_instant_buy, instant_buy_price, has_inspection, inspection_report_id,
  -- is_auction, is_wholesale, is_dealer_only, views_count, inquiry_count,
  -- favorite_count, published_at, expires_at, created_at, updated_at

  if v_seller_id is not null then
    insert into public.vehicle_listings (vehicle_id, seller_id, slug, price, currency, title, title_ar, description, description_ar, seller_type, status, is_featured, is_instant_buy)
    values
      (v_vehicle_1, v_seller_id, 'toyota-camry-2023-white', 85000, 'SAR', 'Toyota Camry 2023 - Excellent', 'تويوتا كامري 2023 - ممتاز', 'Low mileage Toyota Camry in excellent condition', 'تويوتا كامري ب mileage قليل وحالة ممتازة', 'individual', 'published', true, true),
      (v_vehicle_2, v_seller_id, 'hyundai-tucson-2024-black', 120000, 'SAR', 'Hyundai Tucson 2024 - Brand New', 'هيونداي توسون 2024 - جديد', 'Brand new Hyundai Tucson with full warranty', 'هيونداي توسون جديد بضمان كامل', 'dealer', 'published', true, true),
      (v_vehicle_3, v_seller_id, 'nissan-patrol-2022-silver', 195000, 'SAR', 'Nissan Patrol 2022', 'نيسان باترول 2022', 'Nissan Patrol V6 in good condition', 'نيسان باترول V6 بحالة جيدة', 'individual', 'published', false, true),
      (v_vehicle_4, v_seller_id, 'honda-accord-2023-blue', 95000, 'SAR', 'Honda Accord 2023', 'هوندا أكورد 2023', 'Honda Accord with low mileage', 'هوندا أكورد ب mileage قليل', 'individual', 'published', false, true),
      (v_vehicle_5, v_seller_id, 'bmw-x5-2024-black', 320000, 'SAR', 'BMW X5 2024 - New', 'بي ام دبليو X5 2024 - جديد', 'Brand new BMW X5 xDrive40i', 'بي ام دبليو X5 جديد', 'dealer', 'published', true, false),
      (v_vehicle_6, v_seller_id, 'mercedes-cclass-2023-white', 210000, 'SAR', 'Mercedes C-Class 2023', 'مرسيدس C-Class 2023', 'Mercedes-Benz C200 in pristine condition', 'مرسيدس C200 بحالة ممتازة', 'dealer', 'published', true, false),
      (v_vehicle_7, v_seller_id, 'ford-ranger-2023-gray', 105000, 'SAR', 'Ford Ranger 2023', 'فورد رينجر 2023', 'Ford Ranger Wildtrak diesel pickup', 'فورد رينجر ديزل بيك أب', 'individual', 'published', false, true),
      (v_vehicle_8, v_seller_id, 'chevrolet-tahoe-2024-white', 250000, 'SAR', 'Chevrolet Tahoe 2024 - New', 'شيفروليه تاهو 2024 - جديد', 'Brand new Chevrolet Tahoe', 'شيفروليه تاهو جديد', 'dealer', 'published', true, false),
      (v_vehicle_9, v_seller_id, 'kia-sportage-2023-red', 98000, 'SAR', 'Kia Sportage 2023', 'كيا سبورتاج 2023', 'Kia Sportage in excellent condition', 'كيا سبورتاج بحالة ممتازة', 'individual', 'published', false, true),
      (v_vehicle_10, v_seller_id, 'lexus-rx-2024-blue', 280000, 'SAR', 'Lexus RX 350h 2024 - New', 'لكزس RX 350h 2024 - جديد', 'Brand new Lexus RX hybrid SUV', 'لكزس RX هايبرد جديد', 'dealer', 'published', true, false),
      (v_vehicle_11, v_seller_id, 'toyota-land-cruiser-2023-beige', 235000, 'SAR', 'Toyota Land Cruiser 2023', 'تويوتا لاند كروزر 2023', 'Toyota Land Cruiser VXR full options', 'تويوتا لاند كروزر فل أوبشن', 'individual', 'published', true, true),
      (v_vehicle_12, v_seller_id, 'hyundai-elantra-2024-silver', 72000, 'SAR', 'Hyundai Elantra 2024', 'هيونداي إلنترا 2024', 'Hyundai Elantra with low mileage', 'هيونداي إلنترا ب mileage قليل', 'individual', 'published', false, true),
      (v_vehicle_13, v_seller_id, 'nissan-altima-2023-gray', 78000, 'SAR', 'Nissan Altima 2023', 'نيسان ألتيا 2023', 'Nissan Altima SR in great condition', 'نيسان ألتيا SR بحالة ممتازة', 'dealer', 'published', false, true),
      (v_vehicle_14, v_seller_id, 'bmw-320i-2023-white', 165000, 'SAR', 'BMW 320i 2023', 'بي ام دبليو 320i 2023', 'BMW 320i M Sport package', 'بي ام دبليو 320i حزمة M سبورت', 'dealer', 'published', true, false),
      (v_vehicle_15, v_seller_id, 'ford-explorer-2024-black', 175000, 'SAR', 'Ford Explorer 2024 - New', 'فورد إكسبلورر 2024 - جديد', 'Brand new Ford Explorer ST', 'فورد إكسبلورر ST جديد', 'dealer', 'published', true, false),
      (v_vehicle_16, v_seller_id, 'honda-civic-2023-blue', 82000, 'SAR', 'Honda Civic 2023', 'هوندا سيفيك 2023', 'Honda Civic Sport with sunroof', 'هوندا سيفيك سبورت بفتحة سقف', 'individual', 'published', false, true),
      (v_vehicle_17, v_seller_id, 'mercedes-eclass-2024-black', 290000, 'SAR', 'Mercedes E-Class 2024 - New', 'مرسيدس E-Class 2024 - جديد', 'Brand new Mercedes-Benz E300', 'مرسيدس E300 جديد', 'dealer', 'published', true, false),
      (v_vehicle_18, v_seller_id, 'kia-sorento-2023-white', 115000, 'SAR', 'Kia Sorento 2023', 'كيا سوريتبيو 2023', 'Kia Sorento EX 7-seater', 'كيا سوريتبيو EX 7 مقاعد', 'individual', 'published', false, true),
      (v_vehicle_19, v_seller_id, 'chevrolet-camaro-2023-red', 185000, 'SAR', 'Chevrolet Camaro 2023', 'شيفروليه كامارو 2023', 'Chevrolet Camaro SS V8', 'شيفروليه كامارو SS V8', 'individual', 'published', false, true),
      (v_vehicle_20, v_seller_id, 'toyota-corolla-2024-silver', 68000, 'SAR', 'Toyota Corolla 2024 - New', 'تويوتا كورولا 2024 - جديد', 'Brand new Toyota Corolla', 'تويوتا كورولا جديد', 'individual', 'published', false, true)
    on conflict do nothing;
  end if;

  end if; -- close outer seller check for vehicles + listings

  -- =============================================
  -- INSERT VEHICLE IMAGES
  -- =============================================

  if v_seller_id is not null then
    insert into public.vehicle_images (vehicle_id, url, is_primary, sort_order)
    select v.id, img.url, img.is_primary, img.sort_order
    from (values
      (v_vehicle_1, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', true, 1),
      (v_vehicle_2, 'https://images.unsplash.com/photo-1633789242441-8a4206346e41?w=800', true, 1),
      (v_vehicle_3, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', true, 1),
      (v_vehicle_4, 'https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=800', true, 1),
      (v_vehicle_5, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', true, 1),
      (v_vehicle_6, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', true, 1),
      (v_vehicle_7, 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800', true, 1),
      (v_vehicle_8, 'https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=800', true, 1),
      (v_vehicle_9, 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800', true, 1),
      (v_vehicle_10, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800', true, 1),
      (v_vehicle_11, 'https://images.unsplash.com/photo-1594611775980-0e76a21a3a7c?w=800', true, 1),
      (v_vehicle_12, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', true, 1),
      (v_vehicle_13, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', true, 1),
      (v_vehicle_14, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', true, 1),
      (v_vehicle_15, 'https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=800', true, 1),
      (v_vehicle_16, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', true, 1),
      (v_vehicle_17, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', true, 1),
      (v_vehicle_18, 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800', true, 1),
      (v_vehicle_19, 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800', true, 1),
      (v_vehicle_20, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', true, 1)
    ) as img(vehicle_id, url, is_primary, sort_order)
    join public.vehicles v on v.id = img.vehicle_id
    on conflict do nothing;
  end if;

  -- =============================================
  -- INSERT DEMO INSPECTION CENTERS
  -- =============================================

  insert into public.inspection_centers (id, name, name_ar, slug, description, description_ar, phone, email, city_id, is_active)
  values
    (gen_random_uuid(), 'Ryon Inspection - Riyadh', 'فحص ريون - الرياض', 'ryon-inspection-riyadh', 'Official inspection center in Riyadh', 'مركز فحص رسمي في الرياض', '0550001001', 'riyadh@inspect.dev', v_riyadh_id, true),
    (gen_random_uuid(), 'Ryon Inspection - Jeddah', 'فحص ريون - جدة', 'ryon-inspection-jeddah', 'Official inspection center in Jeddah', 'مركز فحص رسمي في جدة', '0550001002', 'jeddah@inspect.dev', v_jeddah_id, true),
    (gen_random_uuid(), 'Ryon Inspection - Dammam', 'فحص ريون - الدمام', 'ryon-inspection-dammam', 'Official inspection center in Dammam', 'مركز فحص رسمي في الدمام', '0550001003', 'dammam@inspect.dev', v_dammam_id, true);

  -- =============================================
  -- INSERT DEMO DEALERS (only if seller exists)
  -- =============================================

  if v_seller_id is not null then
    insert into public.dealers (id, owner_id, name, name_ar, slug, description, description_ar, phone, email, city_id, is_active, rating, review_count)
    values
      (gen_random_uuid(), v_seller_id, 'AlJazirah Motors', 'الجاذرة للمحركات', 'aljazirah-motors', 'Premium car dealer in Riyadh', 'وكلاء سيارات فاخرة في الرياض', '0550002001', 'info@aljazirah.dev', v_riyadh_id, true, 4.5, 120),
      (gen_random_uuid(), v_seller_id, 'Gulf Auto Trading', 'تاراتج خليج للسيارات', 'gulf-auto-trading', 'Trusted used car dealer', 'وكلاء سيارات مستعملة موثوقين', '0550002002', 'info@gulfauto.dev', v_jeddah_id, true, 4.2, 85),
      (gen_random_uuid(), v_seller_id, 'Eastern Province Cars', 'سيارات المنطقة الشرقية', 'eastern-province-cars', 'Wide selection of vehicles', 'تشكيلة واسعة من المركبات', '0550002003', 'info@easterncars.dev', v_dammam_id, true, 4.0, 60),
      (gen_random_uuid(), v_seller_id, 'Saudi Premium Motors', 'المحركات السعودية المتميزة', 'saudi-premium-motors', 'Luxury vehicles specialist', 'متخصص في السيارات الفاخرة', '0550002004', 'info@saudipremium.dev', v_riyadh_id, true, 4.8, 200),
      (gen_random_uuid(), v_seller_id, 'Najd Auto Sales', 'نجد لبيع السيارات', 'najd-auto-sales', 'Best prices guaranteed', 'أسعار مضمونة', '0550002005', 'info@najdauto.dev', v_riyadh_id, true, 3.9, 45);
  end if;

end $$;

-- =============================================
-- 3. NOTE: Demo users must be created separately
-- via: node scripts/create-demo-users.mjs
-- This is because Supabase Auth users cannot be
-- created directly via SQL inserts.
-- =============================================
