import type { ReactElement } from 'react'
import { CarDealerOverview } from './car-dealer-overview'
import { InspectionCenterOverview } from './inspection-center-overview'
import { FinanceCompanyOverview } from './finance-company-overview'
import { InsuranceCompanyOverview } from './insurance-company-overview'
import { CarRentalCompanyOverview } from './car-rental-company-overview'
import { CarTransportCompanyOverview } from './car-transport-company-overview'
import { ProductShippingCompanyOverview } from './product-shipping-company-overview'
import { SparePartsSupplierOverview } from './spare-parts-supplier-overview'
import { WholesaleCarTraderOverview } from './wholesale-car-trader-overview'
import { MarketingCompanyOverview } from './marketing-company-overview'

export interface OverviewData {
  stats: Array<{ label: string; value: string | number }>
}

interface OverviewProps {
  locale: string
  orgId: string
  orgName?: string
  orgNameAr?: string
  orgSlug: string
  data?: OverviewData
}

type OverviewComponent = (props: OverviewProps) => Promise<ReactElement>

export const OVERVIEW_REGISTRY: Record<string, OverviewComponent> = {
  'car-dealer': CarDealerOverview,
  'inspection-center': InspectionCenterOverview,
  'finance-company': FinanceCompanyOverview,
  'insurance-company': InsuranceCompanyOverview,
  'car-rental-company': CarRentalCompanyOverview,
  'car-transport-company': CarTransportCompanyOverview,
  'product-shipping-company': ProductShippingCompanyOverview,
  'spare-parts-supplier': SparePartsSupplierOverview,
  'wholesale-car-trader': WholesaleCarTraderOverview,
  'marketing-company': MarketingCompanyOverview,
}

export function getOverviewComponent(slug: string): OverviewComponent | undefined {
  return OVERVIEW_REGISTRY[slug]
}
