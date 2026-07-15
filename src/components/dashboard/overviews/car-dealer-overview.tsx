import { getDashboardConfig } from '@/config/dashboard/registry'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { getAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DashboardIcon } from '@/components/icons/dashboard-icons'
import { formatPrice } from '@/lib/utils'

interface Props {
  locale: string
  orgId: string
  orgName?: string
  orgNameAr?: string
  orgSlug: string
  data?: { stats: Array<{ label: string; value: string | number }> }
}

async function getDashboardData(orgId: string) {
  const admin = getAdminClient() as any
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const todayStr = now.toISOString().split('T')[0]

  const [activeListingsRes, reservedRes, soldRes, soldPrevRes, pendingRequestsRes, listingsRes, inventoryRes, customersRes, appointmentsRes, inspectionRes, transportRes, invoicesRes, recentVehiclesRes, recentCustomersRes, recentActivityRes, alertsRes] = await Promise.all([
    admin.from('vehicle_listings').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'active'),
    admin.from('vehicle_listings').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'reserved'),
    admin.from('vehicle_listings').select('price', { count: 'exact', head: false }).eq('org_id', orgId).eq('status', 'sold').gte('updated_at', monthStart),
    admin.from('vehicle_listings').select('price', { count: 'exact', head: false }).eq('org_id', orgId).eq('status', 'sold').gte('updated_at', prevMonthStart).lt('updated_at', monthStart),
    admin.from('purchase_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'pending'),
    admin.from('vehicle_listings').select('id,price,status,created_at,vehicle:vehicles(id,year,make:car_makes(name,name_ar),model:car_models(name,name_ar),images:vehicle_images(url,is_primary))').eq('org_id', orgId).order('created_at', { ascending: false }).limit(10),
    admin.from('dealer_inventory').select('*', { count: 'exact', head: true }).eq('dealer_id', orgId).in('status', ['available', 'in_stock']),
    admin.from('organization_members').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
    admin.from('appointments').select('id,appointment_date,status,customer_name,appointment_type').eq('org_id', orgId).eq('appointment_date', todayStr).order('appointment_date', { ascending: true }).limit(5),
    admin.from('inspection_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId).in('status', ['new', 'pending']),
    admin.from('transport_requests').select('*', { count: 'exact', head: true }).eq('org_id', orgId).in('status', ['new', 'in_progress']),
    admin.from('invoices').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'unpaid'),
    admin.from('vehicle_listings').select('id,price,status,created_at,vehicle:vehicles(id,year,make:car_makes(name,name_ar),model:car_models(name,name_ar),images:vehicle_images(url,is_primary))').eq('org_id', orgId).order('created_at', { ascending: false }).limit(5),
    admin.from('organization_members').select('id,user_id,role').eq('organization_id', orgId).limit(5),
    admin.from('listing_status_history').select('id,status,notes,changed_by,created_at').eq('listing_id', orgId).order('created_at', { ascending: false }).limit(10),
    admin.from('vehicle_listings').select('id,status').eq('org_id', orgId).in('status', ['pending', 'draft']).limit(20),
  ])

  const activeListings = activeListingsRes.count ?? 0
  const reserved = reservedRes.count ?? 0
  const soldCount = soldRes.count ?? 0
  const soldPrevCount = soldPrevRes.count ?? 0
  const pendingRequests = pendingRequestsRes.count ?? 0
  const availableInventory = inventoryRes.count ?? 0
  const customers = customersRes.count ?? 0
  const pendingInspections = inspectionRes.count ?? 0
  const transportRequests = transportRes.count ?? 0
  const unpaidInvoices = invoicesRes.count ?? 0

  let totalSalesValue = 0
  let prevSalesValue = 0
  if (soldRes.data) soldRes.data.forEach((r: any) => { totalSalesValue += Number(r.price || 0) })
  if (soldPrevRes.data) soldPrevRes.data.forEach((r: any) => { prevSalesValue += Number(r.price || 0) })

  const salesChange = prevSalesValue > 0 ? Math.round(((totalSalesValue - prevSalesValue) / prevSalesValue) * 100) : 0

  const recentVehicles = (recentVehiclesRes.data || []).slice(0, 5)
  const todayAppointments = (appointmentsRes.data || []).slice(0, 5)
  const pendingCount = (alertsRes.data || []).filter((v: any) => v.status === 'pending' || v.status === 'draft').length
  const draftCount = (alertsRes.data || []).filter((v: any) => v.status === 'draft').length
  const needsPrice = (alertsRes.data || []).filter((v: any) => v.status === 'draft').length

  return {
    activeListings,
    availableInventory,
    reserved,
    soldCount,
    totalSalesValue,
    salesChange,
    pendingRequests,
    customers,
    pendingInspections,
    transportRequests,
    unpaidInvoices,
    recentVehicles,
    todayAppointments,
    draftCount,
    pendingCount,
    needsPrice,
    totalCars: activeListings + reserved + soldCount,
  }
}

export async function CarDealerOverview({ locale, orgId, orgName, orgNameAr, orgSlug, data }: Props) {
  const isRtl = locale === 'ar'
  const config = getDashboardConfig(orgSlug as any)
  const displayName = isRtl && orgNameAr ? orgNameAr : orgName || ''
  const d = await getDashboardData(orgId)

  if (d.totalCars === 0) {
    return (
      <div>
        <DashboardPageHeader
          title={isRtl ? 'لوحة تحكم المعرض' : 'Dealer Dashboard'}
          description={displayName}
          breadcrumbs={[
            { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgSlug}/overview` },
            { label: isRtl ? 'نظرة عامة' : 'Overview' },
          ]}
          locale={locale}
        />
        <DashboardEmptyState
          title={isRtl ? 'ابدأ بإضافة سياراتك' : 'Start by Adding Vehicles'}
          description={isRtl ? 'أضف سياراتك الأولى لبدء استقبال العملاء وإدارة الطلبات' : 'Add your first vehicles to start receiving customers'}
          action={
            <Link href={`/${locale}/dashboard/${orgSlug}/inventory/new`}
              className="inline-flex items-center h-9 px-4 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
            >
              {isRtl ? 'إضافة سيارة' : 'Add Vehicle'}
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <DashboardPageHeader
        title={isRtl ? 'لوحة تحكم المعرض' : 'Dealer Dashboard'}
        description={displayName}
        breadcrumbs={[
          { label: isRtl ? 'لوحة التحكم' : 'Dashboard', href: `/${locale}/dashboard/${orgSlug}/overview` },
          { label: isRtl ? 'نظرة عامة' : 'Overview' },
        ]}
        locale={locale}
      />

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardStatCard
          label={isRtl ? 'السيارات المتاحة' : 'Available Vehicles'}
          value={d.availableInventory}
          icon={<DashboardIcon name="Car" color="#16a34a" />}
          color="green"
          trend={{ value: d.soldCount > 0 ? 100 : 0, positive: true }}
        />
        <DashboardStatCard
          label={isRtl ? 'محجوزة' : 'Reserved'}
          value={d.reserved}
          icon={<DashboardIcon name="CalendarCheck" color="#2563eb" />}
          color="blue"
        />
        <DashboardStatCard
          label={isRtl ? 'مباعة هذا الشهر' : 'Sold This Month'}
          value={d.soldCount}
          icon={<DashboardIcon name="ShoppingCart" color="#d97706" />}
          color="amber"
          trend={{ value: d.salesChange, positive: d.salesChange >= 0 }}
        />
        <DashboardStatCard
          label={isRtl ? 'إجمالي المبيعات' : 'Total Sales'}
          value={formatPrice(d.totalSalesValue)}
          icon={<DashboardIcon name="Wallet" color="#7c3aed" />}
          color="purple"
        />
        <DashboardStatCard
          label={isRtl ? 'الإعلانات النشطة' : 'Active Listings'}
          value={d.activeListings}
          icon={<DashboardIcon name="LayoutDashboard" color="#0d9488" />}
          color="teal"
        />
        <DashboardStatCard
          label={isRtl ? 'العملاء' : 'Customers'}
          value={d.customers}
          icon={<DashboardIcon name="Users" color="#0891b2" />}
          color="cyan"
        />
        <DashboardStatCard
          label={isRtl ? 'طلبات معلقة' : 'Pending Requests'}
          value={d.pendingRequests}
          icon={<DashboardIcon name="ClipboardList" color="#dc2626" />}
          color="red"
        />
        <DashboardStatCard
          label={isRtl ? 'مبيعات (المجموع)' : 'Total Sales'}
          value={d.soldCount}
          icon={<DashboardIcon name="TrendingUp" color="#4f46e5" />}
          color="indigo"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {isRtl ? 'إجراءات سريعة' : 'Quick Actions'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {[
            { icon: 'PlusCircle', label: isRtl ? 'إضافة سيارة' : 'Add Vehicle', href: `/${locale}/dashboard/${orgSlug}/inventory/new`, color: 'text-blue-600' },
            { icon: 'UserPlus', label: isRtl ? 'إضافة عميل' : 'Add Customer', href: `/${locale}/dashboard/${orgSlug}/customers/new`, color: 'text-green-600' },
            { icon: 'ShoppingCart', label: isRtl ? 'تسجيل بيع' : 'Record Sale', href: `/${locale}/dashboard/${orgSlug}/sales/new`, color: 'text-amber-600' },
            { icon: 'FileText', label: isRtl ? 'إنشاء فاتورة' : 'Create Invoice', href: `/${locale}/dashboard/${orgSlug}/invoices/new`, color: 'text-purple-600' },
            { icon: 'FileSpreadsheet', label: isRtl ? 'عرض الأسعار' : 'Quotation', href: `/${locale}/dashboard/${orgSlug}/quotations/new`, color: 'text-teal-600' },
            { icon: 'CalendarCheck', label: isRtl ? 'حجز موعد' : 'Appointment', href: `/${locale}/dashboard/${orgSlug}/appointments/new`, color: 'text-indigo-600' },
          ].map((action) => (
            <Link key={action.href} href={action.href}
              className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
            >
              <DashboardIcon name={action.icon} className={`h-5 w-5 ${action.color}`} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white truncate">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Two column layout - Sales & Recent */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales Performance */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {isRtl ? 'أداء المبيعات' : 'Sales Performance'}
            </h3>
            <Link href={`/${locale}/dashboard/${orgSlug}/reports/sales`} className="text-xs text-blue-600 hover:underline">
              {isRtl ? 'عرض الكل' : 'View All'} {isRtl ? <ChevronLeft className="h-3 w-3 inline" /> : <ChevronRight className="h-3 w-3 inline" />}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{d.soldCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isRtl ? 'تم البيع' : 'Sold'}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(d.totalSalesValue)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isRtl ? 'قيمة المبيعات' : 'Sales Value'}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl font-bold text-green-600">{d.salesChange >= 0 ? '+' : ''}{d.salesChange}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isRtl ? 'التغيير' : 'Change'}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{d.pendingRequests}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isRtl ? 'طلبات معلقة' : 'Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {isRtl ? 'مواعيد اليوم' : "Today's Appointments"}
            </h3>
            <Link href={`/${locale}/dashboard/${orgSlug}/appointments`} className="text-xs text-blue-600 hover:underline">
              {isRtl ? 'عرض الكل' : 'View All'}
            </Link>
          </div>
          {d.todayAppointments.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">
              {isRtl ? 'لا توجد مواعيد لليوم' : 'No appointments today'}
            </p>
          ) : (
            <div className="space-y-3">
              {d.todayAppointments.map((apt: any) => (
                <div key={apt.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{apt.customer_name || '—'}</p>
                    <p className="text-[10px] text-gray-400">{apt.appointment_type || ''}</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Latest Vehicles & Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recently Added Vehicles */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {isRtl ? 'آخر المركبات المضافة' : 'Recently Added Vehicles'}
            </h3>
            <Link href={`/${locale}/dashboard/${orgSlug}/inventory`} className="text-xs text-blue-600 hover:underline">
              {isRtl ? 'عرض الكل' : 'View All'}
            </Link>
          </div>
          {d.recentVehicles.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">
              {isRtl ? 'لا توجد مركبات بعد' : 'No vehicles yet'}
            </p>
          ) : (
            <div className="space-y-3">
              {d.recentVehicles.map((v: any) => {
                const make = v.vehicle?.make
                const model = v.vehicle?.model
                const name = isRtl
                  ? `${make?.name_ar || make?.name || ''} ${model?.name_ar || model?.name || ''}`
                  : `${make?.name || ''} ${model?.name || ''}`
                const year = v.vehicle?.year || ''
                const primaryImage = v.vehicle?.images?.find((img: any) => img.is_primary) || v.vehicle?.images?.[0]
                return (
                  <Link key={v.id} href={`/${locale}/dashboard/${orgSlug}/inventory/${v.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-12 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                      {primaryImage ? (
                        <img src={primaryImage.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <DashboardIcon name="Car" className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{name} {year}</p>
                      <p className="text-[10px] text-gray-400">{formatPrice(v.price)}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      v.status === 'active' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                      v.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                      v.status === 'draft' ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' :
                      'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    }`}>
                      {v.status}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Tasks Requiring Attention */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {isRtl ? 'مهام تحتاج متابعة' : 'Tasks Requiring Attention'}
          </h3>
          <div className="space-y-3">
            {d.pendingCount > 0 && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    {isRtl ? 'مركبات تنتظر النشر' : 'Vehicles pending publication'}
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-600">{d.pendingCount}</span>
              </div>
            )}
            {d.draftCount > 0 && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    {isRtl ? 'مسودات غير مكتملة' : 'Incomplete drafts'}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-500">{d.draftCount}</span>
              </div>
            )}
            {d.pendingRequests > 0 && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    {isRtl ? 'طلبات شراء لم ترد عليها' : 'Unanswered purchase requests'}
                  </span>
                </div>
                <span className="text-xs font-bold text-red-600">{d.pendingRequests}</span>
              </div>
            )}
            {d.pendingInspections > 0 && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    {isRtl ? 'طلبات فحص جديدة' : 'New inspection requests'}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-600">{d.pendingInspections}</span>
              </div>
            )}
            {d.unpaidInvoices > 0 && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    {isRtl ? 'فواتير غير مدفوعة' : 'Unpaid invoices'}
                  </span>
                </div>
                <span className="text-xs font-bold text-purple-600">{d.unpaidInvoices}</span>
              </div>
            )}
            {d.pendingCount === 0 && d.draftCount === 0 && d.pendingRequests === 0 && d.pendingInspections === 0 && d.unpaidInvoices === 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">
                {isRtl ? 'لا توجد مهام تحتاج متابعة' : 'No tasks requiring attention'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Operations Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href={`/${locale}/dashboard/${orgSlug}/inspections`}
          className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <DashboardIcon name="SearchCheck" className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{d.pendingInspections}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isRtl ? 'فحوصات معلقة' : 'Pending Inspections'}
              </p>
            </div>
          </div>
          {isRtl ? <ChevronLeft className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
        </Link>
        <Link href={`/${locale}/dashboard/${orgSlug}/transport-requests`}
          className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <DashboardIcon name="Ship" className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{d.transportRequests}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isRtl ? 'طلبات نقل' : 'Transport Requests'}
              </p>
            </div>
          </div>
          {isRtl ? <ChevronLeft className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
        </Link>
        <Link href={`/${locale}/dashboard/${orgSlug}/invoices`}
          className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <DashboardIcon name="Receipt" className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{d.unpaidInvoices}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isRtl ? 'فواتير غير مدفوعة' : 'Unpaid Invoices'}
              </p>
            </div>
          </div>
          {isRtl ? <ChevronLeft className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
        </Link>
      </div>
    </div>
  )
}