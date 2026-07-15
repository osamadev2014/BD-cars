import type { DashboardConfig } from './index'

export const financeCompanyConfig: DashboardConfig = {
  type: 'finance_company',
  slug: 'finance-company',
  labelEn: 'Finance Company',
  labelAr: 'شركة تمويل',
  icon: 'Landmark',
  color: 'green',
  quickActions: [
    { id: 'new-application', labelEn: 'New Application', labelAr: 'طلب تمويل جديد', href: '/finance-company/applications/new', icon: 'PlusCircle', color: 'green' },
    { id: 'review-applications', labelEn: 'Review Applications', labelAr: 'مراجعة الطلبات', href: '/finance-company/under-review', icon: 'SearchCheck', color: 'amber' },
    { id: 'add-partner', labelEn: 'Add Partner Dealer', labelAr: 'إضافة شريك', href: '/finance-company/partner-dealers/new', icon: 'Handshake', color: 'blue' },
    { id: 'view-reports', labelEn: 'View Reports', labelAr: 'عرض التقارير', href: '/finance-company/reports', icon: 'BarChart3', color: 'purple' },
  ],
  overviewStats: ['pending_applications', 'active_financings', 'total_financed', 'monthly_disbursements'],
  sidebarSections: [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelAr: 'نظرة عامة',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/finance-company/overview', icon: 'LayoutDashboard' },
        { id: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات', href: '/finance-company/notifications', icon: 'Bell' },
        { id: 'reports', labelEn: 'Reports', labelAr: 'التقارير', href: '/finance-company/reports', icon: 'BarChart3' },
      ],
    },
    {
      id: 'financing',
      labelEn: 'Financing',
      labelAr: 'التمويل',
      items: [
        { id: 'applications', labelEn: 'Financing Applications', labelAr: 'طلبات التمويل', href: '/finance-company/applications', icon: 'ClipboardList' },
        { id: 'offers', labelEn: 'Offers', labelAr: 'العروض', href: '/finance-company/offers', icon: 'FileSpreadsheet' },
        { id: 'under-review', labelEn: 'Under Review', labelAr: 'قيد المراجعة', href: '/finance-company/under-review', icon: 'SearchCheck' },
        { id: 'approvals', labelEn: 'Approvals', labelAr: 'الموافقات', href: '/finance-company/approvals', icon: 'CheckCircle' },
        { id: 'rejections', labelEn: 'Rejections', labelAr: 'الرفض', href: '/finance-company/rejections', icon: 'XCircle' },
      ],
    },
    {
      id: 'customers-and-billing',
      labelEn: 'Customers & Billing',
      labelAr: 'العملاء والفواتير',
      items: [
        { id: 'customers', labelEn: 'Customers', labelAr: 'العملاء', href: '/finance-company/customers', icon: 'Users' },
        { id: 'agreements', labelEn: 'Agreements', labelAr: 'الاتفاقيات', href: '/finance-company/agreements', icon: 'FileText' },
        { id: 'payments', labelEn: 'Payments', labelAr: 'المدفوعات', href: '/finance-company/payments', icon: 'Wallet' },
      ],
    },
    {
      id: 'partners',
      labelEn: 'Partners',
      labelAr: 'الشركاء',
      items: [
        { id: 'partner-dealers', labelEn: 'Partner Dealers', labelAr: 'الموزعون الشركاء', href: '/finance-company/partner-dealers', icon: 'Handshake' },
      ],
    },
    {
      id: 'management',
      labelEn: 'Management',
      labelAr: 'الإدارة',
      permission: 'manage_organization',
      items: [
        { id: 'employees', labelEn: 'Employees', labelAr: 'الموظفين', href: '/finance-company/employees', icon: 'UsersRound' },
        { id: 'roles', labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات', href: '/finance-company/roles', icon: 'Shield' },
        { id: 'settings', labelEn: 'Organization Settings', labelAr: 'إعدادات المنشأة', href: '/finance-company/settings', icon: 'Settings' },
      ],
    },
    {
      id: 'analytics',
      labelEn: 'Analytics',
      labelAr: 'التحليلات',
      items: [
        { id: 'financing-reports', labelEn: 'Financing Reports', labelAr: 'تقارير التمويل', href: '/finance-company/reports/financing', icon: 'TrendingUp' },
        { id: 'customer-reports', labelEn: 'Customer Reports', labelAr: 'تقارير العملاء', href: '/finance-company/reports/customers', icon: 'UserCheck' },
        { id: 'financial-reports', labelEn: 'Financial Reports', labelAr: 'التقارير المالية', href: '/finance-company/reports/financial', icon: 'BarChart3' },
      ],
    },
  ],
}
