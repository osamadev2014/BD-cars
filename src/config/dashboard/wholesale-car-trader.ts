import type { DashboardConfig } from './index'

export const wholesaleCarTraderConfig: DashboardConfig = {
  type: 'wholesale_vehicle_trader',
  slug: 'wholesale-car-trader',
  labelEn: 'Wholesale Car Trader',
  labelAr: 'تاجر سيارات بالجملة',
  icon: 'Warehouse',
  color: 'pink',
  quickActions: [
    { id: 'add-inventory', labelEn: 'Add to Inventory', labelAr: 'إضافة للمخزون', href: '/wholesale-car-trader/inventory/new', icon: 'PlusCircle', color: 'pink' },
    { id: 'new-quotation', labelEn: 'New Quotation', labelAr: 'عرض سعر جديد', href: '/wholesale-car-trader/quotations/new', icon: 'FileSpreadsheet', color: 'green' },
    { id: 'add-dealer', labelEn: 'Add Dealer Customer', labelAr: 'إضافة تاجر', href: '/wholesale-car-trader/dealer-customers/new', icon: 'UserPlus', color: 'amber' },
    { id: 'view-reports', labelEn: 'View Reports', labelAr: 'عرض التقارير', href: '/wholesale-car-trader/reports', icon: 'BarChart3', color: 'purple' },
  ],
  overviewStats: ['wholesale_inventory', 'active_negotiations', 'pending_transactions', 'monthly_volume'],
  sidebarSections: [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelAr: 'نظرة عامة',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/wholesale-car-trader/overview', icon: 'LayoutDashboard' },
        { id: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات', href: '/wholesale-car-trader/notifications', icon: 'Bell' },
        { id: 'reports', labelEn: 'Reports', labelAr: 'التقارير', href: '/wholesale-car-trader/reports', icon: 'BarChart3' },
      ],
    },
    {
      id: 'inventory-and-sales',
      labelEn: 'Inventory & Sales',
      labelAr: 'المخزون والمبيعات',
      items: [
        { id: 'wholesale-inventory', labelEn: 'Wholesale Inventory', labelAr: 'مخزون الجملة', href: '/wholesale-car-trader/inventory', icon: 'Warehouse' },
        { id: 'purchase-requests', labelEn: 'Purchase Requests', labelAr: 'طلبات الشراء', href: '/wholesale-car-trader/purchase-requests', icon: 'ClipboardList' },
        { id: 'dealer-customers', labelEn: 'Dealer Customers', labelAr: 'التجار العملاء', href: '/wholesale-car-trader/dealer-customers', icon: 'Users' },
        { id: 'quotations', labelEn: 'Quotations', labelAr: 'عروض الأسعار', href: '/wholesale-car-trader/quotations', icon: 'FileSpreadsheet' },
        { id: 'negotiations', labelEn: 'Negotiations', labelAr: 'المفاوضات', href: '/wholesale-car-trader/negotiations', icon: 'Handshake' },
        { id: 'transactions', labelEn: 'Transactions', labelAr: 'المعاملات', href: '/wholesale-car-trader/transactions', icon: 'ArrowLeftRight' },
      ],
    },
    {
      id: 'operations',
      labelEn: 'Operations',
      labelAr: 'العمليات',
      items: [
        { id: 'vehicle-inspections', labelEn: 'Vehicle Inspections', labelAr: 'فحص المركبات', href: '/wholesale-car-trader/inspections', icon: 'SearchCheck' },
        { id: 'transportation', labelEn: 'Transportation', labelAr: 'النقل', href: '/wholesale-car-trader/transportation', icon: 'Truck' },
        { id: 'deliveries', labelEn: 'Deliveries', labelAr: 'التسليم', href: '/wholesale-car-trader/deliveries', icon: 'PackageCheck' },
      ],
    },
    {
      id: 'billing',
      labelEn: 'Billing',
      labelAr: 'الفواتير',
      items: [
        { id: 'invoices', labelEn: 'Invoices', labelAr: 'الفواتير', href: '/wholesale-car-trader/invoices', icon: 'Receipt' },
        { id: 'payments', labelEn: 'Payments', labelAr: 'المدفوعات', href: '/wholesale-car-trader/payments', icon: 'Wallet' },
      ],
    },
    {
      id: 'management',
      labelEn: 'Management',
      labelAr: 'الإدارة',
      permission: 'manage_organization',
      items: [
        { id: 'employees', labelEn: 'Employees', labelAr: 'الموظفين', href: '/wholesale-car-trader/employees', icon: 'UsersRound' },
        { id: 'roles', labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات', href: '/wholesale-car-trader/roles', icon: 'Shield' },
        { id: 'settings', labelEn: 'Organization Settings', labelAr: 'إعدادات المنشأة', href: '/wholesale-car-trader/settings', icon: 'Settings' },
      ],
    },
    {
      id: 'analytics',
      labelEn: 'Analytics',
      labelAr: 'التحليلات',
      items: [
        { id: 'inventory-reports', labelEn: 'Inventory Reports', labelAr: 'تقارير المخزون', href: '/wholesale-car-trader/reports/inventory', icon: 'Package' },
        { id: 'sales-reports', labelEn: 'Sales Reports', labelAr: 'تقارير المبيعات', href: '/wholesale-car-trader/reports/sales', icon: 'TrendingUp' },
        { id: 'financial-reports', labelEn: 'Financial Reports', labelAr: 'التقارير المالية', href: '/wholesale-car-trader/reports/financial', icon: 'BarChart3' },
      ],
    },
  ],
}
