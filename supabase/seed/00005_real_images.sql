-- Update vehicle images with real Unsplash car photos
BEGIN;

DO $$ DECLARE
  rec RECORD;
  photos text[] := ARRAY[
    '1621007947382-bb3c3994e2ae', -- silver sedan
    '1503376780353-7e6692767b70', -- nice car profile
    '1544636331-e26879cd4d9b',    -- sports car
    '1552519507-da3b142c6e3d',    -- car collection
    '1504215688697-9f4b3a49b92b', -- dashboard
    '1542362567-b07e0b9e2ef0',    -- Mercedes
    '1555215695-3004980ad54e',    -- BMW
    '1533473359331-0135ef1b58bf', -- SUV off-road
    '1583121274602-3e2820c69888', -- red sports car
    '1560958089-b8a1929cea89',    -- electric car
    '1568605117036-5fe5e7bab0b7', -- luxury white car
    '1549399542-7e3f8b79c341',    -- car on road
    '1554744511-d6c603f27c54',    -- SUV on road
    '1494976388531-d1058494cdd8', -- classic car
    '1568849676085-51415763900b', -- SUV blue
    '1566024287286-457246b67634', -- large SUV
    '1606811971618-4486d14f3f99', -- Honda
    '1561580125-02841297628e',    -- Tesla
    '1504919791753-6b80a2a72b06', -- off-road
    '1511914761546-3b2d6c689c8e'  -- luxury SUV
  ];
  idx int;
  base_url text := 'https://images.unsplash.com/photo-';
  params text := '?w=800&h=600&fit=crop&q=80&auto=format';
BEGIN
  idx := 1;
  FOR rec IN SELECT id FROM public.vehicle_images ORDER BY vehicle_id, sort_order LOOP
    UPDATE public.vehicle_images
    SET url = base_url || photos[idx] || params
    WHERE id = rec.id;
    idx := idx + 1;
    IF idx > array_length(photos, 1) THEN
      idx := 1;
    END IF;
  END LOOP;
END $$;

COMMIT;
