'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { addCrmNote, updateCrmTags } from '@/lib/actions/crm-actions'

export function CrmCustomerDetailClient({ customer }: { customer: any }) {
  const t = useTranslations('crm')
  const router = useRouter()
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(customer.crm?.tags || [])

  const addNewTag = async () => {
    if (!tagInput.trim()) return
    const newTags = [...tags, tagInput.trim()]
    setTags(newTags)
    setTagInput('')
    await updateCrmTags(customer.id, newTags)
    router.refresh()
  }

  const removeTag = async (tag: string) => {
    const newTags = tags.filter(t => t !== tag)
    setTags(newTags)
    await updateCrmTags(customer.id, newTags)
    router.refresh()
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim() || saving || !customer.crm?.id) return
    setSaving(true)
    await addCrmNote(customer.crm.id, note)
    setSaving(false)
    setNote('')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
            {(customer.full_name || 'U')[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{customer.full_name || 'Unknown'}</h1>
            <p className="text-muted-foreground">{customer.phone || 'No phone'}</p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs bg-muted px-2 py-0.5 rounded">{customer.role?.role || 'user'}</span>
              <span className="text-xs text-muted-foreground">{t('joined')} {new Date(customer.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">{t('tags')}</h3>
        <div className="flex gap-2 flex-wrap mb-2">
          {tags.map((tag: string) => (
            <span key={tag} className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1">
              {tag}
              <button onClick={() => removeTag(tag)} className="text-primary/60 hover:text-primary">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            placeholder={t('add_tag')}
            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addNewTag())}
          />
          <button onClick={addNewTag} className="text-sm text-primary hover:underline">{t('add')}</button>
        </div>
      </div>

      {/* Notes */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">{t('notes')}</h3>
        <form onSubmit={handleAddNote} className="mb-4 space-y-2">
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={t('note_placeholder')}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none"
          />
          <button type="submit" disabled={saving || !note.trim() || !customer.crm?.id} className="text-sm text-primary hover:underline disabled:opacity-50">
            {saving ? t('saving') : t('save_note')}
          </button>
        </form>
        <div className="space-y-2">
          {(customer.notes || []).map((n: any) => (
            <div key={n.id} className="p-3 bg-muted rounded">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium">{n.author?.full_name || 'Admin'}</span>
                <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm">{n.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">{t('timeline')}</h3>
        <div className="space-y-0">
          {(customer.timeline || []).map((entry: any) => (
            <div key={entry.id} className="flex gap-3 pb-4 border-l-2 border-muted pl-4 last:pb-0 relative">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-muted" />
              <div>
                <p className="text-sm font-medium">{entry.event_type}</p>
                <p className="text-xs text-muted-foreground">{entry.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(entry.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {(!customer.timeline || customer.timeline.length === 0) && (
            <p className="text-sm text-muted-foreground">{t('no_timeline')}</p>
          )}
        </div>
      </div>

      {/* Listings */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">{t('listings')} ({customer.listings?.length || 0})</h3>
        <div className="space-y-2">
          {(customer.listings || []).map((l: any) => (
            <div key={l.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
              <div className="flex items-center gap-3">
                {l.vehicle?.images?.[0] && (
                  <img src={l.vehicle.images[0].url} className="w-12 h-9 rounded object-cover" alt="" />
                )}
                <div>
                  <p className="text-sm font-medium">{l.vehicle?.make?.name} {l.vehicle?.model?.name} ({l.vehicle?.year})</p>
                  <p className="text-xs text-muted-foreground">{l.status} &middot; {l.price} SAR</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Support Tickets */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">{t('tickets')} ({customer.tickets?.length || 0})</h3>
        <div className="space-y-2">
          {(customer.tickets || []).map((t: any) => (
            <div key={t.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
              <p className="text-sm font-medium">{t.subject}</p>
              <span className="text-xs text-muted-foreground">{t.status} &middot; {new Date(t.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
