'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Plus, Search, X, AlertTriangle } from 'lucide-react'
import { getMyOrganizations } from '@/lib/actions/org-actions'
import { validateOrgAccess } from '@/lib/actions/org-select-actions'
import { ORG_TYPE_SLUG_MAP } from '@/config/dashboard'
import type { DbOrgType } from '@/config/dashboard'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { Select } from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import { isPlatformAdmin } from '@/lib/permissions/platform-roles'
import { OrganizationCard, getOrgLabel } from '@/components/business/OrganizationCard'
import { OrganizationSelectorHeader } from '@/components/business/OrganizationSelectorHeader'
import { OrganizationSelectorSkeleton } from '@/components/business/OrganizationSelectorSkeleton'
import { OrganizationSelectorEmptyState } from '@/components/business/OrganizationSelectorEmptyState'
import { cn } from '@/lib/utils'

export default function BusinessSelectPage() {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [orgs, setOrgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selecting, setSelecting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  const loadOrgs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyOrganizations()
      setOrgs(data)
    } catch (err) {
      console.error('[BusinessSelect] Failed to load organizations:', err)
      setError(isRtl ? 'تعذر تحميل المنشآت' : 'Failed to load organizations')
    } finally {
      setLoading(false)
    }
  }, [isRtl])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace(`/${locale}/login`)
      return
    }
    if (isPlatformAdmin(user.roles)) {
      router.replace(`/${locale}/admin`)
      return
    }
    loadOrgs()
  }, [user, authLoading, loadOrgs, locale, router])

  const handleSelect = useCallback(async (org: any) => {
    if (selecting) return

    if (org.status === 'incomplete' || (org.status === 'active' && !org.is_active)) {
      router.push(`/${locale}/business/register?org=${org.id}`)
      return
    }

    if (org.status === 'suspended') {
      router.push(`/${locale}/contact`)
      return
    }

    if (org.status === 'invited' || org.status === 'invite_pending') {
      return
    }

    if (org.status === 'pending_approval') {
      router.push(`/${locale}/business/pending`)
      return
    }

    setSelecting(org.id)

    try {
      const result = await validateOrgAccess(org.id)
      if (!result.allowed) {
        setError(result.error === 'Authentication required'
          ? (isRtl ? 'يرجى تسجيل الدخول' : 'Please sign in')
          : (isRtl ? 'ليس لديك صلاحية الوصول لهذه المنشأة' : 'Access denied'))
        setSelecting(null)
        return
      }

      localStorage.setItem('selected_org_id', org.id)
      localStorage.setItem('selected_org_type', org.org_type)
      const orgSlug = ORG_TYPE_SLUG_MAP[org.org_type as DbOrgType] || org.org_type
      router.push(`/${locale}/dashboard/${orgSlug}/overview`)
    } catch {
      router.push(`/${locale}/dashboard/car-dealer/overview`)
    }
  }, [selecting, locale, router, isRtl])

  const goToRegister = useCallback(() => {
    router.push(`/${locale}/business/register`)
  }, [locale, router])

  const orgTypes = useMemo(() => {
    const types = new Set(orgs.map((o) => o.org_type))
    return Array.from(types)
  }, [orgs])

  const filteredOrgs = useMemo(() => {
    let result = [...orgs]

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((o) =>
        (o.name || '').toLowerCase().includes(q) ||
        (o.name_ar || '').toLowerCase().includes(q)
      )
    }

    if (typeFilter) {
      result = result.filter((o) => o.org_type === typeFilter)
    }

    if (statusFilter) {
      result = result.filter((o) => o.status === statusFilter)
    }

    const recentOrgId = typeof window !== 'undefined' ? localStorage.getItem('selected_org_id') : null
    if (recentOrgId) {
      const recent = result.find((o) => o.id === recentOrgId)
      if (recent) {
        result = [recent, ...result.filter((o) => o.id !== recentOrgId)]
      }
    }

    if (sortBy === 'name') {
      result.sort((a, b) => (a.name_ar || a.name || '').localeCompare(b.name_ar || b.name || ''))
    } else if (sortBy === 'created') {
      result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    }

    return result
  }, [orgs, searchQuery, typeFilter, statusFilter, sortBy])

  const showFilters = orgs.length > 5

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse h-16 bg-muted/50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <OrganizationSelectorSkeleton />
        </div>
      </div>
    )
  }

  if (!user) return null

  if (error && orgs.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <OrganizationSelectorHeader onCreate={goToRegister} />
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5 ring-1 ring-destructive/20">
            <svg className="h-8 w-8 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            {isRtl ? 'تعذر تحميل المنشآت' : 'Failed to Load'}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
            {isRtl
              ? 'حدث خطأ أثناء تحميل مساحات العمل الخاصة بك. يرجى المحاولة مرة أخرى.'
              : 'An error occurred while loading your workspaces. Please try again.'}
          </p>
          <div className="flex gap-3 mt-8">
            <Button onClick={loadOrgs} size="lg">
              {isRtl ? 'إعادة المحاولة' : 'Retry'}
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push(`/${locale}/contact`)}>
              {isRtl ? 'تواصل مع الدعم' : 'Contact Support'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OrganizationSelectorHeader onCreate={goToRegister} />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Heading section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[28px] sm:text-[32px] font-bold text-foreground tracking-tight leading-tight">
                {isRtl ? 'اختر مساحة العمل' : 'Choose your workspace'}
              </h1>
              <p className="text-muted-foreground mt-1.5 text-base leading-relaxed">
                {isRtl
                  ? 'اختر المنشأة التي تريد إدارتها أو أنشئ منشأة جديدة.'
                  : 'Select the organization you want to manage or create a new one.'}
              </p>
            </div>
            <Button onClick={goToRegister} size="lg" className="shrink-0 whitespace-nowrap h-12">
              <Plus className="h-5 w-5" />
              {isRtl ? 'إنشاء منشأة جديدة' : 'Create Organization'}
            </Button>
          </div>

          {/* Loading skeleton */}
          {loading && <OrganizationSelectorSkeleton />}

          {/* Empty state */}
          {!loading && orgs.length === 0 && !error && (
            <OrganizationSelectorEmptyState isRtl={isRtl} onCreate={goToRegister} />
          )}

          {/* Organizations grid */}
          {!loading && orgs.length > 0 && (
            <>
              {/* Search & filters - only when >5 orgs */}
              {showFilters && (
                <div className="flex flex-col sm:flex-row gap-3 mb-6" dir={isRtl ? 'rtl' : 'ltr'}>
                  <div className="flex-1">
                    <SearchInput
                      placeholder={isRtl ? 'ابحث باسم المنشأة' : 'Search by organization name'}
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery('')}
                      size="md"
                    />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div className="w-44">
                      <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        options={[
                          { value: '', label: isRtl ? 'جميع الأنشطة' : 'All Types' },
                          ...orgTypes.map((t) => ({
                            value: t,
                            label: getOrgLabel(t, isRtl),
                          })),
                        ]}
                        placeholder={isRtl ? 'النشاط' : 'Type'}
                      />
                    </div>
                    <div className="w-40">
                      <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                          { value: '', label: isRtl ? 'جميع الحالات' : 'All Status' },
                          { value: 'active', label: isRtl ? 'نشطة' : 'Active' },
                          { value: 'pending_approval', label: isRtl ? 'قيد المراجعة' : 'Under Review' },
                          { value: 'suspended', label: isRtl ? 'موقوفة' : 'Suspended' },
                        ]}
                        placeholder={isRtl ? 'الحالة' : 'Status'}
                      />
                    </div>
                    <div className="w-40">
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        options={[
                          { value: 'recent', label: isRtl ? 'آخر استخدام' : 'Recent' },
                          { value: 'name', label: isRtl ? 'الاسم' : 'Name' },
                          { value: 'created', label: isRtl ? 'تاريخ الإنشاء' : 'Newest' },
                        ]}
                        placeholder={isRtl ? 'ترتيب' : 'Sort'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Inline error */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Org cards grid */}
              <div
                className={cn(
                  'grid gap-5',
                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                )}
              >
                {filteredOrgs.map((org, index) => {
                  const recentOrgId = typeof window !== 'undefined' ? localStorage.getItem('selected_org_id') : null
                  const isRecent = index === 0 && org.id === recentOrgId && orgs.length > 1
                  return (
                    <OrganizationCard
                      key={org.id}
                      org={org}
                      isRtl={isRtl}
                      isRecent={isRecent}
                      selecting={selecting}
                      onSelect={handleSelect}
                    />
                  )
                })}
              </div>

              {/* No results for filters */}
              {filteredOrgs.length === 0 && (
                <div className="text-center py-12">
                  <svg className="h-8 w-8 text-muted-foreground mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p className="text-muted-foreground">
                    {isRtl ? 'لا توجد نتائج مطابقة' : 'No matching results'}
                  </p>
                  <Button variant="ghost" className="mt-2" onClick={() => { setSearchQuery(''); setTypeFilter(''); setStatusFilter('') }}>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    {isRtl ? 'مسح التصفية' : 'Clear filters'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border/30 bg-background mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground/60">
            <span>&copy; 2026 {isRtl ? 'ريون' : 'Riyon'}</span>
            <div className="flex items-center gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
              <a href={`/${locale}/pages/terms`} className="hover:text-foreground transition-colors">
                {isRtl ? 'الشروط والأحكام' : 'Terms'}
              </a>
              <span className="text-border/40">&middot;</span>
              <a href={`/${locale}/pages/privacy`} className="hover:text-foreground transition-colors">
                {isRtl ? 'سياسة الخصوصية' : 'Privacy'}
              </a>
              <span className="text-border/40">&middot;</span>
              <a href={`/${locale}/contact`} className="hover:text-foreground transition-colors">
                {isRtl ? 'المساعدة' : 'Help'}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
