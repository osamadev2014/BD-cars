-- Add category column to vehicles table
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS category text;

-- Add check constraint for valid categories
ALTER TABLE public.vehicles
DROP CONSTRAINT IF EXISTS vehicles_category_check;

ALTER TABLE public.vehicles
ADD CONSTRAINT vehicles_category_check
CHECK (category IN ('new', 'used', 'certified', 'auction', 'spare_part'));

-- Allow authenticated users to insert new car models
CREATE POLICY "master_data_insert" ON public.car_models
  FOR INSERT
  TO authenticated
  WITH CHECK (true);