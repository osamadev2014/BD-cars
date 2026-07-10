-- =============================================
-- BD Platform - Demo Seed Data
-- بيانات تجريبية للعرض الحي
-- =============================================

BEGIN;

-- حماية من التنفيذ المكرر
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicles' AND table_schema = 'public')
     AND EXISTS (SELECT 1 FROM public.vehicles LIMIT 1) THEN
    RAISE NOTICE 'Demo vehicles already exist, skipping vehicle inserts.';
  END IF;
END $$;

-- =============================================
-- 1. ماركات إضافية (BYD, Tesla)
-- =============================================
INSERT INTO public.car_makes (name, name_ar, slug, logo_url, country, is_active) VALUES
  ('BYD', 'بي واي دي', 'byd', '/images/makes/byd.png', 'China', true),
  ('Tesla', 'تسلا', 'tesla', '/images/makes/tesla.png', 'USA', true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 2. طرازات السيارات (5 لكل ماركة)
-- =============================================
DO $$ DECLARE v uuid; BEGIN
  SELECT id INTO v FROM public.car_makes WHERE slug = 'toyota';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Camry', 'كامري', 'camry'), (v, 'Corolla', 'كورولا', 'corolla'),
    (v, 'Land Cruiser', 'لاند كروزر', 'land-cruiser'), (v, 'RAV4', 'راف4', 'rav4'),
    (v, 'Hilux', 'هايلكس', 'hilux') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'nissan';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Altima', 'التيما', 'altima'), (v, 'Patrol', 'باترول', 'patrol'),
    (v, 'Sunny', 'صني', 'sunny'), (v, 'X-Trail', 'اكس تريل', 'x-trail'),
    (v, 'Pathfinder', 'باثفايندر', 'pathfinder') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'hyundai';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Sonata', 'سوناتا', 'sonata'), (v, 'Tucson', 'توسون', 'tucson'),
    (v, 'Elantra', 'النترا', 'elantra'), (v, 'Santa Fe', 'سانتا في', 'santa-fe'),
    (v, 'Palisades', 'باليسيدز', 'palisades') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'mercedes-benz';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'C-Class', 'كلاس C', 'c-class'), (v, 'E-Class', 'كلاس E', 'e-class'),
    (v, 'S-Class', 'كلاس S', 's-class'), (v, 'GLE', 'جي ال اي', 'gle'),
    (v, 'GLC', 'جي ال سي', 'glc') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'bmw';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, '3 Series', 'الفئة الثالثة', '3-series'), (v, '5 Series', 'الفئة الخامسة', '5-series'),
    (v, 'X3', 'اكس 3', 'x3'), (v, 'X5', 'اكس 5', 'x5'),
    (v, '7 Series', 'الفئة السابعة', '7-series') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'ford';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Explorer', 'اكسبلورر', 'explorer'), (v, 'Mustang', 'موستانج', 'mustang'),
    (v, 'F-150', 'اف 150', 'f-150'), (v, 'Edge', 'ايدج', 'edge'),
    (v, 'EcoSport', 'ايكو سبورت', 'ecosport') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'kia';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Sportage', 'سبورتاج', 'sportage'), (v, 'Sorento', 'سورنتو', 'sorento'),
    (v, 'Cerato', 'سيراتو', 'cerato'), (v, 'Rio', 'ريو', 'rio'),
    (v, 'Telluride', 'تيلورايد', 'telluride') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'chevrolet';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Tahoe', 'تايف', 'tahoe'), (v, 'Suburban', 'سبوربان', 'suburban'),
    (v, 'Malibu', 'ماليبو', 'malibu'), (v, 'Silverado', 'سيلفادو', 'silverado'),
    (v, 'Equinox', 'ايكينوكس', 'equinox') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'honda';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Civic', 'سيفيك', 'civic'), (v, 'Accord', 'اكورد', 'accord'),
    (v, 'CR-V', 'سي ار في', 'cr-v'), (v, 'HR-V', 'اتش ار في', 'hr-v'),
    (v, 'Pilot', 'بايلوت', 'pilot') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'mazda';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'CX-5', 'سي اكس 5', 'cx-5'), (v, 'CX-30', 'سي اكس 30', 'cx-30'),
    (v, 'Mazda3', 'مازدا 3', 'mazda3'), (v, 'Mazda6', 'مازدا 6', 'mazda6'),
    (v, 'CX-9', 'سي اكس 9', 'cx-9') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'lexus';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'ES350', 'ايس 350', 'es350'), (v, 'RX350', 'ار اكس 350', 'rx350'),
    (v, 'IS300', 'ايس 300', 'is300'), (v, 'NX300', 'ان اكس 300', 'nx300'),
    (v, 'GX460', 'جي اكس 460', 'gx460') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'gmc';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Yukon', 'يوكن', 'yukon'), (v, 'Sierra', 'سييرا', 'sierra'),
    (v, 'Terrain', 'تيرين', 'terrain'), (v, 'Acadia', 'اكاديا', 'acadia'),
    (v, 'Canyon', 'كانيون', 'canyon') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'cadillac';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Escalade', 'اسكاليد', 'escalade'), (v, 'CT5', 'سي تي 5', 'ct5'),
    (v, 'XT5', 'اكس تي 5', 'xt5'), (v, 'XT4', 'اكس تي 4', 'xt4'),
    (v, 'Lyriq', 'ليريك', 'lyriq') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'byd';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Atto 3', 'اتو 3', 'atto-3'), (v, 'Han', 'هان', 'han'),
    (v, 'Seal', 'سيل', 'seal'), (v, 'Tang', 'تانج', 'tang'),
    (v, 'Song Plus', 'سونج بلس', 'song-plus') ON CONFLICT (make_id, slug) DO NOTHING;

  SELECT id INTO v FROM public.car_makes WHERE slug = 'tesla';
  INSERT INTO public.car_models (make_id, name, name_ar, slug) VALUES
    (v, 'Model 3', 'موديل 3', 'model-3'), (v, 'Model Y', 'موديل واي', 'model-y'),
    (v, 'Model S', 'موديل اس', 'model-s'), (v, 'Model X', 'موديل اكس', 'model-x'),
    (v, 'Cybertruck', 'سايبرتراك', 'cybertruck') ON CONFLICT (make_id, slug) DO NOTHING;
END $$;

-- =============================================
-- 3. درجات التجهيز (2-3 لكل طراز)
-- =============================================
DO $$ DECLARE
  m uuid; fg uuid; fe uuid; ta uuid; tc uuid; fwd uuid; awd uuid; rw uuid; fw uuid;
  bs uuid; bh uuid; bc uuid; bp uuid; bv uuid; bd uuid;
BEGIN
  SELECT id INTO fg FROM public.fuel_types WHERE slug = 'gasoline';
  SELECT id INTO fe FROM public.fuel_types WHERE slug = 'electric';
  SELECT id INTO ta FROM public.transmission_types WHERE slug = 'automatic';
  SELECT id INTO tc FROM public.transmission_types WHERE slug = 'cvt';
  SELECT id INTO fwd FROM public.drivetrain_types WHERE slug = 'fwd';
  SELECT id INTO awd FROM public.drivetrain_types WHERE slug = 'awd';
  SELECT id INTO rw FROM public.drivetrain_types WHERE slug = 'rwd';
  SELECT id INTO fw FROM public.drivetrain_types WHERE slug = '4wd';
  SELECT id INTO bs FROM public.body_types WHERE slug = 'sedan';
  SELECT id INTO bd FROM public.body_types WHERE slug = 'suv';
  SELECT id INTO bh FROM public.body_types WHERE slug = 'hatchback';
  SELECT id INTO bc FROM public.body_types WHERE slug = 'coupe';
  SELECT id INTO bp FROM public.body_types WHERE slug = 'pickup';
  SELECT id INTO bv FROM public.body_types WHERE slug = 'convertible';

  -- Toyota
  SELECT id INTO m FROM public.car_models WHERE slug = 'camry';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LE', 'LE', 'le', fg, ta, fwd, bs),
    (m, 'SE', 'SE', 'se', fg, ta, fwd, bs),
    (m, 'XLE', 'XLE', 'xle', fg, ta, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'corolla';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'L', 'L', 'l', fg, tc, fwd, bs), (m, 'LE', 'LE', 'le', fg, tc, fwd, bs),
    (m, 'SE', 'SE', 'se', fg, tc, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'land-cruiser';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'GXR', 'GXR', 'gxr', fg, ta, fw, bd), (m, 'VXR', 'VXR', 'vxr', fg, ta, fw, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'rav4';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LE', 'LE', 'le', fg, ta, awd, bd), (m, 'XLE', 'XLE', 'xle', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'hilux';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Standard', 'ستاندرد', 'standard', fg, ta, fw, bp),
    (m, 'SE', 'SE', 'se', fg, ta, fw, bp) ON CONFLICT (model_id, slug) DO NOTHING;

  -- Nissan
  SELECT id INTO m FROM public.car_models WHERE slug = 'altima';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SV', 'SV', 'sv', fg, tc, fwd, bs), (m, 'SL', 'SL', 'sl', fg, tc, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'patrol';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SE', 'SE', 'se', fg, ta, fw, bd), (m, 'LE', 'LE', 'le', fg, ta, fw, bd),
    (m, 'Platinum', 'بلاتينيوم', 'platinum', fg, ta, fw, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'sunny';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'S', 'S', 's', fg, tc, fwd, bs), (m, 'SV', 'SV', 'sv', fg, tc, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'x-trail';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SV', 'SV', 'sv', fg, tc, awd, bd), (m, 'SL', 'SL', 'sl', fg, tc, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'pathfinder';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'S', 'S', 's', fg, ta, awd, bd), (m, 'SL', 'SL', 'sl', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;

  -- Hyundai
  SELECT id INTO m FROM public.car_models WHERE slug = 'sonata';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SE', 'SE', 'se', fg, ta, fwd, bs), (m, 'Limited', 'ليمتد', 'limited', fg, ta, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'tucson';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SE', 'SE', 'se', fg, ta, fwd, bd), (m, 'Limited', 'ليمتد', 'limited', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'elantra';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SE', 'SE', 'se', fg, tc, fwd, bs), (m, 'Limited', 'ليمتد', 'limited', fg, tc, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'santa-fe';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SE', 'SE', 'se', fg, ta, awd, bd), (m, 'Calligraphy', 'كاليغرافي', 'calligraphy', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'palisades';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SE', 'SE', 'se', fg, ta, awd, bd), (m, 'Calligraphy', 'كاليغرافي', 'calligraphy', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;

  -- Mercedes
  SELECT id INTO m FROM public.car_models WHERE slug = 'c-class';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'C200', 'C200', 'c200', fg, ta, fwd, bs), (m, 'C300', 'C300', 'c300', fg, ta, awd, bs),
    (m, 'C300 AMG', 'C300 AMG', 'c300-amg', fg, ta, awd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'e-class';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'E300', 'E300', 'e300', fg, ta, awd, bs), (m, 'E350', 'E350', 'e350', fg, ta, awd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 's-class';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'S500', 'S500', 's500', fg, ta, awd, bs), (m, 'S580', 'S580', 's580', fg, ta, awd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'gle';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'GLE300', 'GLE300', 'gle300', fg, ta, awd, bd), (m, 'GLE450', 'GLE450', 'gle450', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'glc';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'GLC200', 'GLC200', 'glc200', fg, ta, awd, bd), (m, 'GLC300', 'GLC300', 'glc300', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;

  -- BMW
  SELECT id INTO m FROM public.car_models WHERE slug = '3-series';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, '320i', '320i', '320i', fg, ta, rw, bs), (m, '330i', '330i', '330i', fg, ta, awd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = '5-series';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, '520i', '520i', '520i', fg, ta, awd, bs), (m, '530i', '530i', '530i', fg, ta, awd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'x3';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'sDrive30i', 'sDrive30i', 'sdrive30i', fg, ta, awd, bd),
    (m, 'xDrive30i', 'xDrive30i', 'xdrive30i', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'x5';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'xDrive40i', 'xDrive40i', 'xdrive40i', fg, ta, awd, bd),
    (m, 'xDrive50i', 'xDrive50i', 'xdrive50i', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = '7-series';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, '740i', '740i', '740i', fg, ta, awd, bs), (m, '750i', '750i', '750i', fg, ta, awd, bs) ON CONFLICT (model_id, slug) DO NOTHING;

  -- Ford
  SELECT id INTO m FROM public.car_models WHERE slug = 'explorer';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'XLT', 'XLT', 'xlt', fg, ta, awd, bd), (m, 'Limited', 'ليمتد', 'limited', fg, ta, awd, bd),
    (m, 'Platinum', 'بلاتينيوم', 'platinum', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'mustang';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'EcoBoost', 'ايكو بوكست', 'ecoboost', fg, ta, rw, bc), (m, 'GT', 'جي تي', 'gt', fg, ta, rw, bc) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'f-150';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'XLT', 'XLT', 'xlt', fg, ta, fw, bp), (m, 'Lariat', 'لاريات', 'lariat', fg, ta, fw, bp) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'edge';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SEL', 'SEL', 'sel', fg, ta, awd, bd), (m, 'Titanium', 'تيتانيوم', 'titanium', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'ecosport';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'S', 'S', 's', fg, ta, fwd, bd), (m, 'SE', 'SE', 'se', fg, ta, fwd, bd) ON CONFLICT (model_id, slug) DO NOTHING;

  -- Kia
  SELECT id INTO m FROM public.car_models WHERE slug = 'sportage';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LX', 'LX', 'lx', fg, ta, fwd, bd), (m, 'SX', 'SX', 'sx', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'sorento';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LX', 'LX', 'lx', fg, ta, awd, bd), (m, 'SX', 'SX', 'sx', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'cerato';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LX', 'LX', 'lx', fg, tc, fwd, bs), (m, 'SX', 'SX', 'sx', fg, tc, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'rio';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LX', 'LX', 'lx', fg, tc, fwd, bs), (m, 'SX', 'SX', 'sx', fg, tc, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'telluride';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LX', 'LX', 'lx', fg, ta, awd, bd), (m, 'SX', 'SX', 'sx', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;

  -- Chevrolet
  SELECT id INTO m FROM public.car_models WHERE slug = 'tahoe';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LS', 'LS', 'ls', fg, ta, fw, bd), (m, 'LT', 'LT', 'lt', fg, ta, fw, bd),
    (m, 'Premier', 'بريمير', 'premier', fg, ta, fw, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'suburban';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LT', 'LT', 'lt', fg, ta, fw, bd), (m, 'Premier', 'بريمير', 'premier', fg, ta, fw, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'malibu';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LS', 'LS', 'ls', fg, ta, fwd, bs), (m, 'LT', 'LT', 'lt', fg, ta, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'silverado';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Custom', 'كوستم', 'custom', fg, ta, fw, bp), (m, 'LT', 'LT', 'lt', fg, ta, fw, bp) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'equinox';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LS', 'LS', 'ls', fg, ta, fwd, bd), (m, 'LT', 'LT', 'lt', fg, ta, fwd, bd) ON CONFLICT (model_id, slug) DO NOTHING;

  -- Honda
  SELECT id INTO m FROM public.car_models WHERE slug = 'civic';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LX', 'LX', 'lx', fg, tc, fwd, bs), (m, 'EX', 'EX', 'ex', fg, tc, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'accord';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LX', 'LX', 'lx', fg, tc, fwd, bs), (m, 'EX', 'EX', 'ex', fg, tc, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'cr-v';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LX', 'LX', 'lx', fg, tc, awd, bd), (m, 'EX', 'EX', 'ex', fg, tc, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'hr-v';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LX', 'LX', 'lx', fg, tc, fwd, bd), (m, 'EX', 'EX', 'ex', fg, tc, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'pilot';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'LX', 'LX', 'lx', fg, ta, awd, bd), (m, 'EX-L', 'EX-L', 'ex-l', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;

  -- Mazda
  SELECT id INTO m FROM public.car_models WHERE slug = 'cx-5';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Sport', 'سبورت', 'sport', fg, ta, fwd, bd), (m, 'Touring', 'تورينغ', 'touring', fg, ta, awd, bd),
    (m, 'Grand Touring', 'غراند تورينغ', 'grand-touring', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'cx-30';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Sport', 'سبورت', 'sport', fg, ta, fwd, bd), (m, 'Touring', 'تورينغ', 'touring', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'mazda3';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Sport', 'سبورت', 'sport', fg, ta, fwd, bs), (m, 'Touring', 'تورينغ', 'touring', fg, ta, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'mazda6';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Sport', 'سبورت', 'sport', fg, ta, fwd, bs), (m, 'Grand Touring', 'غراند تورينغ', 'grand-touring', fg, ta, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'cx-9';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Sport', 'سبورت', 'sport', fg, ta, awd, bd), (m, 'Grand Touring', 'غراند تورينغ', 'grand-touring', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;

  -- Lexus
  SELECT id INTO m FROM public.car_models WHERE slug = 'es350';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Luxury', 'لكشري', 'luxury', fg, ta, fwd, bs), (m, 'Ultra Luxury', 'الترا لكشري', 'ultra-luxury', fg, ta, fwd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'rx350';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Base', 'اسي', 'base', fg, ta, awd, bd), (m, 'Luxury', 'لكشري', 'luxury', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'is300';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Base', 'اسي', 'base', fg, ta, rw, bs), (m, 'F Sport', 'اف سبورت', 'f-sport', fg, ta, rw, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'nx300';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Base', 'اسي', 'base', fg, ta, awd, bd), (m, 'Luxury', 'لكشري', 'luxury', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'gx460';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Base', 'اسي', 'base', fg, ta, fw, bd), (m, 'Luxury', 'لكشري', 'luxury', fg, ta, fw, bd) ON CONFLICT (model_id, slug) DO NOTHING;

  -- GMC
  SELECT id INTO m FROM public.car_models WHERE slug = 'yukon';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SLE', 'SLE', 'sle', fg, ta, fw, bd), (m, 'SLT', 'SLT', 'slt', fg, ta, fw, bd),
    (m, 'Denali', 'دينالي', 'denali', fg, ta, fw, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'sierra';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SLE', 'SLE', 'sle', fg, ta, fw, bp), (m, 'Denali', 'دينالي', 'denali', fg, ta, fw, bp) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'terrain';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SLT', 'SLT', 'slt', fg, ta, awd, bd), (m, 'Denali', 'دينالي', 'denali', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'acadia';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'SLE', 'SLE', 'sle', fg, ta, awd, bd), (m, 'Denali', 'دينالي', 'denali', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'canyon';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Elevation', 'اليفيشن', 'elevation', fg, ta, fw, bp), (m, 'Denali', 'دينالي', 'denali', fg, ta, fw, bp) ON CONFLICT (model_id, slug) DO NOTHING;

  -- Cadillac
  SELECT id INTO m FROM public.car_models WHERE slug = 'escalade';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Premium Luxury', 'بريميوم لكشري', 'premium-luxury', fg, ta, fw, bd), (m, 'Sport', 'سبورت', 'sport', fg, ta, fw, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'ct5';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Luxury', 'لكشري', 'luxury', fg, ta, rw, bs), (m, 'Sport', 'سبورت', 'sport', fg, ta, rw, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'xt5';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Luxury', 'لكشري', 'luxury', fg, ta, awd, bd), (m, 'Sport', 'سبورت', 'sport', fg, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'xt4';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Luxury', 'لكشري', 'luxury', fg, ta, fwd, bd), (m, 'Sport', 'سبورت', 'sport', fg, ta, fwd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'lyriq';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Luxury 1', 'لكشري 1', 'luxury-1', fe, ta, rw, bd), (m, 'Sport 1', 'سبورت 1', 'sport-1', fe, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;

  -- BYD
  SELECT id INTO m FROM public.car_models WHERE slug = 'atto-3';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Standard', 'ستاندرد', 'standard', fe, ta, fwd, bd), (m, 'Extended', 'متسع', 'extended', fe, ta, fwd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'han';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'EV', ' اي في', 'ev', fe, ta, fwd, bs), (m, 'EV AWD', 'اي في كلي', 'ev-awd', fe, ta, awd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'seal';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Dynamic', 'داينميك', 'dynamic', fe, ta, rw, bs), (m, 'Performance', 'بيرفورمانس', 'performance', fe, ta, awd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'tang';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'EV', 'اي في', 'ev', fe, ta, awd, bd), (m, 'EV AWD', 'اي في كلي', 'ev-awd', fe, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'song-plus';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'EV', 'اي في', 'ev', fe, ta, fwd, bd), (m, 'EV Extended', 'اي في متسع', 'ev-extended', fe, ta, fwd, bd) ON CONFLICT (model_id, slug) DO NOTHING;

  -- Tesla
  SELECT id INTO m FROM public.car_models WHERE slug = 'model-3';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Standard Range', 'المدى القياسي', 'standard-range', fe, ta, rw, bs),
    (m, 'Long Range', 'المدى الطويل', 'long-range', fe, ta, awd, bs),
    (m, 'Performance', 'بيرفورمانس', 'performance', fe, ta, awd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'model-y';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Standard Range', 'المدى القياسي', 'standard-range', fe, ta, rw, bd),
    (m, 'Long Range', 'المدى الطويل', 'long-range', fe, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'model-s';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Dual Motor', 'دوال موتور', 'dual-motor', fe, ta, awd, bs), (m, 'Plaid', 'بلويد', 'plaid', fe, ta, awd, bs) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'model-x';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'Dual Motor', 'دوال موتور', 'dual-motor', fe, ta, awd, bd), (m, 'Plaid', 'بلويد', 'plaid', fe, ta, awd, bd) ON CONFLICT (model_id, slug) DO NOTHING;
  SELECT id INTO m FROM public.car_models WHERE slug = 'cybertruck';
  INSERT INTO public.car_trims (model_id, name, name_ar, slug, fuel_type_id, transmission_id, drivetrain_id, body_type_id) VALUES
    (m, 'RWD', 'RWD', 'rwd', fe, ta, rw, bp), (m, 'AWD', 'AWD', 'awd', fe, ta, awd, bp) ON CONFLICT (model_id, slug) DO NOTHING;
END $$;

-- =============================================
-- 4. مدن إضافية
-- =============================================
INSERT INTO public.cities (region_id, name, name_ar, slug, is_active) VALUES
  ((SELECT id FROM public.regions WHERE slug = 'riyadh-region'), 'Al Rajhi', 'الراجحي', 'al-rajhi', true),
  ((SELECT id FROM public.regions WHERE slug = 'riyadh-region'), 'Al Malqa', 'المالحة', 'al-malqa', true),
  ((SELECT id FROM public.regions WHERE slug = 'makkah-region'), 'Al Naseem', 'النسيم', 'al-naseem', true),
  ((SELECT id FROM public.regions WHERE slug = 'eastern-region'), 'Al Khobar', 'الخبر', 'al-khobar', true),
  ((SELECT id FROM public.regions WHERE slug = 'eastern-region'), 'Dammam', 'الدمام', 'dammam', true)
ON CONFLICT (region_id, slug) DO NOTHING;

-- =============================================
-- 5. سيارات تجريبية وإعلانات
-- =============================================

-- حذف بيانات تجريبية سابقة إن وجدت
DELETE FROM public.listing_status_history WHERE listing_id IN (SELECT id FROM public.vehicle_listings WHERE seller_id IN (SELECT id FROM auth.users WHERE email LIKE '%demo%'));
DELETE FROM public.vehicle_status_history WHERE vehicle_id IN (SELECT id FROM public.vehicles WHERE owner_id IN (SELECT id FROM auth.users WHERE email LIKE '%demo%'));
DELETE FROM public.vehicle_images WHERE vehicle_id IN (SELECT id FROM public.vehicles WHERE owner_id IN (SELECT id FROM auth.users WHERE email LIKE '%demo%'));
DELETE FROM public.vehicle_listings WHERE seller_id IN (SELECT id FROM auth.users WHERE email LIKE '%demo%');
DELETE FROM public.vehicles WHERE owner_id IN (SELECT id FROM auth.users WHERE email LIKE '%demo%');

DO $$
DECLARE
  demo_user_id uuid;
  l_id uuid;
  city_riyadh uuid;
  city_jeddah uuid;
  city_dammam uuid;
  make_toyota uuid; make_nissan uuid; make_hyundai uuid; make_mercedes uuid;
  make_bmw uuid; make_ford uuid; make_kia uuid; make_chevrolet uuid;
  make_honda uuid; make_mazda uuid; make_lexus uuid; make_gmc uuid;
  make_cadillac uuid; make_byd uuid; make_tesla uuid;
  trim_camry_le uuid;
  trim_patrol_se uuid;
  trim_tucson_se uuid;
  trim_c300 uuid;
  trim_320i uuid;
  trim_explorer_xlt uuid;
  trim_sportage_lx uuid;
  trim_tahoe_ls uuid;
  trim_civic_lx uuid;
  trim_cx5_sport uuid;
  trim_rx350_base uuid;
  trim_yukon_sle uuid;
  trim_escalade uuid;
  trim_atto3 uuid;
  trim_model3_std uuid;
  v1 uuid; v2 uuid; v3 uuid; v4 uuid; v5 uuid;
  v6 uuid; v7 uuid; v8 uuid; v9 uuid; v10 uuid;
  v11 uuid; v12 uuid; v13 uuid; v14 uuid; v15 uuid;
  v16 uuid; v17 uuid; v18 uuid; v19 uuid; v20 uuid;
begin
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@ryon.com' LIMIT 1;
  IF demo_user_id IS NULL THEN
    RAISE NOTICE 'demo@ryon.com not found — skipping vehicle inserts. Create a test user first.';
    RETURN;
  END IF;

  SELECT id INTO city_riyadh FROM public.cities WHERE slug = 'riyadh' LIMIT 1;
  SELECT id INTO city_jeddah FROM public.cities WHERE slug = 'jeddah' LIMIT 1;
  SELECT id INTO city_dammam FROM public.cities WHERE slug = 'dammam' LIMIT 1;

  SELECT id INTO make_toyota FROM public.car_makes WHERE slug = 'toyota';
  SELECT id INTO make_nissan FROM public.car_makes WHERE slug = 'nissan';
  SELECT id INTO make_hyundai FROM public.car_makes WHERE slug = 'hyundai';
  SELECT id INTO make_mercedes FROM public.car_makes WHERE slug = 'mercedes-benz';
  SELECT id INTO make_bmw FROM public.car_makes WHERE slug = 'bmw';
  SELECT id INTO make_ford FROM public.car_makes WHERE slug = 'ford';
  SELECT id INTO make_kia FROM public.car_makes WHERE slug = 'kia';
  SELECT id INTO make_chevrolet FROM public.car_makes WHERE slug = 'chevrolet';
  SELECT id INTO make_honda FROM public.car_makes WHERE slug = 'honda';
  SELECT id INTO make_mazda FROM public.car_makes WHERE slug = 'mazda';
  SELECT id INTO make_lexus FROM public.car_makes WHERE slug = 'lexus';
  SELECT id INTO make_gmc FROM public.car_makes WHERE slug = 'gmc';
  SELECT id INTO make_cadillac FROM public.car_makes WHERE slug = 'cadillac';
  SELECT id INTO make_byd FROM public.car_makes WHERE slug = 'byd';
  SELECT id INTO make_tesla FROM public.car_makes WHERE slug = 'tesla';

  SELECT id INTO trim_camry_le FROM public.car_trims WHERE slug = 'le' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'camry');
  SELECT id INTO trim_patrol_se FROM public.car_trims WHERE slug = 'se' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'patrol');
  SELECT id INTO trim_tucson_se FROM public.car_trims WHERE slug = 'se' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'tucson');
  SELECT id INTO trim_c300 FROM public.car_trims WHERE slug = 'c300' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'c-class');
  SELECT id INTO trim_320i FROM public.car_trims WHERE slug = '320i' AND model_id = (SELECT id FROM public.car_models WHERE slug = '3-series');
  SELECT id INTO trim_explorer_xlt FROM public.car_trims WHERE slug = 'xlt' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'explorer');
  SELECT id INTO trim_sportage_lx FROM public.car_trims WHERE slug = 'lx' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'sportage');
  SELECT id INTO trim_tahoe_ls FROM public.car_trims WHERE slug = 'ls' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'tahoe');
  SELECT id INTO trim_civic_lx FROM public.car_trims WHERE slug = 'lx' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'civic');
  SELECT id INTO trim_cx5_sport FROM public.car_trims WHERE slug = 'sport' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'cx-5');
  SELECT id INTO trim_rx350_base FROM public.car_trims WHERE slug = 'base' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'rx350');
  SELECT id INTO trim_yukon_sle FROM public.car_trims WHERE slug = 'sle' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'yukon');
  SELECT id INTO trim_escalade FROM public.car_trims WHERE slug = 'premium-luxury' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'escalade');
  SELECT id INTO trim_atto3 FROM public.car_trims WHERE slug = 'standard' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'atto-3');
  SELECT id INTO trim_model3_std FROM public.car_trims WHERE slug = 'standard-range' AND model_id = (SELECT id FROM public.car_models WHERE slug = 'model-3');

  INSERT INTO public.vehicles (owner_id, make_id, model_id, trim_id, year, mileage, color, vin, engine_size, horsepower, doors, seats, city_id)
  VALUES
    (demo_user_id, make_toyota, (SELECT id FROM public.car_models WHERE slug='camry'), trim_camry_le, 2023, 15000, 'White', '1HGBH41JXMN109186', 2.5, 203, 4, 5, city_riyadh),
    (demo_user_id, make_nissan, (SELECT id FROM public.car_models WHERE slug='patrol'), trim_patrol_se, 2022, 45000, 'Black', '5NPEB4AC4DH123456', 4.0, 275, 4, 7, city_riyadh),
    (demo_user_id, make_hyundai, (SELECT id FROM public.car_models WHERE slug='tucson'), trim_tucson_se, 2024, 5000, 'Silver', '5NMS3DAJ5NH123456', 2.5, 187, 4, 5, city_jeddah),
    (demo_user_id, make_mercedes, (SELECT id FROM public.car_models WHERE slug='c-class'), trim_c300, 2023, 20000, 'Black', 'WDDWF8DB5JA123456', 2.0, 255, 4, 5, city_riyadh),
    (demo_user_id, make_bmw, (SELECT id FROM public.car_models WHERE slug='3-series'), trim_320i, 2022, 30000, 'Blue', 'WBA8E9C50JA123456', 2.0, 180, 4, 5, city_dammam),
    (demo_user_id, make_ford, (SELECT id FROM public.car_models WHERE slug='explorer'), trim_explorer_xlt, 2023, 25000, 'Gray', '1FM5K8GC7PGA12345', 2.3, 300, 4, 7, city_riyadh),
    (demo_user_id, make_kia, (SELECT id FROM public.car_models WHERE slug='sportage'), trim_sportage_lx, 2024, 3000, 'Red', 'KNDPRC167P5123456', 2.5, 187, 4, 5, city_jeddah),
    (demo_user_id, make_chevrolet, (SELECT id FROM public.car_models WHERE slug='tahoe'), trim_tahoe_ls, 2022, 50000, 'White', '1GNSKBKC0RR123456', 5.3, 355, 4, 7, city_riyadh),
    (demo_user_id, make_honda, (SELECT id FROM public.car_models WHERE slug='civic'), trim_civic_lx, 2024, 8000, 'Silver', '2HGFC2F69RH123456', 2.0, 158, 4, 5, city_dammam),
    (demo_user_id, make_mazda, (SELECT id FROM public.car_models WHERE slug='cx-5'), trim_cx5_sport, 2023, 18000, 'Red', '3VV2B7AX5RM123456', 2.5, 187, 4, 5, city_jeddah),
    (demo_user_id, make_lexus, (SELECT id FROM public.car_models WHERE slug='rx350'), trim_rx350_base, 2023, 22000, 'White', '2T2BKMCA7PC123456', 3.5, 295, 4, 5, city_riyadh),
    (demo_user_id, make_gmc, (SELECT id FROM public.car_models WHERE slug='yukon'), trim_yukon_sle, 2022, 40000, 'Black', '1GKS2HKJ5MR123456', 5.3, 355, 4, 7, city_riyadh),
    (demo_user_id, make_cadillac, (SELECT id FROM public.car_models WHERE slug='escalade'), trim_escalade, 2024, 2000, 'Black', '1GYS4KKJ5MR123456', 6.2, 420, 4, 7, city_riyadh),
    (demo_user_id, make_byd, (SELECT id FROM public.car_models WHERE slug='atto-3'), trim_atto3, 2024, 1000, 'Blue', 'LGXCE6CB5N0123456', 0, 204, 4, 5, city_jeddah),
    (demo_user_id, make_tesla, (SELECT id FROM public.car_models WHERE slug='model-3'), trim_model3_std, 2023, 12000, 'White', '5YJ3E1EA8PF123456', 0, 283, 4, 5, city_riyadh),
    (demo_user_id, make_toyota, (SELECT id FROM public.car_models WHERE slug='camry'), trim_camry_le, 2021, 60000, 'Gray', '4T1BZ1HK5MU123456', 2.5, 203, 4, 5, city_dammam),
    (demo_user_id, make_nissan, (SELECT id FROM public.car_models WHERE slug='patrol'), trim_patrol_se, 2024, 1000, 'White', 'JN8BT3DD5RW123456', 4.0, 275, 4, 7, city_riyadh),
    (demo_user_id, make_hyundai, (SELECT id FROM public.car_models WHERE slug='tucson'), trim_tucson_se, 2023, 20000, 'Titanium', '5NMS3DAJ7PH123456', 2.5, 187, 4, 5, city_jeddah),
    (demo_user_id, make_mercedes, (SELECT id FROM public.car_models WHERE slug='c-class'), trim_c300, 2024, 500, 'Silver', 'WDDWF8DB3JA123457', 2.0, 255, 4, 5, city_dammam),
    (demo_user_id, make_ford, (SELECT id FROM public.car_models WHERE slug='explorer'), trim_explorer_xlt, 2022, 55000, 'Red', '1FM5K8GC9PGA12346', 2.3, 300, 4, 7, city_riyadh)
  RETURNING id INTO l_id;

  -- Capture all vehicle IDs
  SELECT id INTO v1 FROM public.vehicles WHERE vin = '1HGBH41JXMN109186' AND owner_id = demo_user_id;
  SELECT id INTO v2 FROM public.vehicles WHERE vin = '5NPEB4AC4DH123456' AND owner_id = demo_user_id;
  SELECT id INTO v3 FROM public.vehicles WHERE vin = '5NMS3DAJ5NH123456' AND owner_id = demo_user_id;
  SELECT id INTO v4 FROM public.vehicles WHERE vin = 'WDDWF8DB5JA123456' AND owner_id = demo_user_id;
  SELECT id INTO v5 FROM public.vehicles WHERE vin = 'WBA8E9C50JA123456' AND owner_id = demo_user_id;
  SELECT id INTO v6 FROM public.vehicles WHERE vin = '1FM5K8GC7PGA12345' AND owner_id = demo_user_id;
  SELECT id INTO v7 FROM public.vehicles WHERE vin = 'KNDPRC167P5123456' AND owner_id = demo_user_id;
  SELECT id INTO v8 FROM public.vehicles WHERE vin = '1GNSKBKC0RR123456' AND owner_id = demo_user_id;
  SELECT id INTO v9 FROM public.vehicles WHERE vin = '2HGFC2F69RH123456' AND owner_id = demo_user_id;
  SELECT id INTO v10 FROM public.vehicles WHERE vin = '3VV2B7AX5RM123456' AND owner_id = demo_user_id;
  SELECT id INTO v11 FROM public.vehicles WHERE vin = '2T2BKMCA7PC123456' AND owner_id = demo_user_id;
  SELECT id INTO v12 FROM public.vehicles WHERE vin = '1GKS2HKJ5MR123456' AND owner_id = demo_user_id;
  SELECT id INTO v13 FROM public.vehicles WHERE vin = '1GYS4KKJ5MR123456' AND owner_id = demo_user_id;
  SELECT id INTO v14 FROM public.vehicles WHERE vin = 'LGXCE6CB5N0123456' AND owner_id = demo_user_id;
  SELECT id INTO v15 FROM public.vehicles WHERE vin = '5YJ3E1EA8PF123456' AND owner_id = demo_user_id;
  SELECT id INTO v16 FROM public.vehicles WHERE vin = '4T1BZ1HK5MU123456' AND owner_id = demo_user_id;
  SELECT id INTO v17 FROM public.vehicles WHERE vin = 'JN8BT3DD5RW123456' AND owner_id = demo_user_id;
  SELECT id INTO v18 FROM public.vehicles WHERE vin = '5NMS3DAJ7PH123456' AND owner_id = demo_user_id;
  SELECT id INTO v19 FROM public.vehicles WHERE vin = 'WDDWF8DB3JA123457' AND owner_id = demo_user_id;
  SELECT id INTO v20 FROM public.vehicles WHERE vin = '1FM5K8GC9PGA12346' AND owner_id = demo_user_id;

  -- vehicle_listings (slug is required and unique)
  INSERT INTO public.vehicle_listings (vehicle_id, seller_id, slug, title, title_ar, description, description_ar, price, currency, status, is_featured, published_at)
  VALUES
    (v1, demo_user_id, 'toyota-camry-le-2023-001', 'Toyota Camry LE 2023', 'كورولا LE 2023', 'Low mileage, single owner', ' mileage قليل، مالك واحد', 85000, 'SAR', 'active', true, now()),
    (v2, demo_user_id, 'nissan-patrol-se-2022-001', 'Nissan Patrol SE 2022', 'باترول SE 2022', 'Well maintained SUV', 'دفع رباعي ممتاز', 185000, 'SAR', 'active', true, now()),
    (v3, demo_user_id, 'hyundai-tucson-se-2024-001', 'Hyundai Tucson SE 2024', 'توسون SE 2024', 'Brand new 2024 model', 'موديل جديد 2024', 115000, 'SAR', 'active', false, now()),
    (v4, demo_user_id, 'mercedes-c300-2023-001', 'Mercedes-Benz C300 2023', 'مرسيدس C300 2023', 'Premium sedan, fully loaded', 'سيدان فاخر مكتمل', 195000, 'SAR', 'active', true, now()),
    (v5, demo_user_id, 'bmw-320i-2022-001', 'BMW 320i 2022', 'بي ام دبليو 320i 2022', 'Sporty and elegant', 'رياضي وأنيق', 160000, 'SAR', 'active', false, now()),
    (v6, demo_user_id, 'ford-explorer-xlt-2023-001', 'Ford Explorer XLT 2023', 'فورد اكسبلورر XLT 2023', 'Family SUV, spacious', 'دفع رباعي عائلي واسع', 145000, 'SAR', 'active', true, now()),
    (v7, demo_user_id, 'kia-sportage-lx-2024-001', 'Kia Sportage LX 2024', 'كيا سبورتاج LX 2024', 'New arrival', 'وصول حديث', 95000, 'SAR', 'active', false, now()),
    (v8, demo_user_id, 'chevrolet-tahoe-ls-2022-001', 'Chevrolet Tahoe LS 2022', 'شفروليه تايف LS 2022', 'Large family SUV', 'دفع رباعي عائلي كبير', 210000, 'SAR', 'active', true, now()),
    (v9, demo_user_id, 'honda-civic-lx-2024-001', 'Honda Civic LX 2024', 'هوندا سيفك LX 2024', 'Reliable and fuel efficient', 'موثوق وموفر للوقت', 75000, 'SAR', 'active', false, now()),
    (v10, demo_user_id, 'mazda-cx5-sport-2023-001', 'Mazda CX-5 Sport 2023', 'مازدا CX-5 سبورت 2023', 'Sporty crossover', 'كروس اوفر رياضي', 105000, 'SAR', 'active', true, now()),
    (v11, demo_user_id, 'lexus-rx350-base-2023-001', 'Lexus RX350 Base 2023', 'لكزس RX350 2023', 'Luxury SUV', 'دفع رباعي فاخر', 225000, 'SAR', 'active', true, now()),
    (v12, demo_user_id, 'gmc-yukon-sle-2022-001', 'GMC Yukon SLE 2022', 'جي ام سي يوكن SLE 2022', 'Full-size SUV', 'دفع رباعي كامل الحجم', 240000, 'SAR', 'active', false, now()),
    (v13, demo_user_id, 'cadillac-escalade-2024-001', 'Cadillac Escalade 2024', 'اسكاليد 2024', 'Ultra luxury SUV', 'دفع رباعي فاخر للغاية', 450000, 'SAR', 'active', true, now()),
    (v14, demo_user_id, 'byd-atto3-2024-001', 'BYD Atto 3 2024', 'بي واي دي اتو 3 2024', 'Electric SUV', 'دفع رباعي كهربائي', 125000, 'SAR', 'active', true, now()),
    (v15, demo_user_id, 'tesla-model3-2023-001', 'Tesla Model 3 2023', 'تسلا موديل 3 2023', 'Electric sedan', 'سيدان كهربائية', 175000, 'SAR', 'active', true, now()),
    (v16, demo_user_id, 'toyota-camry-le-2021-001', 'Toyota Camry LE 2021', 'كامري LE 2021', 'Great value, well maintained', 'قيمة ممتازة، محفوظ جيداً', 65000, 'SAR', 'active', false, now()),
    (v17, demo_user_id, 'nissan-patrol-se-2024-001', 'Nissan Patrol SE 2024', 'باترول SE 2024', 'Brand new Patrol', 'باترول جديد', 210000, 'SAR', 'active', true, now()),
    (v18, demo_user_id, 'hyundai-tucson-se-2023-001', 'Hyundai Tucson SE 2023', 'توسون SE 2023', 'Popular compact SUV', 'دفع رباعي مدمج شائع', 95000, 'SAR', 'active', false, now()),
    (v19, demo_user_id, 'mercedes-c300-2024-001', 'Mercedes-Benz C300 2024', 'مرسيدس C300 2024', 'Latest C-Class model', 'أحدث موديل كلاس C', 215000, 'SAR', 'active', true, now()),
    (v20, demo_user_id, 'ford-explorer-xlt-2022-001', 'Ford Explorer XLT 2022', 'فورد اكسبلورر XLT 2022', 'Reliable family SUV', 'دفع رباعي عائلي موثوق', 120000, 'SAR', 'active', false, now())
  ON CONFLICT DO NOTHING;

  -- vehicle images (placeholder URLs)
  INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, sort_order)
  SELECT v.id,
    '/images/vehicles/placeholder-' || (row_number() OVER (ORDER BY v.created_at) % 5 + 1) || '.jpg',
    true, 1
  FROM public.vehicles v
  WHERE v.owner_id = demo_user_id
  AND NOT EXISTS (SELECT 1 FROM public.vehicle_images WHERE vehicle_id = v.id);
END $$;

-- =============================================
-- 6. إعلانات تجريبية
-- =============================================
INSERT INTO public.ad_placements (name, slug, description, is_active) VALUES
  ('Homepage Hero Banner', 'homepage-hero', 'Main banner on homepage', true),
  ('Homepage Sidebar', 'homepage-sidebar', 'Sidebar ads on homepage', true),
  ('Search Results Top', 'search-results-top', 'Banner above search results', true),
  ('Listing Detail Sidebar', 'listing-detail-sidebar', 'Sidebar ads on listing page', true)
ON CONFLICT (slug) DO NOTHING;

-- advertisers
INSERT INTO public.advertisers (name, slug, is_active) VALUES
  ('Demo Motors', 'demo-motors', true),
  ('Ryon Promos', 'ryon-promos', true)
ON CONFLICT (slug) DO NOTHING;

-- ad campaigns
INSERT INTO public.ad_campaigns (advertiser_id, name, type, placement, budget, start_date, end_date, status, media_url, target_url, impressions_target, clicks_target)
SELECT
  (SELECT id FROM public.advertisers WHERE slug = 'demo-motors'),
  'Ryon Launch Campaign', 'banner', 'homepage-hero', 50000,
  CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '60 days',
  'active', '/images/ads/ryon-launch.jpg', 'https://ryon.sa', 50000, 5000
WHERE EXISTS (SELECT 1 FROM public.ad_placements WHERE slug = 'homepage-hero')
ON CONFLICT DO NOTHING;

INSERT INTO public.ad_campaigns (advertiser_id, name, type, placement, budget, start_date, end_date, status, media_url, target_url, impressions_target, clicks_target)
SELECT
  (SELECT id FROM public.advertisers WHERE slug = 'ryon-promos'),
  'Premium Listings Promo', 'banner', 'search-results-top', 30000,
  CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '45 days',
  'active', '/images/ads/premium-promo.jpg', 'https://ryon.sa/listings', 30000, 3000
WHERE EXISTS (SELECT 1 FROM public.ad_placements WHERE slug = 'search-results-top')
ON CONFLICT DO NOTHING;

-- =============================================
-- 7. مفضلات
-- =============================================
INSERT INTO public.favorites (user_id, listing_id)
SELECT
  (SELECT id FROM auth.users WHERE email = 'demo@ryon.com' LIMIT 1),
  l.id
FROM public.vehicle_listings l
WHERE l.seller_id != (SELECT id FROM auth.users WHERE email = 'demo@ryon.com' LIMIT 1)
AND l.status = 'active'
AND NOT EXISTS (
  SELECT 1 FROM public.favorites f
  WHERE f.user_id = (SELECT id FROM auth.users WHERE email = 'demo@ryon.com' LIMIT 1)
  AND f.listing_id = l.id
)
LIMIT 5
ON CONFLICT DO NOTHING;

COMMIT;
