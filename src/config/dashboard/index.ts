export type OrgTypeSlug =
  | 'car-dealer'
  | 'inspection-center'
  | 'finance-company'
  | 'insurance-company'
  | 'car-rental-company'
  | 'car-transport-company'
  | 'product-shipping-company'
  | 'spare-parts-supplier'
  | 'wholesale-car-trader'
  | 'marketing-company'

export type DbOrgType =
  | 'car_dealer'
  | 'inspection_center'
  | 'wholesale_vehicle_trader'
  | 'spare_parts_supplier'
  | 'finance_company'
  | 'insurance_company'
  | 'advertising_marketing_company'
  | 'car_rental_company'
  | 'product_shipping_company'
  | 'vehicle_transport_company'

export interface SidebarSection {
  id: string
  labelEn: string
  labelAr: string
  items: SidebarItem[]
  permission?: string
}

export interface SidebarItem {
  id: string
  labelEn: string
  labelAr: string
  href: string
  icon: string
  permission?: string
  badge?: 'beta' | 'soon'
}

export interface DashboardConfig {
  type: DbOrgType
  slug: OrgTypeSlug
  labelEn: string
  labelAr: string
  icon: string
  color: string
  sidebarSections: SidebarSection[]
  overviewStats: string[]
  quickActions: QuickAction[]
}

export interface QuickAction {
  id: string
  labelEn: string
  labelAr: string
  href: string
  icon: string
  color: string
}

export const ORG_TYPE_SLUG_MAP: Record<DbOrgType, OrgTypeSlug> = {
  car_dealer: 'car-dealer',
  inspection_center: 'inspection-center',
  finance_company: 'finance-company',
  insurance_company: 'insurance-company',
  car_rental_company: 'car-rental-company',
  vehicle_transport_company: 'car-transport-company',
  product_shipping_company: 'product-shipping-company',
  spare_parts_supplier: 'spare-parts-supplier',
  wholesale_vehicle_trader: 'wholesale-car-trader',
  advertising_marketing_company: 'marketing-company',
}

export const SLUG_TO_DB_MAP: Record<OrgTypeSlug, DbOrgType> = {
  'car-dealer': 'car_dealer',
  'inspection-center': 'inspection_center',
  'finance-company': 'finance_company',
  'insurance-company': 'insurance_company',
  'car-rental-company': 'car_rental_company',
  'car-transport-company': 'vehicle_transport_company',
  'product-shipping-company': 'product_shipping_company',
  'spare-parts-supplier': 'spare_parts_supplier',
  'wholesale-car-trader': 'wholesale_vehicle_trader',
  'marketing-company': 'advertising_marketing_company',
}

export const VALID_ORG_SLUGS: OrgTypeSlug[] = Object.keys(SLUG_TO_DB_MAP) as OrgTypeSlug[]
