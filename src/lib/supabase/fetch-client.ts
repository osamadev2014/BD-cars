type QueryParams = {
  select?: string
  limit?: number
  offset?: number
  order?: string
  [key: string]: unknown
}

export async function fetchSupabase<T = unknown>(table: string, params: QueryParams = {}): Promise<{ data: T | null; error: string | null }> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) return { data: null, error: 'Missing env vars' }

    const { select = '*', limit, offset, order, ...filters } = params
    const searchParams = new URLSearchParams()
    searchParams.set('select', select)
    if (limit) searchParams.set('limit', String(limit))
    if (offset) searchParams.set('offset', String(offset))
    if (order) searchParams.set('order', order)
    for (const [key, val] of Object.entries(filters)) {
      if (val !== undefined && val !== null) searchParams.set(key, String(val))
    }

    const res = await fetch(`${url}/rest/v1/${table}?${searchParams.toString()}`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      next: { revalidate: 0 },
    })
    if (!res.ok) return { data: null, error: `${res.status}: ${await res.text()}` }
    const data = await res.json()
    return { data, error: null }
  } catch (e) {
    return { data: null, error: String(e) }
  }
}
