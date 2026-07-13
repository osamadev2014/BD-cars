'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { getMyOrganizations, getOrganizationMembers, inviteMember, updateMemberRole, removeMember } from '@/lib/actions/org-actions'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users, UserPlus, UserMinus, Shield, Mail, Phone, MoreHorizontal } from 'lucide-react'

const ROLE_OPTIONS = [
  { value: 'owner', label_en: 'Owner', label_ar: 'مالك' },
  { value: 'admin', label_en: 'Admin', label_ar: 'مدير' },
  { value: 'member', label_en: 'Member', label_ar: 'عضو' },
  { value: 'employee', label_en: 'Employee', label_ar: 'موظف' },
  { value: 'technician', label_en: 'Technician', label_ar: 'فني' },
  { value: 'sales', label_en: 'Sales', label_ar: 'مبيعات' },
]

export default function TeamPage() {
  const t = useTranslations('common')
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const router = useRouter()
  const { user } = useAuth()

  const [orgs, setOrgs] = useState<any[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Invite form
  const [showInvite, setShowInvite] = useState(false)
  const [invitePhone, setInvitePhone] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviteError, setInviteError] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)

  // Role change
  const [changingRole, setChangingRole] = useState<string | null>(null)

  useEffect(() => {
    getMyOrganizations().then((data) => {
      setOrgs(data)
      const stored = localStorage.getItem('selected_org_id')
      if (stored && data.some((o: any) => o.id === stored)) {
        setSelectedOrgId(stored)
      } else if (data.length > 0) {
        setSelectedOrgId(data[0].id)
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (selectedOrgId) {
      getOrganizationMembers(selectedOrgId).then(setMembers)
    }
  }, [selectedOrgId])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteError('')
    if (!selectedOrgId || !invitePhone.trim()) return

    setInviteLoading(true)
    try {
      await inviteMember(selectedOrgId, invitePhone.trim(), inviteRole)
      setInvitePhone('')
      setShowInvite(false)
      const updated = await getOrganizationMembers(selectedOrgId)
      setMembers(updated)
    } catch (err: any) {
      setInviteError(err.message)
    } finally {
      setInviteLoading(false)
    }
  }

  const handleRoleChange = async (memberId: string, newRole: string) => {
    setChangingRole(memberId)
    try {
      await updateMemberRole(memberId, newRole)
      const updated = await getOrganizationMembers(selectedOrgId!)
      setMembers(updated)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setChangingRole(null)
    }
  }

  const handleRemove = async (memberId: string) => {
    if (!isRtl && !confirm('Remove this member?')) return
    if (isRtl && !confirm('هل تريد إزالة هذا العضو؟')) return
    try {
      await removeMember(memberId)
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const currentUserRole = selectedOrgId
    ? orgs.find((o: any) => o.id === selectedOrgId)?.my_role
    : null
  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (orgs.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        {isRtl ? 'ليس لديك منشآت بعد' : 'No organizations yet'}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{isRtl ? 'فريق العمل' : 'Team'}</h1>
        </div>
        {canManage && (
          <Button variant="primary" size="sm" iconLeft={<UserPlus className="h-4 w-4" />} onClick={() => setShowInvite(true)}>
            {isRtl ? 'دعوة عضو' : 'Invite Member'}
          </Button>
        )}
      </div>

      {/* Org selector */}
      {orgs.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {orgs.map((org: any) => (
            <button
              key={org.id}
              onClick={() => setSelectedOrgId(org.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedOrgId === org.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {org.name_ar || org.name}
            </button>
          ))}
        </div>
      )}

      {/* Members list */}
      <div className="space-y-2">
        {members.map((member: any) => {
          const userInfo = member.user
          const isOwner = member.role === 'owner'
          return (
            <Card key={member.id} variant="outline">
              <CardContent className="flex items-center gap-4 p-4" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {(userInfo?.full_name || '?')[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{userInfo?.full_name || (isRtl ? 'مستخدم' : 'User')}</p>
                  <p className="text-xs text-muted-foreground">{userInfo?.phone || ''}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isOwner ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                      <Shield className="h-3 w-3" />
                      {isRtl ? 'مالك' : 'Owner'}
                    </span>
                  ) : canManage && !isOwner ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      disabled={changingRole === member.id}
                      className="text-xs rounded-md border border-border bg-background px-2 py-1"
                    >
                      {ROLE_OPTIONS.filter((r) => r.value !== 'owner').map((r) => (
                        <option key={r.value} value={r.value}>
                          {isRtl ? r.label_ar : r.label_en}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full">
                      {ROLE_OPTIONS.find((r) => r.value === member.role)
                        ? (isRtl
                          ? ROLE_OPTIONS.find((r) => r.value === member.role)!.label_ar
                          : ROLE_OPTIONS.find((r) => r.value === member.role)!.label_en)
                        : member.role}
                    </span>
                  )}
                  {canManage && !isOwner && (
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                      title={isRtl ? 'إزالة' : 'Remove'}
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
        {members.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {isRtl ? 'لا يوجد أعضاء' : 'No members found'}
          </div>
        )}
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowInvite(false); setInviteError('') }}>
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">{isRtl ? 'دعوة عضو جديد' : 'Invite New Member'}</h3>
            </div>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{isRtl ? 'رقم الجوال' : 'Phone Number'}</label>
                <input
                  type="tel"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="+9665xxxxxxxx"
                  className="block w-full h-11 rounded-xl border border-border bg-background px-4 text-sm"
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{isRtl ? 'الدور' : 'Role'}</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="block w-full h-11 rounded-xl border border-border bg-background px-4 text-sm"
                >
                  {ROLE_OPTIONS.filter((r) => r.value !== 'owner').map((r) => (
                    <option key={r.value} value={r.value}>
                      {isRtl ? r.label_ar : r.label_en}
                    </option>
                  ))}
                </select>
              </div>
              {inviteError && (
                <p className="text-sm text-red-600">{inviteError}</p>
              )}
              <div className="flex gap-2">
                <Button type="submit" loading={inviteLoading}>
                  {isRtl ? 'دعوة' : 'Invite'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowInvite(false); setInviteError('') }}>
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
