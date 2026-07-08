// Type-safe Supabase query helpers
// These cast the client to avoid type inference issues with handwritten types

type SupabaseClient = ReturnType<typeof import('./client').createClient>

export function db(supabase: SupabaseClient, table: string) {
  return (supabase as unknown as { from: (t: string) => ReturnType<SupabaseClient['from']> }).from(table)
}

export function adminDb(table: string) {
  const { getAdminClient } = require('./admin')
  const client = getAdminClient()
  return (client as unknown as { from: (t: string) => ReturnType<typeof client.from> }).from(table)
}
