'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createPage, deletePage, createBanner, deleteBanner } from '@/lib/actions/content-actions'
import Link from 'next/link'

export function ContentManagerClient({ pages, banners }: { pages: any[]; banners: any[] }) {
  const t = useTranslations('content')
  const router = useRouter()
  const [tab, setTab] = useState<'pages' | 'banners'>('pages')
  const [showPageForm, setShowPageForm] = useState(false)
  const [showBannerForm, setShowBannerForm] = useState(false)
  const [loading, setLoading] = useState(false)

  // Page form state
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [titleAr, setTitleAr] = useState('')
  const [content, setContent] = useState('')
  const [contentAr, setContentAr] = useState('')

  // Banner form state
  const [bTitle, setBTitle] = useState('')
  const [bTitleAr, setBTitleAr] = useState('')
  const [bSubtitle, setBSubtitle] = useState('')
  const [bSubtitleAr, setBSubtitleAr] = useState('')
  const [bImageUrl, setBImageUrl] = useState('')
  const [bLinkUrl, setBLinkUrl] = useState('')
  const [bSortOrder, setBSortOrder] = useState('0')

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const fd = new FormData()
    fd.set('slug', slug)
    fd.set('title', title)
    fd.set('title_ar', titleAr)
    fd.set('content', content)
    fd.set('content_ar', contentAr)
    const result = await createPage(fd)
    setLoading(false)
    if (result.success) { setShowPageForm(false); resetPageForm(); router.refresh() }
    else alert(result.error)
  }

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const fd = new FormData()
    fd.set('title', bTitle); fd.set('title_ar', bTitleAr)
    fd.set('subtitle', bSubtitle); fd.set('subtitle_ar', bSubtitleAr)
    fd.set('image_url', bImageUrl); fd.set('link_url', bLinkUrl)
    fd.set('sort_order', bSortOrder)
    const result = await createBanner(fd)
    setLoading(false)
    if (result.success) { setShowBannerForm(false); resetBannerForm(); router.refresh() }
    else alert(result.error)
  }

  const handleDeletePage = async (id: string) => {
    if (!confirm(t('confirm_delete'))) return
    await deletePage(id)
    router.refresh()
  }

  const handleDeleteBanner = async (id: string) => {
    if (!confirm(t('confirm_delete'))) return
    await deleteBanner(id)
    router.refresh()
  }

  const resetPageForm = () => { setSlug(''); setTitle(''); setTitleAr(''); setContent(''); setContentAr('') }
  const resetBannerForm = () => { setBTitle(''); setBTitleAr(''); setBSubtitle(''); setBSubtitleAr(''); setBImageUrl(''); setBLinkUrl(''); setBSortOrder('0') }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      <div className="flex gap-2 border-b">
        <button onClick={() => setTab('pages')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'pages' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>{t('pages')}</button>
        <button onClick={() => setTab('banners')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'banners' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>{t('banners')}</button>
      </div>

      {tab === 'pages' && (
        <div className="space-y-4">
          <button onClick={() => setShowPageForm(!showPageForm)} className="text-sm text-primary hover:underline">
            {showPageForm ? t('cancel') : `+ ${t('new_page')}`}
          </button>

          {showPageForm && (
            <form onSubmit={handleCreatePage} className="border rounded-lg p-4 space-y-3">
              <input value={slug} onChange={e => setSlug(e.target.value)} placeholder={t('slug')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
              <div className="grid grid-cols-2 gap-3">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('title')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
                <input value={titleAr} onChange={e => setTitleAr(e.target.value)} placeholder={`${t('title')} (عربي)`} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t('content')} className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" required />
              <textarea value={contentAr} onChange={e => setContentAr(e.target.value)} placeholder={`${t('content')} (عربي)`} className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none" />
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{t('save')}</button>
            </form>
          )}

          <div className="space-y-2">
            {pages.map((page: any) => (
              <div key={page.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <Link href={`/admin/content/${page.id}`} className="font-medium hover:underline">{page.title}</Link>
                  <p className="text-xs text-muted-foreground">/{page.slug} {!page.is_published && <span className="text-yellow-600 ml-2">{t('draft')}</span>}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/content/${page.id}`} className="text-xs text-primary hover:underline">{t('edit')}</Link>
                  <button onClick={() => handleDeletePage(page.id)} className="text-xs text-red-500 hover:underline">{t('delete')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'banners' && (
        <div className="space-y-4">
          <button onClick={() => setShowBannerForm(!showBannerForm)} className="text-sm text-primary hover:underline">
            {showBannerForm ? t('cancel') : `+ ${t('new_banner')}`}
          </button>

          {showBannerForm && (
            <form onSubmit={handleCreateBanner} className="border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={bTitle} onChange={e => setBTitle(e.target.value)} placeholder={t('title')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
                <input value={bTitleAr} onChange={e => setBTitleAr(e.target.value)} placeholder={`${t('title')} (عربي)`} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={bSubtitle} onChange={e => setBSubtitle(e.target.value)} placeholder={t('subtitle')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                <input value={bSubtitleAr} onChange={e => setBSubtitleAr(e.target.value)} placeholder={`${t('subtitle')} (عربي)`} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <input value={bImageUrl} onChange={e => setBImageUrl(e.target.value)} placeholder={t('image_url')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
              <input value={bLinkUrl} onChange={e => setBLinkUrl(e.target.value)} placeholder={t('link_url')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <input value={bSortOrder} onChange={e => setBSortOrder(e.target.value)} type="number" placeholder={t('sort_order')} className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{t('save')}</button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((banner: any) => (
              <div key={banner.id} className="border rounded-lg overflow-hidden">
                <img src={banner.image_url} alt={banner.title} className="w-full h-40 object-cover" />
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{banner.title}</p>
                    <p className="text-xs text-muted-foreground">{t('order')}: {banner.sort_order}</p>
                  </div>
                  <button onClick={() => handleDeleteBanner(banner.id)} className="text-xs text-red-500 hover:underline">{t('delete')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
