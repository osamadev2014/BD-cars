import { getTranslations } from 'next-intl/server'
import { getAuditLog } from '@/lib/actions/crm-actions'
import { AuditLogClient } from './audit-log-client'

export default async function AuditLogPage() {
  const t = await getTranslations('crm')
  const entries = await getAuditLog()
  return <AuditLogClient entries={entries} />
}
