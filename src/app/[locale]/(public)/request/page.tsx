import { getTranslations } from 'next-intl/server'
import { getMakes, getModels } from '@/lib/actions/vehicle-actions'
import { getBodyTypes } from '@/lib/actions/request-actions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { RequestForm } from './request-form'

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ make?: string }> }) {
  const t = await getTranslations('vehicle_requests')
  const makes = await getMakes()
  const bodyTypes = await getBodyTypes()
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">{t('request_title')}</h1>
      <p className="text-muted-foreground mb-8">{t('request_subtitle')}</p>
      <RequestForm makes={makes} bodyTypes={bodyTypes} isLoggedIn={!!user} />
    </div>
  )
}
