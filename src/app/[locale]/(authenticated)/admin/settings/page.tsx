import { getTranslations } from 'next-intl/server'
import { requirePermission } from '@/server/guards'
import { getAppSettings } from '@/lib/actions/settings-actions'
import { SettingsForm } from './settings-form'

export default async function AdminSettingsPage() {
  const t = await getTranslations('admin')
  const guard = await requirePermission('edit_settings')
  if (!guard.allowed) {
    return <div className="text-center py-12 text-muted-foreground">{t('access_denied')}</div>
  }

  const settings = await getAppSettings()

  const grouped = settings.reduce<Record<string, typeof settings>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('settings')}</h1>
      <SettingsForm grouped={grouped} categories={Object.keys(grouped)} locale={t('locale') as 'ar' | 'en'} />
    </div>
  )
}
