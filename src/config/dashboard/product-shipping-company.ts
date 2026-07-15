import type { DashboardConfig } from './index'

export const productShippingCompanyConfig: DashboardConfig = {
  type: 'product_shipping_company',
  slug: 'product-shipping-company',
  labelEn: 'Product Shipping Company',
  labelAr: 'شركة شحن منتجات',
  icon: 'Package',
  color: 'cyan',
  quickActions: [
    { id: 'new-shipment', labelEn: 'New Shipment', labelAr: 'شحنة جديدة', href: '/product-shipping-company/shipments/new', icon: 'PlusCircle', color: 'cyan' },
    { id: 'assign-driver', labelEn: 'Assign Driver', labelAr: 'تعيين سائق', href: '/product-shipping-company/shipments/assign', icon: 'UserPlus', color: 'green' },
    { id: 'track-shipment', labelEn: 'Track Shipment', labelAr: 'تتبع الشحنة', href: '/product-shipping-company/tracking', icon: 'MapPin', color: 'amber' },
    { id: 'view-reports', labelEn: 'View Reports', labelAr: 'عرض التقارير', href: '/product-shipping-company/reports', icon: 'BarChart3', color: 'purple' },
  ],
  overviewStats: ['pending_shipments', 'active_shipments', 'available_drivers', 'delivered_today'],
  sidebarSections: [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelAr: 'نظرة عامة',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/product-shipping-company/overview', icon: 'LayoutDashboard' },
        { id: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات', href: '/product-shipping-company/notifications', icon: 'Bell' },
        { id: 'reports', labelEn: 'Reports', labelAr: 'التقارير', href: '/product-shipping-company/reports', icon: 'BarChart3' },
      ],
    },
    {
      id: 'orders',
      labelEn: 'Orders',
      labelAr: 'الطلبات',
      items: [
        { id: 'shipment-orders', labelEn: 'Shipment Orders', labelAr: 'أوامر الشحن', href: '/product-shipping-company/shipment-orders', icon: 'ClipboardList' },
        { id: 'active-shipments', labelEn: 'Active Shipments', labelAr: 'الشحنات النشطة', href: '/product-shipping-company/active-shipments', icon: 'Package' },
      ],
    },
    {
      id: 'fleet',
      labelEn: 'Fleet',
      labelAr: 'الأسطول',
      items: [
        { id: 'warehouses', labelEn: 'Warehouses', labelAr: 'المستودعات', href: '/product-shipping-company/warehouses', icon: 'Warehouse' },
        { id: 'drivers', labelEn: 'Drivers', labelAr: 'السائقون', href: '/product-shipping-company/drivers', icon: 'UserRound' },
        { id: 'vehicles', labelEn: 'Vehicles', labelAr: 'المركبات', href: '/product-shipping-company/vehicles', icon: 'Truck' },
        { id: 'routes', labelEn: 'Routes', labelAr: 'المسارات', href: '/product-shipping-company/routes', icon: 'Map' },
      ],
    },
    {
      id: 'operations',
      labelEn: 'Operations',
      labelAr: 'العمليات',
      items: [
        { id: 'pickup-operations', labelEn: 'Pickup Operations', labelAr: 'عمليات الاستلام', href: '/product-shipping-company/pickups', icon: 'PackageOpen' },
        { id: 'delivery-operations', labelEn: 'Delivery Operations', labelAr: 'عمليات التسليم', href: '/product-shipping-company/deliveries', icon: 'PackageCheck' },
        { id: 'tracking', labelEn: 'Tracking', labelAr: 'التتبع', href: '/product-shipping-company/tracking', icon: 'MapPin' },
      ],
    },
    {
      id: 'customers-and-billing',
      labelEn: 'Customers & Billing',
      labelAr: 'العملاء والفواتير',
      items: [
        { id: 'customers', labelEn: 'Customers', labelAr: 'العملاء', href: '/product-shipping-company/customers', icon: 'Users' },
        { id: 'pricing', labelEn: 'Pricing', labelAr: 'التسعير', href: '/product-shipping-company/pricing', icon: 'Tag' },
        { id: 'invoices', labelEn: 'Invoices', labelAr: 'الفواتير', href: '/product-shipping-company/invoices', icon: 'Receipt' },
        { id: 'payments', labelEn: 'Payments', labelAr: 'المدفوعات', href: '/product-shipping-company/payments', icon: 'Wallet' },
      ],
    },
    {
      id: 'management',
      labelEn: 'Management',
      labelAr: 'الإدارة',
      permission: 'manage_organization',
      items: [
        { id: 'employees', labelEn: 'Employees', labelAr: 'الموظفين', href: '/product-shipping-company/employees', icon: 'UsersRound' },
        { id: 'roles', labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات', href: '/product-shipping-company/roles', icon: 'Shield' },
        { id: 'settings', labelEn: 'Organization Settings', labelAr: 'إعدادات المنشأة', href: '/product-shipping-company/settings', icon: 'Settings' },
      ],
    },
    {
      id: 'analytics',
      labelEn: 'Analytics',
      labelAr: 'التحليلات',
      items: [
        { id: 'shipment-reports', labelEn: 'Shipment Reports', labelAr: 'تقارير الشحنات', href: '/product-shipping-company/reports/shipments', icon: 'Package' },
        { id: 'driver-reports', labelEn: 'Driver Reports', labelAr: 'تقارير السائقين', href: '/product-shipping-company/reports/drivers', icon: 'UserCheck' },
        { id: 'financial-reports', labelEn: 'Financial Reports', labelAr: 'التقارير المالية', href: '/product-shipping-company/reports/financial', icon: 'TrendingUp' },
      ],
    },
  ],
}
