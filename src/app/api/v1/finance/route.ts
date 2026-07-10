import { createServerSupabaseClient } from '@/lib/supabase/server'
import { success } from '@/lib/api-response'
import { handleApiError } from '@/lib/api-helpers'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await (supabase as any)
      .from('finance_partners')
      .select('*')
      .eq('is_active', true)
      .order('name')

    return success(data || [])
  } catch (err) { return handleApiError(err) }
}
