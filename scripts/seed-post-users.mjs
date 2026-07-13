#!/usr/bin/env node
// Post-user seed: inserts profiles, roles, vehicles, dealers
// Run AFTER create-demo-users.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function loadEnv() {
  const env = {};
  const content = readFileSync(join(rootDir, '.env.local'), 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('\n🐘  Post-user seeding...\n');

  // 1. Get auth users
  const { data: { users } } = await supabase.auth.admin.listUsers();
  console.log(`Found ${users.length} auth users`);

  if (users.length === 0) {
    console.error('No auth users found. Run create-demo-users.mjs first.');
    process.exit(1);
  }

  // 2. Create profiles using RPC (bypasses RLS)
  const userMap = {};
  for (const u of users) {
    const phone = u.phone?.replace('966', '0') || '';
    userMap[phone] = u.id;
    const fullName = u.user_metadata?.full_name || 'User';

    // Use raw SQL to insert profile
    const { error } = await supabase.rpc('exec_sql', {
      query: `INSERT INTO public.profiles (id, phone, full_name, locale, is_active) VALUES ('${u.id}', '${phone}', '${fullName}', 'ar', true) ON CONFLICT (id) DO NOTHING`
    });

    if (error) {
      // Fallback: direct insert with service key
      const { error: e2 } = await supabase.from('profiles').upsert({
        id: u.id,
        phone,
        full_name: fullName,
        locale: 'ar',
        is_active: true,
      }, { onConflict: 'id' });
      if (e2) {
        console.log(`  ⚠️  Profile for ${phone}: ${e2.message}`);
      } else {
        console.log(`  ✅ Profile: ${fullName} (${phone})`);
      }
    } else {
      console.log(`  ✅ Profile: ${fullName} (${phone})`);
    }
  }

  // 3. Assign roles
  const roleMap = {
    '0555000001': 'super_admin',
    '0555000002': 'dealer_owner',
    '0555000003': 'customer',
    '0555000004': 'inspection_manager',
    '0555000005': 'content_manager',
  };

  for (const [phone, slug] of Object.entries(roleMap)) {
    const userId = userMap[phone];
    if (!userId) continue;

    // Get role ID
    const { data: role } = await supabase.from('roles').select('id').eq('slug', slug).single();
    if (!role) {
      console.log(`  ⚠️  Role "${slug}" not found`);
      continue;
    }

    // Check if already assigned
    const { data: existing } = await supabase.from('user_roles').select('id').eq('user_id', userId).eq('role_id', role.id).single();
    if (existing) {
      console.log(`  ℹ️  Role ${slug} already assigned`);
      continue;
    }

    const { error } = await supabase.from('user_roles').insert({ user_id: userId, role_id: role.id });
    if (error) {
      console.log(`  ⚠️  Role ${slug}: ${error.message}`);
    } else {
      console.log(`  ✅ Role: ${slug}`);
    }
  }

  // 4. Get seller ID (first user = admin)
  const sellerId = users[0]?.id;
  if (!sellerId) {
    console.error('No seller user found');
    process.exit(1);
  }

  // 5. Get reference data IDs
  const getRef = async (table, col, val) => {
    const { data } = await supabase.from(table).select('id').eq(col, val).single();
    return data?.id;
  };

  const toyota = await getRef('car_makes', 'slug', 'toyota');
  const hyundai = await getRef('car_makes', 'slug', 'hyundai');
  const nissan = await getRef('car_makes', 'slug', 'nissan');
  const honda = await getRef('car_makes', 'slug', 'honda');
  const bmw = await getRef('car_makes', 'slug', 'bmw');
  const mercedes = await getRef('car_makes', 'slug', 'mercedes-benz');
  const ford = await getRef('car_makes', 'slug', 'ford');
  const chevrolet = await getRef('car_makes', 'slug', 'chevrolet');
  const kia = await getRef('car_makes', 'slug', 'kia');
  const lexus = await getRef('car_makes', 'slug', 'lexus');

  const sedan = await getRef('body_types', 'slug', 'sedan');
  const suv = await getRef('body_types', 'slug', 'suv');
  const coupe = await getRef('body_types', 'slug', 'coupe');
  const pickup = await getRef('body_types', 'slug', 'pickup');

  const gasoline = await getRef('fuel_types', 'slug', 'gasoline');
  const diesel = await getRef('fuel_types', 'slug', 'diesel');
  const hybrid = await getRef('fuel_types', 'slug', 'hybrid');

  const auto = await getRef('transmission_types', 'slug', 'automatic');
  const usedExcellent = await getRef('vehicle_condition_types', 'slug', 'used-excellent');
  const usedGood = await getRef('vehicle_condition_types', 'slug', 'used-good');
  const newCond = await getRef('vehicle_condition_types', 'slug', 'new');
  const riyadh = await getRef('cities', 'name', 'Riyadh');
  const jeddah = await getRef('cities', 'name', 'Jeddah');
  const dammam = await getRef('cities', 'name', 'Dammam');

  if (!toyota) {
    console.log('  ⚠️  Reference data not found. Seed data migration may have failed.');
    return;
  }

  // 6. Insert vehicles
  const vehicles = [
    { make: toyota, year: 2023, mileage: 15000, color: 'أبيض', vin: 'JTDKN3DU5A0123456', city: riyadh, cond: usedExcellent, fuel: gasoline, body: sedan },
    { make: hyundai, year: 2024, mileage: 5000, color: 'أسود', vin: 'TMAJ38LF5R1234567', city: riyadh, cond: newCond, fuel: gasoline, body: suv },
    { make: nissan, year: 2022, mileage: 45000, color: 'فضي', vin: 'JN8BTMJD1NW1234567', city: riyadh, cond: usedGood, fuel: gasoline, body: suv },
    { make: honda, year: 2023, mileage: 20000, color: 'أزرق', vin: '1HGCV2F34NA123456', city: jeddah, cond: usedExcellent, fuel: gasoline, body: sedan },
    { make: bmw, year: 2024, mileage: 3000, color: 'أسود', vin: 'WBAPH5C55BA123456', city: riyadh, cond: newCond, fuel: gasoline, body: suv },
    { make: mercedes, year: 2023, mileage: 18000, color: 'أبيض', vin: 'WDDWF8DB5JA1234567', city: jeddah, cond: usedExcellent, fuel: gasoline, body: sedan },
    { make: ford, year: 2023, mileage: 30000, color: 'رمادي', vin: '1FTER4FH5NKA12345', city: dammam, cond: usedGood, fuel: diesel, body: pickup },
    { make: chevrolet, year: 2024, mileage: 1000, color: 'أبيض', vin: '1GNSKBKC8RR1234567', city: riyadh, cond: newCond, fuel: gasoline, body: suv },
    { make: kia, year: 2023, mileage: 12000, color: 'أحمر', vin: 'U5YPB81ABNK123456', city: jeddah, cond: usedExcellent, fuel: gasoline, body: suv },
    { make: lexus, year: 2024, mileage: 2000, color: 'نيلي', vin: 'JTJHK1FF5R2123456', city: riyadh, cond: newCond, fuel: hybrid, body: suv },
    { make: toyota, year: 2023, mileage: 25000, color: 'بيج', vin: 'JTEBX3FJ10K1234567', city: riyadh, cond: usedGood, fuel: gasoline, body: suv },
    { make: hyundai, year: 2024, mileage: 8000, color: 'فضي', vin: '5NPEC4AC5RH1234567', city: dammam, cond: usedExcellent, fuel: gasoline, body: sedan },
    { make: nissan, year: 2023, mileage: 16000, color: 'رمادي', vin: '4N1BL3BB5RC1234567', city: jeddah, cond: usedExcellent, fuel: gasoline, body: sedan },
    { make: bmw, year: 2023, mileage: 22000, color: 'أبيض', vin: 'WBA5R7C02NFD12345', city: riyadh, cond: usedExcellent, fuel: gasoline, body: sedan },
    { make: ford, year: 2024, mileage: 4000, color: 'أسود', vin: '1FMSK8GC5RKA12345', city: dammam, cond: newCond, fuel: gasoline, body: suv },
    { make: honda, year: 2023, mileage: 10000, color: 'أزرق', vin: '2HGFC2F69NH123456', city: riyadh, cond: usedExcellent, fuel: gasoline, body: sedan },
    { make: mercedes, year: 2024, mileage: 1500, color: 'أسود', vin: 'W1K6G6FB5RA1234567', city: riyadh, cond: newCond, fuel: gasoline, body: sedan },
    { make: kia, year: 2023, mileage: 14000, color: 'أبيض', vin: '5XYPGDA59NG1234567', city: jeddah, cond: usedGood, fuel: gasoline, body: suv },
    { make: chevrolet, year: 2023, mileage: 8000, color: 'أحمر', vin: '2G1FB1ED3N91234567', city: riyadh, cond: usedExcellent, fuel: gasoline, body: coupe },
    { make: toyota, year: 2024, mileage: 2000, color: 'فضي', vin: '2T1BURHE5RC1234567', city: dammam, cond: newCond, fuel: gasoline, body: sedan },
  ];

  const vehicleIds = [];
  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    const { data, error } = await supabase.from('vehicles').insert({
      owner_id: sellerId,
      make_id: v.make,
      year: v.year,
      mileage: v.mileage,
      color: v.color,
      vin: v.vin,
      city_id: v.city,
      condition_id: v.cond,
      fuel_type_id: v.fuel,
      transmission_id: auto,
      body_type_id: v.body,
    }).select('id').single();

    if (error) {
      console.log(`  ⚠️  Vehicle ${i + 1}: ${error.message}`);
    } else {
      vehicleIds.push(data.id);
      console.log(`  ✅ Vehicle ${i + 1}: ${v.vin}`);
    }
  }

  // 7. Insert vehicle listings
  const listings = [
    { idx: 0, slug: 'toyota-camry-2023-white', price: 85000, title: 'Toyota Camry 2023', titleAr: 'تويوتا كامري 2023 - ممتاز', desc: 'Low mileage Toyota Camry', descAr: 'تويوتا كامري ب mileage قليل وحالة ممتازة', featured: true, instant: true },
    { idx: 1, slug: 'hyundai-tucson-2024-black', price: 120000, title: 'Hyundai Tucson 2024', titleAr: 'هيونداي توسون 2024 - جديد', desc: 'Brand new Hyundai Tucson', descAr: 'هيونداي توسون جديد بضمان كامل', featured: true, instant: true, sellerType: 'dealer' },
    { idx: 2, slug: 'nissan-patrol-2022-silver', price: 195000, title: 'Nissan Patrol 2022', titleAr: 'نيسان باترول 2022', desc: 'Nissan Patrol V6', descAr: 'نيسان باترول V6 بحالة جيدة', instant: true },
    { idx: 3, slug: 'honda-accord-2023-blue', price: 95000, title: 'Honda Accord 2023', titleAr: 'هوندا أكورد 2023', desc: 'Honda Accord low mileage', descAr: 'هوندا أكورد ب mileage قليل', instant: true },
    { idx: 4, slug: 'bmw-x5-2024-black', price: 320000, title: 'BMW X5 2024', titleAr: 'بي ام دبليو X5 2024 - جديد', desc: 'Brand new BMW X5', descAr: 'بي ام دبليو X5 جديد', featured: true, sellerType: 'dealer' },
    { idx: 5, slug: 'mercedes-cclass-2023-white', price: 210000, title: 'Mercedes C-Class 2023', titleAr: 'مرسيدس C-Class 2023', desc: 'Mercedes-Benz C200', descAr: 'مرسيدس C200 بحالة ممتازة', featured: true, sellerType: 'dealer' },
    { idx: 6, slug: 'ford-ranger-2023-gray', price: 105000, title: 'Ford Ranger 2023', titleAr: 'فورد رينجر 2023', desc: 'Ford Ranger diesel', descAr: 'فورد رينجر ديزل بيك أب', instant: true },
    { idx: 7, slug: 'chevrolet-tahoe-2024-white', price: 250000, title: 'Chevrolet Tahoe 2024', titleAr: 'شيفروليه تاهو 2024 - جديد', desc: 'Brand new Chevrolet Tahoe', descAr: 'شيفروليه تاهو جديد', featured: true, sellerType: 'dealer' },
    { idx: 8, slug: 'kia-sportage-2023-red', price: 98000, title: 'Kia Sportage 2023', titleAr: 'كيا سبورتاج 2023', desc: 'Kia Sportage excellent', descAr: 'كيا سبورتاج بحالة ممتازة', instant: true },
    { idx: 9, slug: 'lexus-rx-2024-blue', price: 280000, title: 'Lexus RX 350h 2024', titleAr: 'لكزس RX 350h 2024 - جديد', desc: 'Brand new Lexus RX hybrid', descAr: 'لكزس RX هايبرد جديد', featured: true, sellerType: 'dealer' },
    { idx: 10, slug: 'toyota-land-cruiser-2023-beige', price: 235000, title: 'Toyota Land Cruiser 2023', titleAr: 'تويوتا لاند كروزر 2023', desc: 'Toyota Land Cruiser VXR', descAr: 'تويوتا لاند كروزر فل أوبشن', featured: true, instant: true },
    { idx: 11, slug: 'hyundai-elantra-2024-silver', price: 72000, title: 'Hyundai Elantra 2024', titleAr: 'هيونداي إلنترا 2024', desc: 'Hyundai Elantra low mileage', descAr: 'هيونداي إلنترا ب mileage قليل', instant: true },
    { idx: 12, slug: 'nissan-altima-2023-gray', price: 78000, title: 'Nissan Altima 2023', titleAr: 'نيسان ألتيا 2023', desc: 'Nissan Altima SR', descAr: 'نيسان ألتيا SR بحالة ممتازة', sellerType: 'dealer' },
    { idx: 13, slug: 'bmw-320i-2023-white', price: 165000, title: 'BMW 320i 2023', titleAr: 'بي ام دبليو 320i 2023', desc: 'BMW 320i M Sport', descAr: 'بي ام دبليو 320i حزمة M سبورت', featured: true, sellerType: 'dealer' },
    { idx: 14, slug: 'ford-explorer-2024-black', price: 175000, title: 'Ford Explorer 2024', titleAr: 'فورد إكسبلورر 2024 - جديد', desc: 'Brand new Ford Explorer ST', descAr: 'فورد إكسبلورر ST جديد', featured: true, sellerType: 'dealer' },
    { idx: 15, slug: 'honda-civic-2023-blue', price: 82000, title: 'Honda Civic 2023', titleAr: 'هوندا سيفيك 2023', desc: 'Honda Civic Sport', descAr: 'هوندا سيفيك سبورت بفتحة سقف', instant: true },
    { idx: 16, slug: 'mercedes-eclass-2024-black', price: 290000, title: 'Mercedes E-Class 2024', titleAr: 'مرسيدس E-Class 2024 - جديد', desc: 'Brand new Mercedes-Benz E300', descAr: 'مرسيدس E300 جديد', featured: true, sellerType: 'dealer' },
    { idx: 17, slug: 'kia-sorento-2023-white', price: 115000, title: 'Kia Sorento 2023', titleAr: 'كيا سوريتبيو 2023', desc: 'Kia Sorento EX 7-seater', descAr: 'كيا سوريتبيو EX 7 مقاعد', instant: true },
    { idx: 18, slug: 'chevrolet-camaro-2023-red', price: 185000, title: 'Chevrolet Camaro 2023', titleAr: 'شيفروليه كامارو 2023', desc: 'Chevrolet Camaro SS V8', descAr: 'شيفروليه كامارو SS V8', instant: true },
    { idx: 19, slug: 'toyota-corolla-2024-silver', price: 68000, title: 'Toyota Corolla 2024', titleAr: 'تويوتا كورولا 2024 - جديد', desc: 'Brand new Toyota Corolla', descAr: 'تويوتا كورولا جديد', instant: true },
  ];

  for (const l of listings) {
    const vid = vehicleIds[l.idx];
    if (!vid) continue;
    const { error } = await supabase.from('vehicle_listings').insert({
      vehicle_id: vid,
      seller_id: sellerId,
      slug: l.slug,
      price: l.price,
      currency: 'SAR',
      title: l.title,
      title_ar: l.titleAr,
      description: l.desc,
      description_ar: l.descAr,
      seller_type: l.sellerType || 'individual',
      status: 'published',
      is_featured: l.featured || false,
      is_instant_buy: l.instant || false,
      published_at: new Date().toISOString(),
    });
    if (error) {
      console.log(`  ⚠️  Listing ${l.slug}: ${error.message}`);
    } else {
      console.log(`  ✅ Listing: ${l.slug}`);
    }
  }

  // 8. Insert vehicle images
  const urls = [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    'https://images.unsplash.com/photo-1633789242441-8a4206346e41?w=800',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=800',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800',
    'https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=800',
    'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
    'https://images.unsplash.com/photo-1594611775980-0e76a21a3a7c?w=800',
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    'https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=800',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800',
    'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800',
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
  ];

  for (let i = 0; i < vehicleIds.length; i++) {
    if (!vehicleIds[i]) continue;
    const { error } = await supabase.from('vehicle_images').insert({
      vehicle_id: vehicleIds[i],
      url: urls[i],
      is_primary: true,
      sort_order: 1,
    });
    if (error) {
      console.log(`  ⚠️  Image ${i + 1}: ${error.message}`);
    }
  }
  console.log(`  ✅ ${vehicleIds.filter(Boolean).length} vehicle images inserted`);

  // 9. Insert dealers
  const dealerData = [
    { name: 'AlJazirah Motors', nameAr: 'الجاذرة للمحركات', slug: 'aljazirah-motors', phone: '0550002001', city: riyadh, rating: 4.5, reviews: 120 },
    { name: 'Gulf Auto Trading', nameAr: 'تاراتج خليج للسيارات', slug: 'gulf-auto-trading', phone: '0550002002', city: jeddah, rating: 4.2, reviews: 85 },
    { name: 'Eastern Province Cars', nameAr: 'سيارات المنطقة الشرقية', slug: 'eastern-province-cars', phone: '0550002003', city: dammam, rating: 4.0, reviews: 60 },
    { name: 'Saudi Premium Motors', nameAr: 'المحركات السعودية المتميزة', slug: 'saudi-premium-motors', phone: '0550002004', city: riyadh, rating: 4.8, reviews: 200 },
    { name: 'Najd Auto Sales', nameAr: 'نجد لبيع السيارات', slug: 'najd-auto-sales', phone: '0550002005', city: riyadh, rating: 3.9, reviews: 45 },
  ];

  for (const d of dealerData) {
    const { error } = await supabase.from('dealers').insert({
      owner_id: sellerId,
      name: d.name,
      name_ar: d.nameAr,
      slug: d.slug,
      phone: d.phone,
      email: `info@${d.slug}.dev`,
      city_id: d.city,
      is_active: true,
      rating: d.rating,
      review_count: d.reviews,
    });
    if (error) {
      console.log(`  ⚠️  Dealer ${d.slug}: ${error.message}`);
    } else {
      console.log(`  ✅ Dealer: ${d.name}`);
    }
  }

  // 10. Insert inspection centers (no FK to auth.users)
  const inspectData = [
    { name: 'Ryon Inspection - Riyadh', nameAr: 'فحص ريون - الرياض', slug: 'ryon-inspection-riyadh', phone: '0550001001', city: riyadh },
    { name: 'Ryon Inspection - Jeddah', nameAr: 'فحص ريون - جدة', slug: 'ryon-inspection-jeddah', phone: '0550001002', city: jeddah },
    { name: 'Ryon Inspection - Dammam', nameAr: 'فحص ريون - الدمام', slug: 'ryon-inspection-dammam', phone: '0550001003', city: dammam },
  ];

  for (const c of inspectData) {
    const { error } = await supabase.from('inspection_centers').insert({
      name: c.name,
      name_ar: c.nameAr,
      slug: c.slug,
      phone: c.phone,
      email: `${c.slug}@inspect.dev`,
      city_id: c.city,
      is_active: true,
    });
    if (error) {
      console.log(`  ⚠️  Center ${c.slug}: ${error.message}`);
    } else {
      console.log(`  ✅ Center: ${c.name}`);
    }
  }

  console.log('\n🎉  Seeding complete!\n');
}

main().catch((e) => {
  console.error('Fatal error:', e.message);
  process.exit(1);
});
