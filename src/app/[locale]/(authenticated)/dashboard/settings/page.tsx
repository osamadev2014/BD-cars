'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'

export default function SettingsPage() {
  const t = useTranslations('common')
  const s = useTranslations('settings')
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.full_name) setName(user.full_name)
  }, [user])

  if (!user) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaved(false)

    try {
      const supabase = (await import('@/lib/supabase/client')).createClient()
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', user.id)

      if (updateError) throw updateError
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError(s('save_error'))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{s('title')}</h1>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{s('general')}</h2>

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium mb-1">
              {t('name') || 'Full Name'}
            </label>
            <input
              id="full_name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('phone') || 'Phone'}
            </label>
            <input
              type="text"
              value={`+966 ${user.phone}`}
              disabled
              className="w-full rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground"
              dir="ltr"
            />
            <p className="mt-1 text-xs text-muted-foreground">{s('phone_not_changeable') || 'Phone number cannot be changed'}</p>
          </div>
        </section>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {saved && <p className="text-sm text-green-600">{s('save_success')}</p>}

        <button
          type="submit"
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t('save')}
        </button>
      </form>
    </div>
  )
}
