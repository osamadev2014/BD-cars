import type { DashboardConfig } from './index'

export const sparePartsSupplierConfig: DashboardConfig = {
  type: 'spare_parts_supplier',
  slug: 'spare-parts-supplier',
  labelEn: 'Spare Parts Supplier',
  labelAr: 'مورد قطع غيار',
  icon: 'Wrench',
  color: 'purple',
  quickActions: [
    { id: 'add-product', labelEn: 'Add Product', labelAr: 'إضافة منتج', href: '/spare-parts-supplier/products/new', icon: 'PlusCircle', color: 'purple' },
    { id: 'new-order', labelEn: 'New Customer Order', labelAr: 'طلب شراء جديد', href: '/spare-parts-supplier/customer-orders/new', icon: 'ShoppingCart', color: 'green' },
    { id: 'reorder-stock', labelEn: 'Reorder Stock', labelAr: 'إعادة طلب مخزون', href: '/spare-parts-supplier/purchase-orders/new', icon: 'PackagePlus', color: 'amber' },
    { id: 'view-reports', labelEn: 'View Reports', labelAr: 'عرض التقارير', href: '/spare-parts-supplier/reports', icon: 'BarChart3', color: 'blue' },
  ],
  overviewStats: ['total_products', 'low_stock_items', 'pending_orders', 'monthly_revenue'],
  sidebarSections: [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelAr: 'نظرة عامة',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/spare-parts-supplier/overview', icon: 'LayoutDashboard' },
        { id: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات', href: '/spare-parts-supplier/notifications', icon: 'Bell' },
        { id: 'reports', labelEn: 'Reports', labelAr: 'التقارير', href: '/spare-parts-supplier/reports', icon: 'BarChart3' },
      ],
    },
    {
      id: 'products',
      labelEn: 'Products',
      labelAr: 'المنتجات',
      items: [
        { id: 'products', labelEn: 'Products', labelAr: 'المنتجات', href: '/spare-parts-supplier/products', icon: 'Package' },
        { id: 'categories', labelEn: 'Categories', labelAr: 'الفئات', href: '/spare-parts-supplier/categories', icon: 'Tags' },
        { id: 'inventory', labelEn: 'Inventory', labelAr: 'المخزون', href: '/spare-parts-supplier/inventory', icon: 'Warehouse' },
      ],
    },
    {
      id: 'orders',
      labelEn: 'Orders',
      labelAr: 'الطلبات',
      items: [
        { id: 'purchase-orders', labelEn: 'Purchase Orders', labelAr: 'أوامر الشراء', href: '/spare-parts-supplier/purchase-orders', icon: 'ClipboardList' },
        { id: 'customer-orders', labelEn: 'Customer Orders', labelAr: 'طلبات العملاء', href: '/spare-parts-supplier/customer-orders', icon: 'ShoppingCart' },
        { id: 'shipments', labelEn: 'Shipments', labelAr: 'الشحنات', href: '/spare-parts-supplier/shipments', icon: 'Truck' },
      ],
    },
    {
      id: 'supply-chain',
      labelEn: 'Supply Chain',
      labelAr: 'سلسلة التوريد',
      items: [
        { id: 'suppliers', labelEn: 'Suppliers', labelAr: 'الموردون', href: '/spare-parts-supplier/suppliers', icon: 'Building2' },
        { id: 'warehouses', labelEn: 'Warehouses', labelAr: 'المستودعات', href: '/spare-parts-supplier/warehouses', icon: 'Warehouse' },
      ],
    },
    {
      id: 'customers-and-billing',
      labelEn: 'Customers & Billing',
      labelAr: 'العملاء والفواتير',
      items: [
        { id: 'customers', labelEn: 'Customers', labelAr: 'العملاء', href: '/spare-parts-supplier/customers', icon: 'Users' },
        { id: 'pricing', labelEn: 'Pricing', labelAr: 'التسعير', href: '/spare-parts-supplier/pricing', icon: 'Tag' },
        { id: 'invoices', labelEn: 'Invoices', labelAr: 'الفواتير', href: '/spare-parts-supplier/invoices', icon: 'Receipt' },
        { id: 'payments', labelEn: 'Payments', labelAr: 'المدفوعات', href: '/spare-parts-supplier/payments', icon: 'Wallet' },
      ],
    },
    {
      id: 'management',
      labelEn: 'Management',
      labelAr: 'الإدارة',
      permission: 'manage_organization',
      items: [
        { id: 'employees', labelEn: 'Employees', labelAr: 'الموظفين', href: '/spare-parts-supplier/employees', icon: 'UsersRound' },
        { id: 'roles', labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات', href: '/spare-parts-supplier/roles', icon: 'Shield' },
        { id: 'settings', labelEn: 'Organization Settings', labelAr: 'إعدادات المنشأة', href: '/spare-parts-supplier/settings', icon: 'Settings' },
      ],
    },
    {
      id: 'analytics',
      labelEn: 'Analytics',
      labelAr: 'التحليلات',
      items: [
        { id: 'inventory-reports', labelEn: 'Inventory Reports', labelAr: 'تقارير المخزون', href: '/spare-parts-supplier/reports/inventory', icon: 'Package' },
        { id: 'sales-reports', labelEn: 'Sales Reports', labelAr: 'تقارير المبيعات', href: '/spare-parts-supplier/reports/sales', icon: 'TrendingUp' },
        { id: 'financial-reports', labelEn: 'Financial Reports', labelAr: 'التقارير المالية', href: '/spare-parts-supplier/reports/financial', icon: 'BarChart3' },
      ],
    },
  ],
}
