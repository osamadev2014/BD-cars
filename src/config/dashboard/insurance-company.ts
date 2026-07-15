import type { DashboardConfig } from './index'

export const insuranceCompanyConfig: DashboardConfig = {
  type: 'insurance_company',
  slug: 'insurance-company',
  labelEn: 'Insurance Company',
  labelAr: 'شركة تأمين',
  icon: 'ShieldCheck',
  color: 'indigo',
  quickActions: [
    { id: 'new-request', labelEn: 'New Insurance Request', labelAr: 'طلب تأمين جديد', href: '/insurance-company/requests/new', icon: 'PlusCircle', color: 'indigo' },
    { id: 'create-quotation', labelEn: 'Create Quotation', labelAr: 'إنشاء عرض سعر', href: '/insurance-company/quotations/new', icon: 'FileSpreadsheet', color: 'green' },
    { id: 'process-claim', labelEn: 'Process Claim', labelAr: 'معالجة مطالبة', href: '/insurance-company/claims/new', icon: 'FileSearch', color: 'amber' },
    { id: 'view-reports', labelEn: 'View Reports', labelAr: 'عرض التقارير', href: '/insurance-company/reports', icon: 'BarChart3', color: 'purple' },
  ],
  overviewStats: ['pending_requests', 'active_policies', 'open_claims', 'monthly_premiums'],
  sidebarSections: [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelAr: 'نظرة عامة',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/insurance-company/overview', icon: 'LayoutDashboard' },
        { id: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات', href: '/insurance-company/notifications', icon: 'Bell' },
        { id: 'reports', labelEn: 'Reports', labelAr: 'التقارير', href: '/insurance-company/reports', icon: 'BarChart3' },
      ],
    },
    {
      id: 'insurance',
      labelEn: 'Insurance',
      labelAr: 'التأمين',
      items: [
        { id: 'insurance-requests', labelEn: 'Insurance Requests', labelAr: 'طلبات التأمين', href: '/insurance-company/requests', icon: 'ClipboardList' },
        { id: 'quotations', labelEn: 'Quotations', labelAr: 'عروض الأسعار', href: '/insurance-company/quotations', icon: 'FileSpreadsheet' },
        { id: 'policies', labelEn: 'Policies', labelAr: 'الوثائق', href: '/insurance-company/policies', icon: 'FileText' },
        { id: 'claims', labelEn: 'Claims', labelAr: 'المطالبات', href: '/insurance-company/claims', icon: 'FileSearch' },
        { id: 'renewals', labelEn: 'Renewals', labelAr: 'التجديدات', href: '/insurance-company/renewals', icon: 'RefreshCw' },
      ],
    },
    {
      id: 'customers-and-billing',
      labelEn: 'Customers & Billing',
      labelAr: 'العملاء والفواتير',
      items: [
        { id: 'customers', labelEn: 'Customers', labelAr: 'العملاء', href: '/insurance-company/customers', icon: 'Users' },
        { id: 'payments', labelEn: 'Payments', labelAr: 'المدفوعات', href: '/insurance-company/payments', icon: 'Wallet' },
      ],
    },
    {
      id: 'partners',
      labelEn: 'Partners',
      labelAr: 'الشركاء',
      items: [
        { id: 'partner-dealers', labelEn: 'Partner Dealers', labelAr: 'الموزعون الشركاء', href: '/insurance-company/partner-dealers', icon: 'Handshake' },
      ],
    },
    {
      id: 'management',
      labelEn: 'Management',
      labelAr: 'الإدارة',
      permission: 'manage_organization',
      items: [
        { id: 'employees', labelEn: 'Employees', labelAr: 'الموظفين', href: '/insurance-company/employees', icon: 'UsersRound' },
        { id: 'roles', labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات', href: '/insurance-company/roles', icon: 'Shield' },
        { id: 'settings', labelEn: 'Organization Settings', labelAr: 'إعدادات المنشأة', href: '/insurance-company/settings', icon: 'Settings' },
      ],
    },
    {
      id: 'analytics',
      labelEn: 'Analytics',
      labelAr: 'التحليلات',
      items: [
        { id: 'policy-reports', labelEn: 'Policy Reports', labelAr: 'تقارير الوثائق', href: '/insurance-company/reports/policies', icon: 'FileText' },
        { id: 'claims-reports', labelEn: 'Claims Reports', labelAr: 'تقارير المطالبات', href: '/insurance-company/reports/claims', icon: 'FileSearch' },
        { id: 'financial-reports', labelEn: 'Financial Reports', labelAr: 'التقارير المالية', href: '/insurance-company/reports/financial', icon: 'TrendingUp' },
      ],
    },
  ],
}
