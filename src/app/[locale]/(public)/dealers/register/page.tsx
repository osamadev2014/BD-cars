import { getTranslations } from 'next-intl/server'
import { getCities } from '@/lib/actions/dealer-actions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { DealerRegisterForm } from './dealer-register-form'

export default async function DealerRegisterPage() {
  const t = await getTranslations('dealers')
  const cities = await getCities()
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-2">{t('register_title')}</h1>
      <p className="text-muted-foreground mb-6">{t('register_subtitle')}</p>
      <DealerRegisterForm cities={cities} isLoggedIn={!!user} />
    </div>
  )
}
