'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { approveOrganization, rejectOrganization } from '@/lib/actions/org-actions'
import { useLocale } from 'next-intl'
import { Building2, CheckCircle2, XCircle, Clock } from 'lucide-react'

const STATUS_BADGE: Record<string, { bg: string; text: string; label_ar: string; label_en: string }> = {
  pending_approval: { bg: 'bg-amber-100', text: 'text-amber-700', label_ar: 'قيد المراجعة', label_en: 'Pending' },
  active: { bg: 'bg-green-100', text: 'text-green-700', label_ar: 'نشط', label_en: 'Active' },
  suspended: { bg: 'bg-red-100', text: 'text-red-700', label_ar: 'موقوف', label_en: 'Suspended' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label_ar: 'مرفوض', label_en: 'Rejected' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-700', label_ar: 'مغلق', label_en: 'Closed' },
}

export function OrganizationsClient({ org }: { org: any }) {
  const t = useTranslations('admin')
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const badge = STATUS_BADGE[org.status] || STATUS_BADGE.pending_approval

  const handleApprove = async () => {
    setLoading(true)
    try {
      await approveOrganization(org.id)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return
    setLoading(true)
    try {
      await rejectOrganization(org.id, rejectReason)
      setShowReject(false)
      setRejectReason('')
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const orgTypeLabel = org.org_type?.replace(/_/g, ' ')

  return (
    <div className="border rounded-lg p-4 flex gap-4 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Building2 className="h-6 w-6 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold">{org.name_ar || org.name}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
            {isRtl ? badge.label_ar : badge.label_en}
          </span>
        </div>
        <p className="text-sm text-muted-foreground capitalize">{orgTypeLabel}</p>
        <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
          <span>{isRtl ? 'المسجل:' : 'Owner:'} {org.owner?.full_name || org.created_by?.slice(0, 8)}</span>
          <span>{isRtl ? 'الهاتف:' : 'Phone:'} {org.owner?.phone || org.phone || '-'}</span>
          <span>{new Date(org.created_at).toLocaleDateString()}</span>
        </div>
        {org.status_notes && (
          <p className="text-xs text-red-600 mt-1">{org.status_notes}</p>
        )}
      </div>

      {org.status === 'pending_approval' && (
        <div className="shrink-0 space-y-2">
          <div className="flex gap-1">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {t('approve')}
            </button>
            <button
              onClick={() => setShowReject(true)}
              disabled={loading}
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {t('reject')}
            </button>
          </div>
        </div>
      )}

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowReject(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold">{t('reject_title')}</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('reject_placeholder')}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={loading || !rejectReason.trim()}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? t('loading') : t('reject')}
              </button>
              <button
                onClick={() => setShowReject(false)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
