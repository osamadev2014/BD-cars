-- Post-user seed: vehicles, listings, images, dealers
-- Run via: docker exec supabase_db_ryon-local psql -U postgres -d postgres -f /tmp/seed-after-users.sql

-- Vehicles (using admin user as owner)
DO $$
DECLARE
  v_seller uuid;
  v_toyota uuid := (SELECT id FROM car_makes WHERE slug = 'toyota' LIMIT 1);
  v_hyundai uuid := (SELECT id FROM car_makes WHERE slug = 'hyundai' LIMIT 1);
  v_nissan uuid := (SELECT id FROM car_makes WHERE slug = 'nissan' LIMIT 1);
  v_honda uuid := (SELECT id FROM car_makes WHERE slug = 'honda' LIMIT 1);
  v_bmw uuid := (SELECT id FROM car_makes WHERE slug = 'bmw' LIMIT 1);
  v_mercedes uuid := (SELECT id FROM car_makes WHERE slug = 'mercedes-benz' LIMIT 1);
  v_ford uuid := (SELECT id FROM car_makes WHERE slug = 'ford' LIMIT 1);
  v_chevrolet uuid := (SELECT id FROM car_makes WHERE slug = 'chevrolet' LIMIT 1);
  v_kia uuid := (SELECT id FROM car_makes WHERE slug = 'kia' LIMIT 1);
  v_lexus uuid := (SELECT id FROM car_makes WHERE slug = 'lexus' LIMIT 1);
  v_sedan uuid := (SELECT id FROM body_types WHERE slug = 'sedan' LIMIT 1);
  v_suv uuid := (SELECT id FROM body_types WHERE slug = 'suv' LIMIT 1);
  v_coupe uuid := (SELECT id FROM body_types WHERE slug = 'coupe' LIMIT 1);
  v_pickup uuid := (SELECT id FROM body_types WHERE slug = 'pickup' LIMIT 1);
  v_gasoline uuid := (SELECT id FROM fuel_types WHERE slug = 'gasoline' LIMIT 1);
  v_diesel uuid := (SELECT id FROM fuel_types WHERE slug = 'diesel' LIMIT 1);
  v_hybrid uuid := (SELECT id FROM fuel_types WHERE slug = 'hybrid' LIMIT 1);
  v_auto uuid := (SELECT id FROM transmission_types WHERE slug = 'automatic' LIMIT 1);
  v_exc uuid := (SELECT id FROM vehicle_condition_types WHERE slug = 'used-excellent' LIMIT 1);
  v_good uuid := (SELECT id FROM vehicle_condition_types WHERE slug = 'used-good' LIMIT 1);
  v_new uuid := (SELECT id FROM vehicle_condition_types WHERE slug = 'new' LIMIT 1);
  v_riyadh uuid := (SELECT id FROM cities WHERE name = 'Riyadh' LIMIT 1);
  v_jeddah uuid := (SELECT id FROM cities WHERE name = 'Jeddah' LIMIT 1);
  v_dammam uuid := (SELECT id FROM cities WHERE name = 'Dammam' LIMIT 1);
  v_count int;
BEGIN
  SELECT id INTO v_seller FROM auth.users WHERE phone = '966555000001';
  IF v_seller IS NULL THEN RAISE EXCEPTION 'No seller user found'; END IF;

  SELECT count(*) INTO v_count FROM vehicles;
  IF v_count > 0 THEN
    RAISE NOTICE 'Vehicles already exist (%), skipping', v_count;
    RETURN;
  END IF;

  INSERT INTO vehicles (owner_id, make_id, year, mileage, color, vin, city_id, condition_id, fuel_type_id, transmission_id, body_type_id)
  VALUES
    (v_seller, v_toyota, 2023, 15000, 'أبيض', 'JTDKN3DU5A0123456', v_riyadh, v_exc, v_gasoline, v_auto, v_sedan),
    (v_seller, v_hyundai, 2024, 5000, 'أسود', 'TMAJ38LF5R1234567', v_riyadh, v_new, v_gasoline, v_auto, v_suv),
    (v_seller, v_nissan, 2022, 45000, 'فضي', 'JN8BTMJD1NW1234567', v_riyadh, v_good, v_gasoline, v_auto, v_suv),
    (v_seller, v_honda, 2023, 20000, 'أزرق', '1HGCV2F34NA123456', v_jeddah, v_exc, v_gasoline, v_auto, v_sedan),
    (v_seller, v_bmw, 2024, 3000, 'أسود', 'WBAPH5C55BA123456', v_riyadh, v_new, v_gasoline, v_auto, v_suv),
    (v_seller, v_mercedes, 2023, 18000, 'أبيض', 'WDDWF8DB5JA1234567', v_jeddah, v_exc, v_gasoline, v_auto, v_sedan),
    (v_seller, v_ford, 2023, 30000, 'رمادي', '1FTER4FH5NKA12345', v_dammam, v_good, v_diesel, v_auto, v_pickup),
    (v_seller, v_chevrolet, 2024, 1000, 'أبيض', '1GNSKBKC8RR1234567', v_riyadh, v_new, v_gasoline, v_auto, v_suv),
    (v_seller, v_kia, 2023, 12000, 'أحمر', 'U5YPB81ABNK123456', v_jeddah, v_exc, v_gasoline, v_auto, v_suv),
    (v_seller, v_lexus, 2024, 2000, 'نيلي', 'JTJHK1FF5R2123456', v_riyadh, v_new, v_hybrid, v_auto, v_suv),
    (v_seller, v_toyota, 2023, 25000, 'بيج', 'JTEBX3FJ10K1234567', v_riyadh, v_good, v_gasoline, v_auto, v_suv),
    (v_seller, v_hyundai, 2024, 8000, 'فضي', '5NPEC4AC5RH1234567', v_dammam, v_exc, v_gasoline, v_auto, v_sedan),
    (v_seller, v_nissan, 2023, 16000, 'رمادي', '4N1BL3BB5RC1234567', v_jeddah, v_exc, v_gasoline, v_auto, v_sedan),
    (v_seller, v_bmw, 2023, 22000, 'أبيض', 'WBA5R7C02NFD12345', v_riyadh, v_exc, v_gasoline, v_auto, v_sedan),
    (v_seller, v_ford, 2024, 4000, 'أسود', '1FMSK8GC5RKA12345', v_dammam, v_new, v_gasoline, v_auto, v_suv),
    (v_seller, v_honda, 2023, 10000, 'أزرق', '2HGFC2F69NH123456', v_riyadh, v_exc, v_gasoline, v_auto, v_sedan),
    (v_seller, v_mercedes, 2024, 1500, 'أسود', 'W1K6G6FB5RA1234567', v_riyadh, v_new, v_gasoline, v_auto, v_sedan),
    (v_seller, v_kia, 2023, 14000, 'أبيض', '5XYPGDA59NG1234567', v_jeddah, v_good, v_gasoline, v_auto, v_suv),
    (v_seller, v_chevrolet, 2023, 8000, 'أحمر', '2G1FB1ED3N91234567', v_riyadh, v_exc, v_gasoline, v_auto, v_coupe),
    (v_seller, v_toyota, 2024, 2000, 'فضي', '2T1BURHE5RC1234567', v_dammam, v_new, v_gasoline, v_auto, v_sedan);

  SELECT count(*) INTO v_count FROM vehicles;
  RAISE NOTICE 'Inserted % vehicles total', v_count;
END $$;

-- Vehicle listings
DO $$
DECLARE
  v_seller uuid;
  v_vid uuid;
  v_i int := 0;
  slugs text[] := ARRAY['toyota-camry-2023-white','hyundai-tucson-2024-black','nissan-patrol-2022-silver','honda-accord-2023-blue','bmw-x5-2024-black','mercedes-cclass-2023-white','ford-ranger-2023-gray','chevrolet-tahoe-2024-white','kia-sportage-2023-red','lexus-rx-2024-blue','toyota-land-cruiser-2023-beige','hyundai-elantra-2024-silver','nissan-altima-2023-gray','bmw-320i-2023-white','ford-explorer-2024-black','honda-civic-2023-blue','mercedes-eclass-2024-black','kia-sorento-2023-white','chevrolet-camaro-2023-red','toyota-corolla-2024-silver'];
  prices numeric[] := ARRAY[85000,120000,195000,95000,320000,210000,105000,250000,98000,280000,235000,72000,78000,165000,175000,82000,290000,115000,185000,68000];
  titles text[] := ARRAY['Toyota Camry 2023','Hyundai Tucson 2024','Nissan Patrol 2022','Honda Accord 2023','BMW X5 2024','Mercedes C-Class 2023','Ford Ranger 2023','Chevrolet Tahoe 2024','Kia Sportage 2023','Lexus RX 350h 2024','Toyota Land Cruiser 2023','Hyundai Elantra 2024','Nissan Altima 2023','BMW 320i 2023','Ford Explorer 2024','Honda Civic 2023','Mercedes E-Class 2024','Kia Sorento 2023','Chevrolet Camaro 2023','Toyota Corolla 2024'];
  titles_ar text[] := ARRAY['تويوتا كامري 2023 - ممتاز','هيونداي توسون 2024 - جديد','نيسان باترول 2022','هوندا أكورد 2023','بي ام دبليو X5 2024 - جديد','مرسيدس C-Class 2023','فورد رينجر 2023','شيفروليه تاهو 2024 - جديد','كيا سبورتاج 2023','لكزس RX 350h 2024 - جديد','تويوتا لاند كروزر 2023','هيونداي إلنترا 2024','نيسان ألتيا 2023','بي ام دبليو 320i 2023','فورد إكسبلورر 2024 - جديد','هوندا سيفيك 2023','مرسيدس E-Class 2024 - جديد','كيا سوريتبيو 2023','شيفروليه كامارو 2023','تويوتا كورولا 2024 - جديد'];
  featured bool[] := ARRAY[true,true,false,false,true,true,false,true,false,true,true,false,false,true,true,false,true,false,false,false];
  instant bool[] := ARRAY[true,true,true,true,false,false,true,false,true,false,true,true,true,false,false,true,false,true,true,true];
  stype text[];
  v_count int;
BEGIN
  SELECT count(*) INTO v_count FROM vehicle_listings;
  IF v_count > 0 THEN
    RAISE NOTICE 'Listings already exist (%), skipping', v_count;
    RETURN;
  END IF;

  SELECT id INTO v_seller FROM auth.users WHERE phone = '966555000001';
  stype := ARRAY_fill('individual'::text, ARRAY[20]);
  stype[2] := 'dealer'; stype[5] := 'dealer'; stype[8] := 'dealer'; stype[10] := 'dealer';
  stype[13] := 'dealer'; stype[14] := 'dealer'; stype[17] := 'dealer';

  FOR v_vid IN SELECT id FROM vehicles ORDER BY created_at LIMIT 20 LOOP
    v_i := v_i + 1;
    INSERT INTO vehicle_listings (vehicle_id, seller_id, slug, price, currency, title, title_ar, description, description_ar, seller_type, status, is_featured, is_instant_buy, published_at)
    VALUES (v_vid, v_seller, slugs[v_i], prices[v_i], 'SAR', titles[v_i], titles_ar[v_i], titles[v_i], titles_ar[v_i], stype[v_i], 'published', featured[v_i], instant[v_i], now());
  END LOOP;

  RAISE NOTICE 'Inserted % listings', v_i;
END $$;

-- Vehicle images
DO $$
DECLARE
  v_vid uuid;
  urls text[] := ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800','https://images.unsplash.com/photo-1633789242441-8a4206346e41?w=800','https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800','https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=800','https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800','https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800','https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800','https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=800','https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800','https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800','https://images.unsplash.com/photo-1594611775980-0e76a21a3a7c?w=800','https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800','https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800','https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800','https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=800','https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800','https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800','https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800','https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800','https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'];
  i int := 0;
  v_count int;
BEGIN
  SELECT count(*) INTO v_count FROM vehicle_images;
  IF v_count > 0 THEN
    RAISE NOTICE 'Vehicle images already exist (%), skipping', v_count;
    RETURN;
  END IF;

  FOR v_vid IN SELECT id FROM vehicles ORDER BY created_at LIMIT 20 LOOP
    i := i + 1;
    INSERT INTO vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES (v_vid, urls[i], true, 1);
  END LOOP;
  RAISE NOTICE 'Inserted % vehicle images', i;
END $$;

-- Dealers
DO $$
DECLARE
  v_seller uuid;
  v_count int;
BEGIN
  SELECT count(*) INTO v_count FROM dealers;
  IF v_count > 0 THEN
    RAISE NOTICE 'Dealers already exist (%), skipping', v_count;
    RETURN;
  END IF;

  SELECT id INTO v_seller FROM auth.users WHERE phone = '966555000001';
  INSERT INTO dealers (owner_id, name, name_ar, slug, phone, email, city_id, is_active, rating, review_count)
  SELECT v_seller, d.name, d.name_ar, d.slug, d.phone, d.email, c.id, true, d.rating, d.reviews
  FROM (VALUES
    ('AlJazirah Motors','الجاذرة للمحركات','aljazirah-motors','0550002001','info@aljazirah.dev','Riyadh',4.5,120),
    ('Gulf Auto Trading','تاراتج خليج للسيارات','gulf-auto-trading','0550002002','info@gulfauto.dev','Jeddah',4.2,85),
    ('Eastern Province Cars','سيارات المنطقة الشرقية','eastern-province-cars','0550002003','info@easterncars.dev','Dammam',4.0,60),
    ('Saudi Premium Motors','المحركات السعودية المتميزة','saudi-premium-motors','0550002004','info@saudipremium.dev','Riyadh',4.8,200),
    ('Najd Auto Sales','نجد لبيع السيارات','najd-auto-sales','0550002005','info@najdauto.dev','Riyadh',3.9,45)
  ) AS d(name, name_ar, slug, phone, email, city_name, rating, reviews)
  JOIN (SELECT DISTINCT name, id FROM cities) c ON c.name = d.city_name;
  RAISE NOTICE 'Inserted 5 dealers';
END $$;

-- Inspection centers (idempotent)
INSERT INTO inspection_centers (name, name_ar, slug, phone, email, city_id, is_active)
SELECT d.name, d.name_ar, d.slug, d.phone, d.email, c.id, true
FROM (VALUES
  ('Ryon Inspection - Riyadh','فحص ريون - الرياض','ryon-inspection-riyadh','0550001001','riyadh@inspect.dev','Riyadh'),
  ('Ryon Inspection - Jeddah','فحص ريون - جدة','ryon-inspection-jeddah','0550001002','jeddah@inspect.dev','Jeddah'),
  ('Ryon Inspection - Dammam','فحص ريون - الدمام','ryon-inspection-dammam','0550001003','dammam@inspect.dev','Dammam')
) AS d(name, name_ar, slug, phone, email, city_name)
JOIN (SELECT DISTINCT name, id FROM cities) c ON c.name = d.city_name
ON CONFLICT (slug) DO NOTHING;
