'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { updatePage } from '@/lib/actions/content-actions'

export function PageEditorClient({ page }: { page: any }) {
  const t = useTranslations('content')
  const router = useRouter()
  const [slug, setSlug] = useState(page.slug)
  const [title, setTitle] = useState(page.title)
  const [titleAr, setTitleAr] = useState(page.title_ar || '')
  const [content, setContent] = useState(page.content)
  const [contentAr, setContentAr] = useState(page.content_ar || '')
  const [published, setPublished] = useState(page.is_published)
  const [loading, setLoading] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const fd = new FormData()
    fd.set('slug', slug)
    fd.set('title', title)
    fd.set('title_ar', titleAr)
    fd.set('content', content)
    fd.set('content_ar', contentAr)
    fd.set('is_published', String(published))
    const result = await updatePage(page.id, fd)
    setLoading(false)
    if (result.success) router.refresh()
    else alert(result.error)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('edit_page')}</h1>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="rounded" />
          {t('published')}
        </label>
      </div>
      <input value={slug} onChange={e => setSlug(e.target.value)} placeholder={t('slug')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
      <div className="grid grid-cols-2 gap-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('title')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
        <input value={titleAr} onChange={e => setTitleAr(e.target.value)} placeholder={`${t('title')} (عربي)`} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">{t('content')} (EN)</p>
        <textarea value={content} onChange={e => setContent(e.target.value)} className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm font-mono resize-none" required />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">{t('content')} (عربي)</p>
        <textarea value={contentAr} onChange={e => setContentAr(e.target.value)} className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm font-mono resize-none" />
      </div>
      <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{t('save')}</button>
    </form>
  )
}
