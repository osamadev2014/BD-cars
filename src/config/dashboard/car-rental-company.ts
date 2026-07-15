import type { DashboardConfig } from './index'

export const carRentalCompanyConfig: DashboardConfig = {
  type: 'car_rental_company',
  slug: 'car-rental-company',
  labelEn: 'Car Rental Company',
  labelAr: 'شركة تأجير سيارات',
  icon: 'CarTaxiFront',
  color: 'orange',
  quickActions: [
    { id: 'new-reservation', labelEn: 'New Reservation', labelAr: 'حجز جديد', href: '/car-rental-company/reservations/new', icon: 'PlusCircle', color: 'orange' },
    { id: 'add-vehicle', labelEn: 'Add Vehicle', labelAr: 'إضافة مركبة', href: '/car-rental-company/vehicles/new', icon: 'CarPlus', color: 'green' },
    { id: 'process-return', labelEn: 'Process Return', labelAr: 'معالجة إرجاع', href: '/car-rental-company/deliveries/return', icon: 'ArrowLeftFromLine', color: 'amber' },
    { id: 'view-reports', labelEn: 'View Reports', labelAr: 'عرض التقارير', href: '/car-rental-company/reports', icon: 'BarChart3', color: 'purple' },
  ],
  overviewStats: ['available_vehicles', 'active_rentals', 'reservations_today', 'monthly_revenue'],
  sidebarSections: [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelAr: 'نظرة عامة',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/car-rental-company/overview', icon: 'LayoutDashboard' },
        { id: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات', href: '/car-rental-company/notifications', icon: 'Bell' },
        { id: 'reports', labelEn: 'Reports', labelAr: 'التقارير', href: '/car-rental-company/reports', icon: 'BarChart3' },
      ],
    },
    {
      id: 'fleet',
      labelEn: 'Fleet',
      labelAr: 'الأسطول',
      items: [
        { id: 'vehicles', labelEn: 'Vehicles', labelAr: 'المركبات', href: '/car-rental-company/vehicles', icon: 'Car' },
        { id: 'vehicle-availability', labelEn: 'Vehicle Availability', labelAr: 'توفر المركبات', href: '/car-rental-company/vehicle-availability', icon: 'CalendarCheck' },
        { id: 'maintenance', labelEn: 'Maintenance', labelAr: 'الصيانة', href: '/car-rental-company/maintenance', icon: 'Wrench' },
      ],
    },
    {
      id: 'rentals',
      labelEn: 'Rentals',
      labelAr: 'التأجير',
      items: [
        { id: 'reservations', labelEn: 'Reservations', labelAr: 'الحجوزات', href: '/car-rental-company/reservations', icon: 'ClipboardList' },
        { id: 'active-rentals', labelEn: 'Active Rentals', labelAr: 'التأجير النشط', href: '/car-rental-company/active-rentals', icon: 'CarFront' },
        { id: 'contracts', labelEn: 'Contracts', labelAr: 'العقود', href: '/car-rental-company/contracts', icon: 'FileText' },
      ],
    },
    {
      id: 'customers-and-operations',
      labelEn: 'Customers & Operations',
      labelAr: 'العملاء والعمليات',
      items: [
        { id: 'customers', labelEn: 'Customers', labelAr: 'العملاء', href: '/car-rental-company/customers', icon: 'Users' },
        { id: 'deliveries-and-returns', labelEn: 'Deliveries & Returns', labelAr: 'التسليم والإرجاع', href: '/car-rental-company/deliveries', icon: 'ArrowLeftRight' },
        { id: 'fines-and-damages', labelEn: 'Fines & Damages', labelAr: 'الغرامات والأضرار', href: '/car-rental-company/fines', icon: 'TriangleAlert' },
        { id: 'payments', labelEn: 'Payments', labelAr: 'المدفوعات', href: '/car-rental-company/payments', icon: 'Wallet' },
      ],
    },
    {
      id: 'management',
      labelEn: 'Management',
      labelAr: 'الإدارة',
      permission: 'manage_organization',
      items: [
        { id: 'branches', labelEn: 'Branches', labelAr: 'الفروع', href: '/car-rental-company/branches', icon: 'Store' },
        { id: 'employees', labelEn: 'Employees', labelAr: 'الموظفين', href: '/car-rental-company/employees', icon: 'UsersRound' },
        { id: 'roles', labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات', href: '/car-rental-company/roles', icon: 'Shield' },
        { id: 'settings', labelEn: 'Organization Settings', labelAr: 'إعدادات المنشأة', href: '/car-rental-company/settings', icon: 'Settings' },
      ],
    },
    {
      id: 'analytics',
      labelEn: 'Analytics',
      labelAr: 'التحليلات',
      items: [
        { id: 'rental-reports', labelEn: 'Rental Reports', labelAr: 'تقارير التأجير', href: '/car-rental-company/reports/rentals', icon: 'TrendingUp' },
        { id: 'fleet-reports', labelEn: 'Fleet Reports', labelAr: 'تقارير الأسطول', href: '/car-rental-company/reports/fleet', icon: 'Car' },
        { id: 'financial-reports', labelEn: 'Financial Reports', labelAr: 'التقارير المالية', href: '/car-rental-company/reports/financial', icon: 'BarChart3' },
      ],
    },
  ],
}
