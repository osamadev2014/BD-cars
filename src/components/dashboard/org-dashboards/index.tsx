import { CarDealerDashboard } from './car-dealer-dashboard'
import { InspectionCenterDashboard } from './inspection-center-dashboard'
import { WholesaleTraderDashboard } from './wholesale-trader-dashboard'
import { PartsSupplierDashboard } from './parts-supplier-dashboard'
import { FinanceCompanyDashboard } from './finance-company-dashboard'
import { InsuranceCompanyDashboard } from './insurance-company-dashboard'
import { AdvertisingDashboard } from './advertising-dashboard'
import { CarRentalDashboard } from './car-rental-dashboard'
import { ShippingDashboard } from './shipping-dashboard'
import { VehicleTransportDashboard } from './vehicle-transport-dashboard'
import type { ComponentType } from 'react'

interface DashboardProps {
  orgName: string
  orgNameAr: string
  locale: string
  orgId: string
}

const DASHBOARD_REGISTRY: Record<string, ComponentType<DashboardProps>> = {
  car_dealer: CarDealerDashboard,
  inspection_center: InspectionCenterDashboard,
  wholesale_vehicle_trader: WholesaleTraderDashboard,
  spare_parts_supplier: PartsSupplierDashboard,
  finance_company: FinanceCompanyDashboard,
  insurance_company: InsuranceCompanyDashboard,
  advertising_marketing_company: AdvertisingDashboard,
  car_rental_company: CarRentalDashboard,
  product_shipping_company: ShippingDashboard,
  vehicle_transport_company: VehicleTransportDashboard,
}

export function getOrgDashboard(orgType: string): ComponentType<DashboardProps> | null {
  return DASHBOARD_REGISTRY[orgType] || null
}
