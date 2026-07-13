import { getTranslations } from 'next-intl/server'
import { getMyOrganizations } from '@/lib/actions/org-actions'
import Link from 'next/link'
import { PendingStatusCard } from './pending-card'

export default async function BusinessPendingPage() {
  const t = await getTranslations('common')
  const orgs = await getMyOrganizations()

  const pendingOrgs = orgs.filter((o: any) => o.status === 'pending_approval')
  const activeOrgs = orgs.filter((o: any) => o.status === 'active')
  const rejectedOrgs = orgs.filter((o: any) => o.status === 'rejected')

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto space-y-6">
        {pendingOrgs.length > 0 && (
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">{t('pending_approval')}</h1>
            <p className="text-muted-foreground mb-8">
              {t('org_pending_message')}
            </p>
          </div>
        )}

        {pendingOrgs.map((org: any) => (
          <PendingStatusCard key={org.id} org={org} status="pending" />
        ))}

        {activeOrgs.map((org: any) => (
          <PendingStatusCard key={org.id} org={org} status="active" />
        ))}

        {rejectedOrgs.map((org: any) => (
          <PendingStatusCard key={org.id} org={org} status="rejected" />
        ))}

        {orgs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('no_organizations')}</p>
            <Link
              href="/business/register"
              className="mt-4 inline-block text-primary hover:underline text-sm"
            >
              {t('register_organization')}
            </Link>
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('back_to_dashboard')}
          </Link>
        </div>
      </div>
    </div>
  )
}
