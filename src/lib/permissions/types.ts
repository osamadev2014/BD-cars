export interface PermissionDefinition {
  slug: string
  name: string
  group: string
  description?: string
}

export const PermissionGroups = {
  DASHBOARD: 'dashboard',
  VEHICLES: 'vehicles',
  LISTINGS: 'listings',
  INSPECTIONS: 'inspections',
  DEALERS: 'dealers',
  AUCTIONS: 'auctions',
  SPARE_PARTS: 'spare_parts',
  DELIVERY: 'delivery',
  FINANCE: 'finance',
  PAYMENTS: 'payments',
  WALLET: 'wallet',
  INVOICES: 'invoices',
  COMMISSIONS: 'commissions',
  CUSTOMERS: 'customers',
  SUPPORT: 'support',
  SETTINGS: 'settings',
  ROLES: 'roles',
  AUDIT: 'audit',
  REPORTS: 'reports',
  ADS: 'ads',
  CONTENT: 'content',
  EXPORTS: 'exports',
} as const

export const Permissions: Record<string, PermissionDefinition> = {
  // Dashboard
  view_dashboard: { slug: 'view_dashboard', name: 'View Dashboard', group: PermissionGroups.DASHBOARD },
  view_analytics: { slug: 'view_analytics', name: 'View Analytics', group: PermissionGroups.DASHBOARD },

  // Vehicles
  view_vehicles: { slug: 'view_vehicles', name: 'View Vehicles', group: PermissionGroups.VEHICLES },
  create_vehicles: { slug: 'create_vehicles', name: 'Create Vehicles', group: PermissionGroups.VEHICLES },
  edit_vehicles: { slug: 'edit_vehicles', name: 'Edit Vehicles', group: PermissionGroups.VEHICLES },
  delete_vehicles: { slug: 'delete_vehicles', name: 'Delete Vehicles', group: PermissionGroups.VEHICLES },
  view_vin: { slug: 'view_vin', name: 'View VIN', group: PermissionGroups.VEHICLES },
  view_plate: { slug: 'view_plate', name: 'View Plate Number', group: PermissionGroups.VEHICLES },

  // Listings
  approve_listings: { slug: 'approve_listings', name: 'Approve Listings', group: PermissionGroups.LISTINGS },
  reject_listings: { slug: 'reject_listings', name: 'Reject Listings', group: PermissionGroups.LISTINGS },
  edit_listings: { slug: 'edit_listings', name: 'Edit Listings', group: PermissionGroups.LISTINGS },
  suspend_listings: { slug: 'suspend_listings', name: 'Suspend Listings', group: PermissionGroups.LISTINGS },
  feature_listings: { slug: 'feature_listings', name: 'Feature Listings', group: PermissionGroups.LISTINGS },
  bump_listings: { slug: 'bump_listings', name: 'Bump Listings', group: PermissionGroups.LISTINGS },

  // Settings
  view_settings: { slug: 'view_settings', name: 'View Settings', group: PermissionGroups.SETTINGS },
  edit_settings: { slug: 'edit_settings', name: 'Edit Settings', group: PermissionGroups.SETTINGS },
  edit_dangerous_settings: { slug: 'edit_dangerous_settings', name: 'Edit Dangerous Settings', group: PermissionGroups.SETTINGS },

  // Roles
  view_roles: { slug: 'view_roles', name: 'View Roles', group: PermissionGroups.ROLES },
  create_roles: { slug: 'create_roles', name: 'Create Roles', group: PermissionGroups.ROLES },
  edit_roles: { slug: 'edit_roles', name: 'Edit Roles', group: PermissionGroups.ROLES },
  delete_roles: { slug: 'delete_roles', name: 'Delete Roles', group: PermissionGroups.ROLES },
  assign_roles: { slug: 'assign_roles', name: 'Assign Roles', group: PermissionGroups.ROLES },

  // Audit
  view_audit: { slug: 'view_audit', name: 'View Audit Logs', group: PermissionGroups.AUDIT },
  export_audit: { slug: 'export_audit', name: 'Export Audit Logs', group: PermissionGroups.AUDIT },

  // Reports
  view_reports: { slug: 'view_reports', name: 'View Reports', group: PermissionGroups.REPORTS },
  export_reports: { slug: 'export_reports', name: 'Export Reports', group: PermissionGroups.REPORTS },

  // Customers
  view_customers: { slug: 'view_customers', name: 'View Customers', group: PermissionGroups.CUSTOMERS },
  edit_customers: { slug: 'edit_customers', name: 'Edit Customers', group: PermissionGroups.CUSTOMERS },
  suspend_customers: { slug: 'suspend_customers', name: 'Suspend Customers', group: PermissionGroups.CUSTOMERS },

  // Dealers
  approve_dealers: { slug: 'approve_dealers', name: 'Approve Dealers', group: PermissionGroups.DEALERS },
  suspend_dealers: { slug: 'suspend_dealers', name: 'Suspend Dealers', group: PermissionGroups.DEALERS },

  // Support
  view_tickets: { slug: 'view_tickets', name: 'View Support Tickets', group: PermissionGroups.SUPPORT },
  manage_tickets: { slug: 'manage_tickets', name: 'Manage Support Tickets', group: PermissionGroups.SUPPORT },

  // Finance
  view_finance: { slug: 'view_finance', name: 'View Finance Data', group: PermissionGroups.FINANCE },
  view_commissions: { slug: 'view_commissions', name: 'View Commissions', group: PermissionGroups.COMMISSIONS },
  edit_commissions: { slug: 'edit_commissions', name: 'Edit Commission Rules', group: PermissionGroups.COMMISSIONS },
}
