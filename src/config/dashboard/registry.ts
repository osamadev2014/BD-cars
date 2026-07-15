import type { DashboardConfig, OrgTypeSlug, DbOrgType } from './index'
import { ORG_TYPE_SLUG_MAP } from './index'
import { carDealerConfig } from './car-dealer'
import { inspectionCenterConfig } from './inspection-center'
import { financeCompanyConfig } from './finance-company'
import { insuranceCompanyConfig } from './insurance-company'
import { carRentalCompanyConfig } from './car-rental-company'
import { carTransportCompanyConfig } from './car-transport-company'
import { productShippingCompanyConfig } from './product-shipping-company'
import { sparePartsSupplierConfig } from './spare-parts-supplier'
import { wholesaleCarTraderConfig } from './wholesale-car-trader'
import { marketingCompanyConfig } from './marketing-company'

export const DASHBOARD_CONFIGS: Record<OrgTypeSlug, DashboardConfig> = {
  'car-dealer': carDealerConfig,
  'inspection-center': inspectionCenterConfig,
  'finance-company': financeCompanyConfig,
  'insurance-company': insuranceCompanyConfig,
  'car-rental-company': carRentalCompanyConfig,
  'car-transport-company': carTransportCompanyConfig,
  'product-shipping-company': productShippingCompanyConfig,
  'spare-parts-supplier': sparePartsSupplierConfig,
  'wholesale-car-trader': wholesaleCarTraderConfig,
  'marketing-company': marketingCompanyConfig,
}

export function getDashboardConfig(slug: OrgTypeSlug): DashboardConfig | undefined {
  return DASHBOARD_CONFIGS[slug]
}

export function getDashboardConfigByDbType(dbType: DbOrgType): DashboardConfig | undefined {
  const slug = ORG_TYPE_SLUG_MAP[dbType]
  return slug ? DASHBOARD_CONFIGS[slug] : undefined
}

export function getSidebarItems(slug: OrgTypeSlug) {
  const config = DASHBOARD_CONFIGS[slug]
  if (!config) return []
  return config.sidebarSections
}
