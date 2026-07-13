const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const headers = { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }

async function api(table, method = 'GET', body = null, params = '') {
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  const url = `${SUPABASE_URL}/rest/v1/${table}${params ? '?' + params : ''}`
  const res = await fetch(url, opts)
  if (!res.ok) { const t = await res.text(); throw new Error(`${method} ${table}: ${res.status} ${t}`) }
  if (method === 'GET' && params.includes('single')) return (await res.json())[0] || null
  return res.status === 204 ? null : await res.json()
}

async function upsert(table, row, key = 'slug') {
  const existing = await api(table, 'GET', null, `${key}=eq.${row[key]}&select=id&limit=1`)
  if (existing && existing.length > 0) return existing[0].id
  const res = await api(table, 'POST', row)
  return res?.[0]?.id
}

async function main() {
  console.log('Checking existing data...')
  const existing = await api('vehicle_listings', 'GET', null, 'select=id&limit=1')
  if (existing && existing.length > 0) { console.log('Data already seeded.'); return }

  console.log('Seeding demo data...')
  const userId = '00000000-0000-0000-0000-000000000001'

  // Reference data
  const refTables = [
    { t: 'vehicle_condition_types', rows: [{ name: 'New', name_ar: 'جديد', slug: 'new' }, { name: 'Used', name_ar: 'مستعمل', slug: 'used' }, { name: 'Certified Pre-Owned', name_ar: 'مُعتمد', slug: 'certified-pre-owned' }] },
    { t: 'fuel_types', rows: [{ name: 'Gasoline', name_ar: 'بنزين', slug: 'gasoline' }, { name: 'Diesel', name_ar: 'ديزل', slug: 'diesel' }, { name: 'Hybrid', name_ar: 'هايبرد', slug: 'hybrid' }, { name: 'Electric', name_ar: 'كهرباء', slug: 'electric' }] },
    { t: 'transmission_types', rows: [{ name: 'Automatic', name_ar: 'أوتوماتيك', slug: 'automatic' }, { name: 'CVT', name_ar: 'CVT', slug: 'cvt' }, { name: 'Dual-Clutch', name_ar: 'دبل كلتش', slug: 'dual-clutch' }] },
    { t: 'drivetrain_types', rows: [{ name: 'FWD', name_ar: 'دفع أمامي', slug: 'fwd' }, { name: 'RWD', name_ar: 'دفع خلفي', slug: 'rwd' }, { name: 'AWD', name_ar: 'دفع كلي', slug: 'awd' }, { name: '4WD', name_ar: 'دفع رباعي', slug: '4wd' }] },
    { t: 'body_types', rows: [{ name: 'Sedan', name_ar: 'سيدان', slug: 'sedan' }, { name: 'SUV', name_ar: 'دفع رباعي', slug: 'suv' }, { name: 'Crossover', name_ar: 'كروس أوفر', slug: 'crossover' }, { name: 'Coupe', name_ar: 'كوبيه', slug: 'coupe' }, { name: 'Convertible', name_ar: 'مكشوف', slug: 'convertible' }, { name: 'Truck', name_ar: 'شاحنة', slug: 'truck' }, { name: 'Hatchback', name_ar: 'هاتشباك', slug: 'hatchback' }] },
    { t: 'car_colors', rows: [{ name: 'White', name_ar: 'أبيض', hex_code: '#FFFFFF', slug: 'white' }, { name: 'Black', name_ar: 'أسود', hex_code: '#000000', slug: 'black' }, { name: 'Silver', name_ar: 'فضي', hex_code: '#C0C0C0', slug: 'silver' }, { name: 'Gray', name_ar: 'رمادي', hex_code: '#808080', slug: 'gray' }, { name: 'Blue', name_ar: 'أزرق', hex_code: '#0000FF', slug: 'blue' }, { name: 'Red', name_ar: 'أحمر', hex_code: '#FF0000', slug: 'red' }] },
  ]

  const refs = {}
  for (const { t, rows } of refTables) {
    for (const row of rows) {
      refs[`${t}:${row.slug}`] = await upsert(t, row)
    }
  }

  // Cities
  const cities = [
    { name: 'Riyadh', name_ar: 'الرياض', slug: 'riyadh' },
    { name: 'Jeddah', name_ar: 'جدة', slug: 'jeddah' },
    { name: 'Dammam', name_ar: 'الدمام', slug: 'dammam' },
    { name: 'Khobar', name_ar: 'الخبر', slug: 'khobar' },
  ]
  const cityIds = {}
  for (const c of cities) cityIds[c.slug] = await upsert('cities', c)

  // Makes
  const makes = [
    { name: 'Toyota', name_ar: 'تويوتا', slug: 'toyota' },
    { name: 'BMW', name_ar: 'بي إم دبليو', slug: 'bmw' },
    { name: 'Mercedes-Benz', name_ar: 'مرسيدس', slug: 'mercedes' },
    { name: 'Nissan', name_ar: 'نيسان', slug: 'nissan' },
    { name: 'Hyundai', name_ar: 'هيونداي', slug: 'hyundai' },
  ]
  const makeIds = {}
  for (const m of makes) makeIds[m.slug] = await upsert('car_makes', m)

  // Models
  const models = [
    { make_slug: 'toyota', name: 'Camry', name_ar: 'كامري', slug: 'camry' },
    { make_slug: 'toyota', name: 'Corolla', name_ar: 'كورولا', slug: 'corolla' },
    { make_slug: 'toyota', name: 'Land Cruiser', name_ar: 'لاند كروزر', slug: 'land-cruiser' },
    { make_slug: 'bmw', name: '320i', name_ar: '320i', slug: '320i' },
    { make_slug: 'bmw', name: 'X5', name_ar: 'X5', slug: 'x5' },
    { make_slug: 'mercedes', name: 'C-Class', name_ar: 'C-Class', slug: 'c-class' },
    { make_slug: 'mercedes', name: 'E-Class', name_ar: 'E-Class', slug: 'e-class' },
    { make_slug: 'nissan', name: 'Altima', name_ar: 'ألتيما', slug: 'altima' },
    { make_slug: 'nissan', name: 'Patrol', name_ar: 'باترول', slug: 'patrol' },
    { make_slug: 'hyundai', name: 'Elantra', name_ar: 'إلنترا', slug: 'elantra' },
    { make_slug: 'hyundai', name: 'Tucson', name_ar: 'توسان', slug: 'tucson' },
  ]
  const modelIds = {}
  for (const m of models) {
    const payload = { make_id: makeIds[m.make_slug], name: m.name, name_ar: m.name_ar, slug: m.slug }
    modelIds[m.slug] = await upsert('car_models', payload)
  }

  // Profile
  const existingProfile = await api('profiles', 'GET', null, `id=eq.${userId}&select=id&limit=1`)
  if (!existingProfile || existingProfile.length === 0) {
    await api('profiles', 'POST', { id: userId, phone: '0555000001', full_name: 'معرض الرياض للسيارات', locale: 'ar', is_active: true })
  }

  // Vehicles
  const vehicles = [
    { ms: 'toyota', md: 'camry', y: 2024, mi: 15000, co: 'white', fu: 'gasoline', tr: 'automatic', dr: 'fwd', bo: 'sedan', cd: 'used', ci: 'riyadh', pr: 89000, f: true },
    { ms: 'toyota', md: 'corolla', y: 2023, mi: 25000, co: 'black', fu: 'gasoline', tr: 'automatic', dr: 'fwd', bo: 'sedan', cd: 'used', ci: 'jeddah', pr: 65000, f: false },
    { ms: 'toyota', md: 'land-cruiser', y: 2024, mi: 8000, co: 'white', fu: 'gasoline', tr: 'automatic', dr: '4wd', bo: 'suv', cd: 'new', ci: 'riyadh', pr: 320000, f: true },
    { ms: 'bmw', md: '320i', y: 2023, mi: 18000, co: 'blue', fu: 'gasoline', tr: 'automatic', dr: 'rwd', bo: 'sedan', cd: 'used', ci: 'khobar', pr: 145000, f: false },
    { ms: 'bmw', md: 'x5', y: 2024, mi: 5000, co: 'black', fu: 'gasoline', tr: 'automatic', dr: 'awd', bo: 'suv', cd: 'new', ci: 'khobar', pr: 380000, f: true },
    { ms: 'mercedes', md: 'c-class', y: 2023, mi: 12000, co: 'silver', fu: 'gasoline', tr: 'automatic', dr: 'rwd', bo: 'sedan', cd: 'used', ci: 'riyadh', pr: 165000, f: false },
    { ms: 'mercedes', md: 'e-class', y: 2024, mi: 3000, co: 'gray', fu: 'gasoline', tr: 'automatic', dr: 'rwd', bo: 'sedan', cd: 'new', ci: 'jeddah', pr: 250000, f: true },
    { ms: 'nissan', md: 'altima', y: 2023, mi: 22000, co: 'red', fu: 'gasoline', tr: 'cvt', dr: 'fwd', bo: 'sedan', cd: 'used', ci: 'dammam', pr: 72000, f: false },
    { ms: 'nissan', md: 'patrol', y: 2024, mi: 2000, co: 'white', fu: 'gasoline', tr: 'automatic', dr: '4wd', bo: 'suv', cd: 'new', ci: 'riyadh', pr: 290000, f: true },
    { ms: 'hyundai', md: 'elantra', y: 2023, mi: 20000, co: 'blue', fu: 'gasoline', tr: 'automatic', dr: 'fwd', bo: 'sedan', cd: 'used', ci: 'jeddah', pr: 58000, f: false },
    { ms: 'hyundai', md: 'tucson', y: 2024, mi: 10000, co: 'silver', fu: 'gasoline', tr: 'automatic', dr: 'awd', bo: 'suv', cd: 'used', ci: 'riyadh', pr: 95000, f: false },
    { ms: 'toyota', md: 'camry', y: 2022, mi: 35000, co: 'gray', fu: 'gasoline', tr: 'automatic', dr: 'fwd', bo: 'sedan', cd: 'used', ci: 'dammam', pr: 75000, f: false },
    { ms: 'bmw', md: '320i', y: 2022, mi: 40000, co: 'white', fu: 'gasoline', tr: 'automatic', dr: 'rwd', bo: 'sedan', cd: 'used', ci: 'riyadh', pr: 120000, f: false },
    { ms: 'mercedes', md: 'c-class', y: 2024, mi: 1000, co: 'black', fu: 'gasoline', tr: 'automatic', dr: 'rwd', bo: 'sedan', cd: 'new', ci: 'jeddah', pr: 210000, f: true },
    { ms: 'nissan', md: 'altima', y: 2024, mi: 7000, co: 'white', fu: 'gasoline', tr: 'cvt', dr: 'fwd', bo: 'sedan', cd: 'used', ci: 'riyadh', pr: 85000, f: false },
    { ms: 'hyundai', md: 'elantra', y: 2024, mi: 5000, co: 'red', fu: 'gasoline', tr: 'automatic', dr: 'fwd', bo: 'sedan', cd: 'new', ci: 'khobar', pr: 72000, f: false },
    { ms: 'toyota', md: 'corolla', y: 2022, mi: 45000, co: 'silver', fu: 'gasoline', tr: 'automatic', dr: 'fwd', bo: 'sedan', cd: 'used', ci: 'dammam', pr: 55000, f: false },
    { ms: 'nissan', md: 'patrol', y: 2023, mi: 15000, co: 'black', fu: 'gasoline', tr: 'automatic', dr: '4wd', bo: 'suv', cd: 'used', ci: 'riyadh', pr: 260000, f: true },
    { ms: 'mercedes', md: 'e-class', y: 2023, mi: 20000, co: 'blue', fu: 'gasoline', tr: 'automatic', dr: 'rwd', bo: 'sedan', cd: 'used', ci: 'dammam', pr: 195000, f: false },
    { ms: 'hyundai', md: 'tucson', y: 2023, mi: 28000, co: 'gray', fu: 'gasoline', tr: 'automatic', dr: 'awd', bo: 'suv', cd: 'used', ci: 'jeddah', pr: 82000, f: false },
  ]

  let created = 0
  for (const v of vehicles) {
    const vehicleRes = await api('vehicles', 'POST', {
      make_id: makeIds[v.ms], model_id: modelIds[v.md], year: v.y, mileage: v.mi,
      color_id: refs[`car_colors:${v.co}`], fuel_type_id: refs[`fuel_types:${v.fu}`],
      transmission_id: refs[`transmission_types:${v.tr}`], drivetrain_id: refs[`drivetrain_types:${v.dr}`],
      body_type_id: refs[`body_types:${v.bo}`], condition_type_id: refs[`vehicle_condition_types:${v.cd}`],
      owner_id: userId, description: `${v.y} ${v.ms} ${v.md} - ${v.cd === 'new' ? 'جديدة' : 'ممتازة'}`,
    })
    const vehicleId = vehicleRes?.[0]?.id
    if (!vehicleId) { console.error('Failed to create vehicle:', v.ms, v.md); continue }

    const slug = `${v.y}-${v.ms}-${v.md}-${Math.random().toString(36).slice(2, 6)}`
    await api('vehicle_listings', 'POST', {
      vehicle_id: vehicleId, seller_id: userId, price: v.pr, status: 'active',
      is_featured: v.f, slug, city_id: cityIds[v.ci],
    })
    created++
  }

  console.log(`Done! Created ${created} listings.`)
}

main().catch(console.error)
