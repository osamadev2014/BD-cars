import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Missing env vars', url: !!url, anonKey: !!anonKey }, { status: 500 })
  }

  const supabase = createClient(url, anonKey)

  const { data, error, count } = await supabase
    .from('vehicle_listings')
    .select('id,title,slug,price,status', { count: 'exact', head: false })
    .in('status', ['published', 'published_with_trusted_badge', 'reserved'])
    .limit(5)

  return NextResponse.json({ data, error: error?.message, count, url })
}
