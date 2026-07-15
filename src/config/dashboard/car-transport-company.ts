import type { DashboardConfig } from './index'

export const carTransportCompanyConfig: DashboardConfig = {
  type: 'vehicle_transport_company',
  slug: 'car-transport-company',
  labelEn: 'Car Transport Company',
  labelAr: 'شركة نقل سيارات',
  icon: 'Truck',
  color: 'amber',
  quickActions: [
    { id: 'new-transport-request', labelEn: 'New Transport Request', labelAr: 'طلب نقل جديد', href: '/car-transport-company/transport-requests/new', icon: 'PlusCircle', color: 'amber' },
    { id: 'assign-driver', labelEn: 'Assign Driver', labelAr: 'تعيين سائق', href: '/car-transport-company/shipments/assign', icon: 'UserPlus', color: 'green' },
    { id: 'track-shipment', labelEn: 'Track Shipment', labelAr: 'تتبع الشحنة', href: '/car-transport-company/live-tracking', icon: 'MapPin', color: 'blue' },
    { id: 'view-reports', labelEn: 'View Reports', labelAr: 'عرض التقارير', href: '/car-transport-company/reports', icon: 'BarChart3', color: 'purple' },
  ],
  overviewStats: ['pending_transports', 'active_shipments', 'available_carriers', 'completed_deliveries'],
  sidebarSections: [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelAr: 'نظرة عامة',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/car-transport-company/overview', icon: 'LayoutDashboard' },
        { id: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات', href: '/car-transport-company/notifications', icon: 'Bell' },
        { id: 'reports', labelEn: 'Reports', labelAr: 'التقارير', href: '/car-transport-company/reports', icon: 'BarChart3' },
      ],
    },
    {
      id: 'shipments',
      labelEn: 'Shipments',
      labelAr: 'الشحنات',
      items: [
        { id: 'transport-requests', labelEn: 'Transport Requests', labelAr: 'طلبات النقل', href: '/car-transport-company/transport-requests', icon: 'ClipboardList' },
        { id: 'active-shipments', labelEn: 'Active Shipments', labelAr: 'الشحنات النشطة', href: '/car-transport-company/active-shipments', icon: 'Truck' },
      ],
    },
    {
      id: 'fleet',
      labelEn: 'Fleet',
      labelAr: 'الأسطول',
      items: [
        { id: 'vehicle-carriers', labelEn: 'Vehicle Carriers', labelAr: 'ناقلات المركبات', href: '/car-transport-company/vehicle-carriers', icon: 'Container' },
        { id: 'drivers', labelEn: 'Drivers', labelAr: 'السائقون', href: '/car-transport-company/drivers', icon: 'UserRound' },
        { id: 'routes', labelEn: 'Routes', labelAr: 'المسارات', href: '/car-transport-company/routes', icon: 'Map' },
      ],
    },
    {
      id: 'operations',
      labelEn: 'Operations',
      labelAr: 'العمليات',
      items: [
        { id: 'pickup-operations', labelEn: 'Pickup Operations', labelAr: 'عمليات الاستلام', href: '/car-transport-company/pickups', icon: 'PackageOpen' },
        { id: 'delivery-operations', labelEn: 'Delivery Operations', labelAr: 'عمليات التسليم', href: '/car-transport-company/deliveries', icon: 'PackageCheck' },
        { id: 'live-tracking', labelEn: 'Live Tracking', labelAr: 'التتبع المباشر', href: '/car-transport-company/live-tracking', icon: 'MapPin' },
      ],
    },
    {
      id: 'customers-and-billing',
      labelEn: 'Customers & Billing',
      labelAr: 'العملاء والفواتير',
      items: [
        { id: 'customers', labelEn: 'Customers', labelAr: 'العملاء', href: '/car-transport-company/customers', icon: 'Users' },
        { id: 'pricing', labelEn: 'Pricing', labelAr: 'التسعير', href: '/car-transport-company/pricing', icon: 'Tag' },
        { id: 'invoices', labelEn: 'Invoices', labelAr: 'الفواتير', href: '/car-transport-company/invoices', icon: 'Receipt' },
        { id: 'payments', labelEn: 'Payments', labelAr: 'المدفوعات', href: '/car-transport-company/payments', icon: 'Wallet' },
      ],
    },
    {
      id: 'management',
      labelEn: 'Management',
      labelAr: 'الإدارة',
      permission: 'manage_organization',
      items: [
        { id: 'branches', labelEn: 'Branches', labelAr: 'الفروع', href: '/car-transport-company/branches', icon: 'Store' },
        { id: 'employees', labelEn: 'Employees', labelAr: 'الموظفين', href: '/car-transport-company/employees', icon: 'UsersRound' },
        { id: 'roles', labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات', href: '/car-transport-company/roles', icon: 'Shield' },
        { id: 'settings', labelEn: 'Organization Settings', labelAr: 'إعدادات المنشأة', href: '/car-transport-company/settings', icon: 'Settings' },
      ],
    },
    {
      id: 'analytics',
      labelEn: 'Analytics',
      labelAr: 'التحليلات',
      items: [
        { id: 'shipment-reports', labelEn: 'Shipment Reports', labelAr: 'تقارير الشحنات', href: '/car-transport-company/reports/shipments', icon: 'Truck' },
        { id: 'driver-reports', labelEn: 'Driver Reports', labelAr: 'تقارير السائقين', href: '/car-transport-company/reports/drivers', icon: 'UserCheck' },
        { id: 'financial-reports', labelEn: 'Financial Reports', labelAr: 'التقارير المالية', href: '/car-transport-company/reports/financial', icon: 'TrendingUp' },
      ],
    },
  ],
}
