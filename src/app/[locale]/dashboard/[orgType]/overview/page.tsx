import { validateDashboardAccess } from '@/lib/dashboard/validate'
import { getOverviewComponent } from '@/components/dashboard/overviews'
import { notFound, redirect } from 'next/navigation'
import {
  getCarDealerStats,
  getInspectionCenterStats,
  getFinanceCompanyStats,
  getInsuranceCompanyStats,
  getCarRentalStats,
  getCarTransportStats,
  getProductShippingStats,
  getSparePartsStats,
  getWholesaleTraderStats,
  getMarketingStats,
} from '@/lib/actions/overview-actions'
import { SLUG_TO_DB_MAP } from '@/config/dashboard'
import type { OrgTypeSlug } from '@/config/dashboard'
import type { OverviewData } from '@/lib/actions/overview-actions'

const STATS_FETCHERS: Record<string, (orgId: string) => Promise<OverviewData>> = {
  car_dealer: getCarDealerStats,
  inspection_center: getInspectionCenterStats,
  finance_company: getFinanceCompanyStats,
  insurance_company: getInsuranceCompanyStats,
  car_rental_company: getCarRentalStats,
  vehicle_transport_company: getCarTransportStats,
  product_shipping_company: getProductShippingStats,
  spare_parts_supplier: getSparePartsStats,
  wholesale_vehicle_trader: getWholesaleTraderStats,
  advertising_marketing_company: getMarketingStats,
}

interface Props {
  params: Promise<{ locale: string; orgType: string }>
}

export default async function OrgOverviewPage({ params }: Props) {
  const { locale, orgType } = await params

  const validation = await validateDashboardAccess(locale, orgType)
  if (!validation.allowed) {
    if (validation.redirect) redirect(validation.redirect)
    notFound()
  }

  const dbOrgType = SLUG_TO_DB_MAP[orgType as OrgTypeSlug]
  const fetcher = STATS_FETCHERS[dbOrgType]
  const data = fetcher ? await fetcher(validation.orgId!) : { stats: [] }

  const OverviewComponent = getOverviewComponent(orgType)
  if (!OverviewComponent) {
    notFound()
  }

  return OverviewComponent({
    locale,
    orgId: validation.orgId!,
    orgName: validation.orgName,
    orgNameAr: validation.orgNameAr,
    orgSlug: orgType,
    data,
  })
}
