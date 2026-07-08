export type RoleSlug =
  | 'system_owner'
  | 'super_admin'
  | 'admin'
  | 'operations_manager'
  | 'sales_manager'
  | 'sales_agent'
  | 'inspection_manager'
  | 'inspection_center_admin'
  | 'inspection_technician'
  | 'dealer_owner'
  | 'dealer_employee'
  | 'wholesale_dealer'
  | 'finance_partner_admin'
  | 'insurance_partner_admin'
  | 'advertiser_partner_admin'
  | 'spare_parts_supplier_admin'
  | 'spare_parts_supplier_employee'
  | 'delivery_partner_admin'
  | 'support_agent'
  | 'accountant'
  | 'content_manager'
  | 'customer'

export type PermissionSlug = string

export type Locale = 'ar' | 'en'

export interface UserProfile {
  id: string
  phone: string
  full_name: string | null
  avatar_url: string | null
  locale: Locale
  is_active: boolean
  created_at: string
  updated_at: string
  last_sign_in_at: string | null
  roles?: string[]
}

export interface AuthSession {
  user: UserProfile | null
  session: unknown | null
  isLoading: boolean
}

export type AuditAction =
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'status_change'
  | 'settings_change'
  | 'permission_change'
  | 'export'
  | 'view_sensitive'

export type EntityType =
  | 'profile'
  | 'vehicle'
  | 'listing'
  | 'inspection'
  | 'report'
  | 'dealer'
  | 'auction'
  | 'bid'
  | 'order'
  | 'payment'
  | 'wallet'
  | 'invoice'
  | 'commission'
  | 'subscription'
  | 'spare_part'
  | 'delivery'
  | 'support_ticket'
  | 'role'
  | 'permission'
  | 'setting'
  | 'ad_campaign'
  | 'finance_request'
  | 'insurance_request'

export type SettingCategory =
  | 'general'
  | 'branding'
  | 'theme'
  | 'language'
  | 'features'
  | 'listing'
  | 'inspection'
  | 'report_visibility'
  | 'dealer'
  | 'wholesale'
  | 'auction'
  | 'spare_parts'
  | 'delivery'
  | 'payment'
  | 'wallet'
  | 'commission'
  | 'tax'
  | 'finance'
  | 'insurance'
  | 'advertising'
  | 'notification'
  | 'city'
  | 'visibility'
  | 'demo_data'
  | 'roles'
