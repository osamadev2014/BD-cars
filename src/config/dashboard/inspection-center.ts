import type { DashboardConfig } from './index'

export const inspectionCenterConfig: DashboardConfig = {
  type: 'inspection_center',
  slug: 'inspection-center',
  labelEn: 'Inspection Center',
  labelAr: 'مركز فحص',
  icon: 'ClipboardCheck',
  color: 'teal',
  quickActions: [
    { id: 'new-inspection', labelEn: 'New Inspection', labelAr: 'فحص جديد', href: '/inspection-center/inspections/request', icon: 'PlusCircle', color: 'teal' },
    { id: 'add-customer', labelEn: 'Add Customer', labelAr: 'إضافة عميل', href: '/inspection-center/customers/new', icon: 'UserPlus', color: 'green' },
    { id: 'schedule-appointment', labelEn: 'Schedule Appointment', labelAr: 'جدولة موعد', href: '/inspection-center/appointments/new', icon: 'CalendarPlus', color: 'amber' },
    { id: 'view-reports', labelEn: 'View Reports', labelAr: 'عرض التقارير', href: '/inspection-center/reports', icon: 'BarChart3', color: 'purple' },
  ],
  overviewStats: ['pending_inspections', 'completed_today', 'active_technicians', 'monthly_revenue'],
  sidebarSections: [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelAr: 'نظرة عامة',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/inspection-center/overview', icon: 'LayoutDashboard' },
        { id: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات', href: '/inspection-center/notifications', icon: 'Bell' },
        { id: 'reports', labelEn: 'Reports', labelAr: 'التقارير', href: '/inspection-center/reports', icon: 'BarChart3' },
      ],
    },
    {
      id: 'inspections',
      labelEn: 'Inspections',
      labelAr: 'الفحوصات',
      items: [
        { id: 'appointments', labelEn: 'Appointments', labelAr: 'المواعيد', href: '/inspection-center/appointments', icon: 'Calendar' },
        { id: 'inspection-requests', labelEn: 'Inspection Requests', labelAr: 'طلبات الفحص', href: '/inspection-center/inspection-requests', icon: 'ClipboardList' },
        { id: 'active-inspections', labelEn: 'Active Inspections', labelAr: 'الفحوصات النشطة', href: '/inspection-center/active-inspections', icon: 'ClipboardCheck' },
        { id: 'inspection-reports', labelEn: 'Inspection Reports', labelAr: 'تقارير الفحص', href: '/inspection-center/inspection-reports', icon: 'FileSpreadsheet' },
        { id: 'technicians', labelEn: 'Technicians', labelAr: 'الفنيون', href: '/inspection-center/technicians', icon: 'Wrench' },
        { id: 'inspection-stages', labelEn: 'Inspection Stages', labelAr: 'مراحل الفحص', href: '/inspection-center/inspection-stages', icon: 'ListChecks' },
        { id: 'inspection-devices', labelEn: 'Inspection Devices', labelAr: 'أجهزة الفحص', href: '/inspection-center/inspection-devices', icon: 'Monitor' },
      ],
    },
    {
      id: 'customers-and-billing',
      labelEn: 'Customers & Billing',
      labelAr: 'العملاء والفواتير',
      items: [
        { id: 'customers', labelEn: 'Customers', labelAr: 'العملاء', href: '/inspection-center/customers', icon: 'Users' },
        { id: 'invoices', labelEn: 'Invoices', labelAr: 'الفواتير', href: '/inspection-center/invoices', icon: 'Receipt' },
        { id: 'payments', labelEn: 'Payments', labelAr: 'المدفوعات', href: '/inspection-center/payments', icon: 'Wallet' },
      ],
    },
    {
      id: 'management',
      labelEn: 'Management',
      labelAr: 'الإدارة',
      permission: 'manage_organization',
      items: [
        { id: 'branches', labelEn: 'Branches', labelAr: 'الفروع', href: '/inspection-center/branches', icon: 'Store' },
        { id: 'employees', labelEn: 'Employees', labelAr: 'الموظفين', href: '/inspection-center/employees', icon: 'UsersRound' },
        { id: 'roles', labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات', href: '/inspection-center/roles', icon: 'Shield' },
        { id: 'settings', labelEn: 'Organization Settings', labelAr: 'إعدادات المنشأة', href: '/inspection-center/settings', icon: 'Settings' },
      ],
    },
    {
      id: 'analytics',
      labelEn: 'Analytics',
      labelAr: 'التحليلات',
      items: [
        { id: 'inspection-reports-analytics', labelEn: 'Inspection Reports', labelAr: 'تقارير الفحص', href: '/inspection-center/reports/inspections', icon: 'ClipboardCheck' },
        { id: 'customer-reports', labelEn: 'Customer Reports', labelAr: 'تقارير العملاء', href: '/inspection-center/reports/customers', icon: 'UserCheck' },
        { id: 'financial-reports', labelEn: 'Financial Reports', labelAr: 'التقارير المالية', href: '/inspection-center/reports/financial', icon: 'TrendingUp' },
      ],
    },
  ],
}
