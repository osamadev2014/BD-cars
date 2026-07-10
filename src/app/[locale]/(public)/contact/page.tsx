import { getTranslations } from 'next-intl/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ContactForm } from './contact-form'

export default async function ContactPage() {
  const t = await getTranslations('support')
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-2">{t('contact_title')}</h1>
      <p className="text-muted-foreground mb-8">{t('contact_subtitle')}</p>
      <ContactForm isLoggedIn={!!user} />
    </div>
  )
}
