'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { updateAppSetting } from '@/lib/actions/settings-actions'
import { useRouter } from 'next/navigation'

interface Setting {
  id: string
  category: string
  key: string
  value: unknown
  type: string
  label: string
  description: string | null
  is_public: boolean
  is_dangerous: boolean
}

export function SettingsForm({
  grouped,
  categories,
  locale,
}: {
  grouped: Record<string, Setting[]>
  categories: string[]
  locale: 'ar' | 'en'
}) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ key: string; type: 'success' | 'error' } | null>(null)

  const categoryLabels: Record<string, string> = {
    general: t('cat_general'),
    branding: t('cat_branding'),
    theme: t('cat_theme'),
    language: t('cat_language'),
    features: t('cat_features'),
    listing: t('cat_listing'),
    inspection: t('cat_inspection'),
    payment: t('cat_payment'),
  }

  const parseValue = (setting: Setting, raw: string) => {
    if (setting.type === 'boolean') return raw === 'true'
    if (setting.type === 'number') return Number(raw)
    return raw
  }

  const handleChange = async (setting: Setting, raw: string) => {
    setSaving(setting.key)
    setMessage(null)
    const value = parseValue(setting, raw)
    try {
      await updateAppSetting(setting.key, String(value))
      setMessage({ key: setting.key, type: 'success' })
      router.refresh()
    } catch {
      setMessage({ key: setting.key, type: 'error' })
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category} className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold capitalize">
            {categoryLabels[category] || category}
          </h2>
          {grouped[category].map((setting) => {
            const strValue = String(setting.value ?? '')
            const isSaving = saving === setting.key
            const msg = message?.key === setting.key ? message : null

            return (
              <div key={setting.key} className="space-y-1.5">
                <label className="block text-sm font-medium">{setting.label}</label>
                {setting.description && (
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                )}

                {setting.type === 'boolean' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={strValue === 'true'}
                      onChange={(e) => handleChange(setting, String(e.target.checked))}
                      disabled={isSaving}
                      className="rounded border-input h-4 w-4"
                    />
                    <span className="text-sm">{strValue === 'true' ? t('enabled') : t('disabled')}</span>
                  </label>
                ) : setting.type === 'number' ? (
                  <input
                    type="number"
                    defaultValue={strValue}
                    onBlur={(e) => {
                      if (e.target.value !== strValue) handleChange(setting, e.target.value)
                    }}
                    disabled={isSaving}
                    className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                    dir="ltr"
                  />
                ) : (
                  <input
                    type="text"
                    defaultValue={strValue}
                    onBlur={(e) => {
                      if (e.target.value !== strValue) handleChange(setting, e.target.value)
                    }}
                    disabled={isSaving}
                    className="w-full max-w-md rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  />
                )}

                {msg && (
                  <p className={`text-xs ${msg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {msg.type === 'success' ? t('setting_saved') : t('setting_error')}
                  </p>
                )}
                {isSaving && <p className="text-xs text-muted-foreground">{t('saving')}</p>}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
