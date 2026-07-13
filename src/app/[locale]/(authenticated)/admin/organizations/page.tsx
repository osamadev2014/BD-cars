import { getTranslations } from 'next-intl/server'
import { requirePermission } from '@/server/guards'
import { getAllOrganizations } from '@/lib/actions/org-actions'
import { OrganizationsClient } from './organizations-client'

export default async function AdminOrganizationsPage() {
  const t = await getTranslations('admin')
  const guard = await requirePermission('approve_dealers')
  if (!guard.allowed) {
    return <div className="text-center py-12 text-muted-foreground">{t('access_denied')}</div>
  }

  const orgs = await getAllOrganizations()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('organizations')}</h1>

      <div className="space-y-3">
        {orgs.map((org: any) => (
          <OrganizationsClient key={org.id} org={org} />
        ))}
        {orgs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">{t('no_organizations')}</div>
        )}
      </div>
    </div>
  )
}
