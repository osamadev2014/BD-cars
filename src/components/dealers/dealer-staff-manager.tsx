'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'
import { getStaffList, inviteStaff, removeStaff, updateStaffRole } from '@/lib/actions/dealer-actions'

export function DealerStaffManager({ dealer }: { dealer: any }) {
  const t = useTranslations('dealers')
  const { user } = useAuth()
  const [staff, setStaff] = useState<any[]>([])
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('employee')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showInvite, setShowInvite] = useState(false)

  const isOwner = dealer.owner_id === user?.id
  const plan = dealer.subscription?.[0]?.plan
  const staffLimit = plan?.max_staff ?? -1

  const load = async () => {
    const list = await getStaffList()
    setStaff(list)
  }

  useEffect(() => { load() }, [dealer.id])

  const handleInvite = async () => {
    if (!phone) return
    setLoading(true)
    setError('')
    setSuccess('')
    const result = await inviteStaff(phone, role)
    if (result.success) {
      setSuccess(t('invite_success'))
      setPhone('')
      setShowInvite(false)
      load()
    } else {
      setError(t(result.error as any) || result.error || t('invite_error'))
    }
    setLoading(false)
  }

  const handleRemove = async (userId: string) => {
    if (!confirm(t('confirm_remove'))) return
    await removeStaff(userId)
    load()
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateStaffRole(userId, newRole)
    load()
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{t('staff')} ({staff.length}{staffLimit > 0 ? `/${staffLimit}` : ''})</h3>
        {isOwner && (staffLimit === -1 || staff.length < staffLimit) && (
          <button onClick={() => setShowInvite(!showInvite)} className="text-sm text-primary hover:underline">
            {t('invite_staff')}
          </button>
        )}
      </div>

      {showInvite && (
        <div className="border rounded-lg p-3 mb-3 space-y-2 bg-muted/30">
          <div>
            <label className="text-xs text-muted-foreground">{t('staff_phone')}</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+9665xxxxxxxx"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">{t('staff_role')}</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
            >
              <option value="employee">{t('role_employee')}</option>
              <option value="manager">{t('role_manager')}</option>
              <option value="admin">{t('role_admin')}</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          {success && <p className="text-xs text-green-600">{success}</p>}
          <div className="flex gap-2">
            <button onClick={handleInvite} disabled={loading || !phone} className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 disabled:opacity-50">
              {loading ? '...' : t('add')}
            </button>
            <button onClick={() => setShowInvite(false)} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5">
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {staff.map((s: any) => (
          <div key={s.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{s.user?.full_name || t('unknown')}</p>
              <p className="text-xs text-muted-foreground">{s.user?.phone}</p>
            </div>
            {isOwner ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <select
                  value={s.role}
                  onChange={e => handleRoleChange(s.user_id, e.target.value)}
                  className="text-xs border rounded px-1 py-0.5 bg-background"
                >
                  <option value="employee">{t('role_employee')}</option>
                  <option value="manager">{t('role_manager')}</option>
                  <option value="admin">{t('role_admin')}</option>
                </select>
                <button onClick={() => handleRemove(s.user_id)} className="text-xs text-red-600 hover:text-red-800">
                  {t('remove')}
                </button>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">{t(`role_${s.role}` as any) || s.role}</span>
            )}
          </div>
        ))}
        {staff.length === 0 && <p className="text-sm text-muted-foreground">{t('no_staff')}</p>}
      </div>
    </div>
  )
}
