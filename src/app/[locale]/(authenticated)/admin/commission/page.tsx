import { getTranslations } from 'next-intl/server'
import { getCommissionRules } from '@/lib/actions/finance-admin-actions'
import { CommissionClient } from './commission-client'

export default async function CommissionPage() {
  const t = await getTranslations('admin')
  const rules = await getCommissionRules()
  return <CommissionClient rules={rules} />
}
