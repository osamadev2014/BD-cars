import type { DashboardConfig } from './index'

export const carDealerConfig: DashboardConfig = {
  type: 'car_dealer',
  slug: 'car-dealer',
  labelEn: 'Car Dealer',
  labelAr: 'معرض سيارات',
  icon: 'Building2',
  color: 'blue',
  quickActions: [
    { id: 'add-car', labelEn: 'Add Vehicle', labelAr: 'إضافة سيارة', href: '/car-dealer/inventory/new', icon: 'PlusCircle', color: 'blue' },
    { id: 'add-customer', labelEn: 'Add Customer', labelAr: 'إضافة عميل', href: '/car-dealer/customers/new', icon: 'UserPlus', color: 'green' },
    { id: 'create-invoice', labelEn: 'Create Invoice', labelAr: 'إنشاء فاتورة', href: '/car-dealer/sales/invoice/new', icon: 'FileText', color: 'amber' },
    { id: 'view-reports', labelEn: 'View Reports', labelAr: 'عرض التقارير', href: '/car-dealer/reports', icon: 'BarChart3', color: 'purple' },
  ],
  overviewStats: ['active_listings', 'available_inventory', 'reserved_cars', 'sold_this_month'],
  sidebarSections: [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelAr: 'نظرة عامة',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/car-dealer/overview', icon: 'LayoutDashboard' },
        { id: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات', href: '/car-dealer/notifications', icon: 'Bell' },
        { id: 'reports', labelEn: 'Reports', labelAr: 'التقارير', href: '/car-dealer/reports', icon: 'BarChart3' },
      ],
    },
    {
      id: 'sales',
      labelEn: 'Sales',
      labelAr: 'المبيعات',
      items: [
        { id: 'inventory', labelEn: 'Vehicles', labelAr: 'السيارات', href: '/car-dealer/inventory', icon: 'Car' },
        { id: 'customers', labelEn: 'Customers', labelAr: 'العملاء', href: '/car-dealer/customers', icon: 'Users' },
        { id: 'sales', labelEn: 'Sales', labelAr: 'المبيعات', href: '/car-dealer/sales', icon: 'ShoppingCart' },
        { id: 'purchase-requests', labelEn: 'Purchase Requests', labelAr: 'طلبات الشراء', href: '/car-dealer/purchase-requests', icon: 'ClipboardList' },
        { id: 'quotations', labelEn: 'Quotations', labelAr: 'عروض الأسعار', href: '/car-dealer/quotations', icon: 'FileSpreadsheet' },
        { id: 'reservations', labelEn: 'Reservations', labelAr: 'الحجوزات', href: '/car-dealer/reservations', icon: 'CalendarCheck' },
        { id: 'invoices', labelEn: 'Invoices', labelAr: 'الفواتير', href: '/car-dealer/invoices', icon: 'Receipt' },
        { id: 'payments', labelEn: 'Payments', labelAr: 'المدفوعات', href: '/car-dealer/payments', icon: 'Wallet' },
      ],
    },
    {
      id: 'operations',
      labelEn: 'Operations',
      labelAr: 'العمليات',
      items: [
          { id: 'vehicle-inspections', labelEn: 'Vehicle Inspections', labelAr: 'فحص المركبات', href: '/car-dealer/inspections', icon: 'SearchCheck' },
          { id: 'vehicle-delivery', labelEn: 'Vehicle Delivery', labelAr: 'تسليم المركبات', href: '/car-dealer/deliveries', icon: 'Truck' },
          { id: 'transport-requests', labelEn: 'Transport Requests', labelAr: 'طلبات النقل', href: '/car-dealer/transport-requests', icon: 'Ship' },
      ],
    },
    {
      id: 'management',
      labelEn: 'Management',
      labelAr: 'الإدارة',
      permission: 'manage_organization',
      items: [
        { id: 'branches', labelEn: 'Branches', labelAr: 'الفروع', href: '/car-dealer/branches', icon: 'Store' },
        { id: 'employees', labelEn: 'Employees', labelAr: 'الموظفين', href: '/car-dealer/employees', icon: 'UsersRound' },
        { id: 'roles', labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات', href: '/car-dealer/roles', icon: 'Shield' },
        { id: 'settings', labelEn: 'Organization Settings', labelAr: 'إعدادات المنشأة', href: '/car-dealer/settings', icon: 'Settings' },
      ],
    },
    {
      id: 'analytics',
      labelEn: 'Analytics',
      labelAr: 'التحليلات',
      items: [
        { id: 'sales-reports', labelEn: 'Sales Reports', labelAr: 'تقارير المبيعات', href: '/car-dealer/reports/sales', icon: 'TrendingUp' },
        { id: 'inventory-reports', labelEn: 'Inventory Reports', labelAr: 'تقارير المخزون', href: '/car-dealer/reports/inventory', icon: 'Package' },
        { id: 'customer-reports', labelEn: 'Customer Reports', labelAr: 'تقارير العملاء', href: '/car-dealer/reports/customers', icon: 'UserCheck' },
      ],
    },
  ],
}
