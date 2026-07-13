const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const photos = [
  '1621007947382-bb3c3994e2ae',
  '1503376780353-7e6692767b70',
  '1544636331-e26879cd4d9b',
  '1552519507-da3b142c6e3d',
  '1504215688697-9f4b3a49b92b',
  '1542362567-b07e0b9e2ef0',
  '1555215695-3004980ad54e',
  '1533473359331-0135ef1b58bf',
  '1583121274602-3e2820c69888',
  '1560958089-b8a1929cea89',
  '1568605117036-5fe5e7bab0b7',
  '1549399542-7e3f8b79c341',
  '1554744511-d6c603f27c54',
  '1494976388531-d1058494cdd8',
  '1568849676085-51415763900b',
  '1566024287286-457246b67634',
  '1606811971618-4486d14f3f99',
  '1561580125-02841297628e',
  '1504919791753-6b80a2a72b06',
  '1511914761546-3b2d6c689c8e',
]

const base = 'https://images.unsplash.com/photo-'
const params = '?w=800&h=600&fit=crop&q=80&auto=format'
const api = `${SUPABASE_URL}/rest/v1`
const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

async function get(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`GET ${url}: ${res.status} ${await res.text()}`)
  return res.json()
}

async function patch(url, body) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PATCH ${url}: ${res.status} ${text}`)
  }
}

console.log('Fetching vehicle images...')
const images = await get(`${api}/vehicle_images?select=id&order=vehicle_id.asc,sort_order.asc`)

console.log(`Found ${images.length} images to update`)

let idx = 0
for (const img of images) {
  const url = `${base}${photos[idx % photos.length]}${params}`
  await patch(`${api}/vehicle_images?id=eq.${img.id}`, { url })
  console.log(`  ✓ Image ${img.id}`)
  idx++
}

console.log(`\nDone! Updated ${idx} images with real car photos.`)
