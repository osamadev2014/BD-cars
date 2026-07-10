import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success } from '@/lib/api-response'
import { handleApiError } from '@/lib/api-helpers'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const tables = [
      'body_types',
      'fuel_types',
      'transmission_types',
      'car_colors',
      'vehicle_condition_types',
      'drivetrain_types',
      'cities',
    ] as const

    const results: Record<string, unknown[]> = {}
    for (const table of tables) {
      const { data } = await (supabase as any)
        .from(table)
        .select('*')
        .order('name')
      results[table] = data || []
    }

    return success(results)
  } catch (err) { return handleApiError(err) }
}
