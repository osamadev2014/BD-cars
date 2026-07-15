import type { DashboardConfig } from './index'

export const marketingCompanyConfig: DashboardConfig = {
  type: 'advertising_marketing_company',
  slug: 'marketing-company',
  labelEn: 'Marketing & Advertising Company',
  labelAr: 'شركة تسويق وإعلان',
  icon: 'Megaphone',
  color: 'pink',
  quickActions: [
    { id: 'new-campaign', labelEn: 'New Campaign', labelAr: 'حملة جديدة', href: '/marketing-company/campaigns/new', icon: 'PlusCircle', color: 'pink' },
    { id: 'add-client', labelEn: 'Add Client', labelAr: 'إضافة عميل', href: '/marketing-company/clients/new', icon: 'UserPlus', color: 'green' },
    { id: 'create-ad', labelEn: 'Create Advertisement', labelAr: 'إنشاء إعلان', href: '/marketing-company/advertisements/new', icon: 'ImagePlus', color: 'amber' },
    { id: 'view-reports', labelEn: 'View Reports', labelAr: 'عرض التقارير', href: '/marketing-company/reports', icon: 'BarChart3', color: 'blue' },
  ],
  overviewStats: ['active_campaigns', 'total_clients', 'open_leads', 'monthly_revenue'],
  sidebarSections: [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelAr: 'نظرة عامة',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/marketing-company/overview', icon: 'LayoutDashboard' },
        { id: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات', href: '/marketing-company/notifications', icon: 'Bell' },
        { id: 'reports', labelEn: 'Reports', labelAr: 'التقارير', href: '/marketing-company/reports', icon: 'BarChart3' },
      ],
    },
    {
      id: 'campaigns',
      labelEn: 'Campaigns',
      labelAr: 'الحملات',
      items: [
        { id: 'clients', labelEn: 'Clients', labelAr: 'العملاء', href: '/marketing-company/clients', icon: 'Building2' },
        { id: 'campaigns', labelEn: 'Campaigns', labelAr: 'الحملات', href: '/marketing-company/campaigns', icon: 'Flag' },
        { id: 'leads', labelEn: 'Leads', labelAr: 'العملاء المحتملون', href: '/marketing-company/leads', icon: 'Users' },
        { id: 'advertisements', labelEn: 'Advertisements', labelAr: 'الإعلانات', href: '/marketing-company/advertisements', icon: 'Image' },
      ],
    },
    {
      id: 'content-and-tasks',
      labelEn: 'Content & Tasks',
      labelAr: 'المحتوى والمهام',
      items: [
        { id: 'content', labelEn: 'Content', labelAr: 'المحتوى', href: '/marketing-company/content', icon: 'FileText' },
        { id: 'tasks', labelEn: 'Tasks', labelAr: 'المهام', href: '/marketing-company/tasks', icon: 'CheckSquare' },
        { id: 'calendar', labelEn: 'Calendar', labelAr: 'التقويم', href: '/marketing-company/calendar', icon: 'Calendar' },
      ],
    },
    {
      id: 'budget-and-billing',
      labelEn: 'Budget & Billing',
      labelAr: 'الميزانية والفواتير',
      items: [
        { id: 'budgets', labelEn: 'Budgets', labelAr: 'الميزانيات', href: '/marketing-company/budgets', icon: 'Wallet' },
        { id: 'invoices', labelEn: 'Invoices', labelAr: 'الفواتير', href: '/marketing-company/invoices', icon: 'Receipt' },
        { id: 'payments', labelEn: 'Payments', labelAr: 'المدفوعات', href: '/marketing-company/payments', icon: 'CreditCard' },
      ],
    },
    {
      id: 'management',
      labelEn: 'Management',
      labelAr: 'الإدارة',
      permission: 'manage_organization',
      items: [
        { id: 'employees', labelEn: 'Employees', labelAr: 'الموظفين', href: '/marketing-company/employees', icon: 'UsersRound' },
        { id: 'roles', labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات', href: '/marketing-company/roles', icon: 'Shield' },
        { id: 'settings', labelEn: 'Organization Settings', labelAr: 'إعدادات المنشأة', href: '/marketing-company/settings', icon: 'Settings' },
      ],
    },
    {
      id: 'analytics',
      labelEn: 'Analytics',
      labelAr: 'التحليلات',
      items: [
        { id: 'campaign-reports', labelEn: 'Campaign Reports', labelAr: 'تقارير الحملات', href: '/marketing-company/reports/campaigns', icon: 'TrendingUp' },
        { id: 'lead-reports', labelEn: 'Lead Reports', labelAr: 'تقارير العملاء المحتملين', href: '/marketing-company/reports/leads', icon: 'UserCheck' },
        { id: 'financial-reports', labelEn: 'Financial Reports', labelAr: 'التقارير المالية', href: '/marketing-company/reports/financial', icon: 'BarChart3' },
      ],
    },
  ],
}
