'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { getListingReportSummary, getInspectionRevenueSummary, getWalletSummary, exportReportCsv, getListingsOverTime, getInspectionRevenueOverTime } from '@/lib/actions/report-actions'
import type { ReportFilters } from '@/lib/actions/report-actions'

type ReportTab = 'overview' | 'listings' | 'inspections' | 'finance' | 'parts' | 'wallet' | 'purchase_requests'

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']

export function AdminReportsClient() {
  const t = useTranslations('admin')
  const router = useRouter()
  const [tab, setTab] = useState<ReportTab>('overview')
  const [filters, setFilters] = useState<ReportFilters>({})
  const [exporting, setExporting] = useState(false)

  const updateFilter = (key: keyof ReportFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
  }

  const handleExport = async (reportType: string) => {
    setExporting(true)
    try {
      const csv = await exportReportCsv(reportType, filters)
      if (!csv) { alert(t('export_denied')); return }
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `${reportType}-report.csv`; a.click()
      URL.revokeObjectURL(url)
    } catch { alert(t('export_error')) }
    setExporting(false)
  }

  const tabs: { key: ReportTab; label: string }[] = [
    { key: 'overview', label: t('overview') },
    { key: 'listings', label: t('listings') },
    { key: 'inspections', label: t('inspections') },
    { key: 'finance', label: t('finance') },
    { key: 'parts', label: t('parts') },
    { key: 'wallet', label: t('wallet') },
    { key: 'purchase_requests', label: t('purchase_requests') },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reports')}</h1>
      </div>

      <div className="flex flex-wrap gap-2 items-end border-b pb-2">
        {tabs.map((tb) => (
          <button key={tb.key} onClick={() => setTab(tb.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === tb.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>
            {tb.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">{t('from')}</label>
          <input type="date" onChange={(e) => updateFilter('dateFrom', e.target.value)}
            className="flex h-9 rounded-md border border-input bg-background px-3 text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">{t('to')}</label>
          <input type="date" onChange={(e) => updateFilter('dateTo', e.target.value)}
            className="flex h-9 rounded-md border border-input bg-background px-3 text-sm" />
        </div>
        <button onClick={() => { setFilters({}); router.refresh() }}
          className="text-xs px-3 py-1.5 rounded-md border border-input hover:bg-accent">{t('reset')}</button>
        <button onClick={() => handleExport(tab === 'overview' ? 'listings' : tab)}
          disabled={exporting}
          className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 disabled:opacity-50">
          {exporting ? t('exporting') : t('export_csv')}
        </button>
      </div>

      {tab === 'overview' && <OverviewTab filters={filters} t={t} />}
      {tab === 'listings' && <ListingsTab filters={filters} t={t} />}
      {tab === 'inspections' && <InspectionsTab filters={filters} t={t} />}
      {tab === 'finance' && <FinanceTab filters={filters} t={t} />}
      {tab === 'parts' && <PartsTab filters={filters} t={t} />}
      {tab === 'wallet' && <WalletTab filters={filters} t={t} />}
      {tab === 'purchase_requests' && <PurchaseRequestsTab filters={filters} t={t} />}
    </div>
  )
}

function OverviewTab({ filters, t }: { filters: ReportFilters; t: any }) {
  const [listingsSummary, setListingsSummary] = useState<any>(null)
  const [inspectionSummary, setInspectionSummary] = useState<any>(null)
  const [walletSummary, setWalletSummary] = useState<any>(null)
  const [listingsOverTime, setListingsOverTime] = useState<any[]>([])
  const [revenueOverTime, setRevenueOverTime] = useState<any[]>([])

  const load = useCallback(async () => {
    const [ls, ins, ws, lot, rev] = await Promise.all([
      getListingReportSummary(filters),
      getInspectionRevenueSummary(filters),
      getWalletSummary(filters),
      getListingsOverTime(filters),
      getInspectionRevenueOverTime(filters),
    ])
    if (ls) setListingsSummary(ls)
    if (ins) setInspectionSummary(ins)
    if (ws) setWalletSummary(ws)
    setListingsOverTime(lot)
    setRevenueOverTime(rev)
  }, [filters])

  useEffect(() => { load() }, [load])

  const statusData = listingsSummary ? [
    { name: t('active'), value: listingsSummary.active },
    { name: t('sold'), value: listingsSummary.sold },
    { name: t('pending_approvals'), value: listingsSummary.pending },
    { name: t('rejected') || 'Rejected', value: listingsSummary.rejected },
  ].filter(d => d.value > 0) : []

  const totalRevenue = inspectionSummary?.revenue || 0
  const completedInspections = inspectionSummary?.completed || 0
  const totalDeposits = walletSummary?.total_deposits || 0
  const totalSpent = walletSummary?.total_spent || 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('total_listings')} value={listingsSummary?.total ?? '—'} />
        <StatCard title={t('pending_approvals')} value={listingsSummary?.pending ?? '—'} />
        <StatCard title={t('total_revenue')} value={totalRevenue ? `${totalRevenue} SAR` : '—'} />
        <StatCard title={t('inspections_completed')} value={completedInspections ?? '—'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">{t('listing_status_distribution')}</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground">{t('load_report')}</p>}
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">{t('listings_over_time')}</h3>
          {listingsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={listingsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS[0]} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground">{t('load_report')}</p>}
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">{t('inspection_revenue_chart')}</h3>
        {revenueOverTime.some(d => d.revenue > 0) ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => `${val} SAR`} />
              <Bar dataKey="revenue" fill={COLORS[3]} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-sm text-muted-foreground">{t('load_report')}</p>}
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="border rounded-lg p-4 space-y-1">
      <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function ListingsTab({ filters, t }: { filters: ReportFilters; t: any }) {
  const [data, setData] = useState<any[] | null>(null)
  const [summary, setSummary] = useState<any>(null)
  const [overTime, setOverTime] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const mod = await import('@/lib/actions/report-actions')
    const [r, s, ot] = await Promise.all([
      mod.getListingReport(filters),
      getListingReportSummary(filters),
      getListingsOverTime(filters),
    ])
    setData(r); setSummary(s); setOverTime(ot); setLoading(false)
  }

  const statusData = summary ? [
    { name: t('active'), value: summary.active },
    { name: t('sold'), value: summary.sold },
    { name: t('pending_approvals'), value: summary.pending },
    { name: 'Rejected', value: summary.rejected },
  ].filter(d => d.value > 0) : []

  return (
    <div>
      <button onClick={load} disabled={loading}
        className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 mb-4 disabled:opacity-50">
        {loading ? t('loading') : t('load_report')}
      </button>
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">{t('listing_status_distribution')}</h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground">{t('no_entries')}</p>}
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">{t('listings_over_time')}</h3>
            {overTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={overTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={COLORS[0]} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground">{t('no_entries')}</p>}
          </div>
        </div>
      )}
      {data && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr><th className="text-left p-3">ID</th><th className="text-left p-3">{t('status')}</th><th className="text-left p-3">{t('price')}</th><th className="text-left p-3">{t('date')}</th></tr>
            </thead>
            <tbody>
              {data.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 text-xs font-mono">{r.id.slice(0, 8)}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">{r.price} SAR</td>
                  <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function InspectionsTab({ filters, t }: { filters: ReportFilters; t: any }) {
  const [data, setData] = useState<any[] | null>(null)
  const [overTime, setOverTime] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const mod = await import('@/lib/actions/report-actions')
    const [r, ot] = await Promise.all([
      mod.getInspectionRevenueReport(filters),
      getInspectionRevenueOverTime(filters),
    ])
    setData(r); setOverTime(ot); setLoading(false)
  }

  return (
    <div>
      <button onClick={load} disabled={loading}
        className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 mb-4 disabled:opacity-50">
        {loading ? t('loading') : t('load_report')}
      </button>
      {overTime.some(d => d.revenue > 0) && (
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">{t('inspection_revenue_chart')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={overTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => `${val} SAR`} />
              <Bar dataKey="revenue" fill={COLORS[3]} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {data && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr><th className="text-left p-3">ID</th><th className="text-left p-3">{t('status')}</th><th className="text-left p-3">{t('revenue')}</th><th className="text-left p-3">{t('date')}</th></tr>
            </thead>
            <tbody>
              {data.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 text-xs font-mono">{r.id.slice(0, 8)}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">{r.service_price ? `${r.service_price} SAR` : '—'}</td>
                  <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function FinanceTab({ filters, t }: { filters: ReportFilters; t: any }) {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <button onClick={async () => { setLoading(true)
        const mod = await import('@/lib/actions/report-actions')
        const r = await mod.getFinanceReport(filters); setData(r); setLoading(false) }}
        className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 mb-4">
        {loading ? t('loading') : t('load_report')}
      </button>
      {data && data.length > 0 && (
        <div className="border rounded-lg p-4 mb-4 flex gap-4 flex-wrap">
          <StatCard title={t('count')} value={data.length} />
          <StatCard title={t('total_revenue')} value={`${data.reduce((s: number, r: any) => s + (parseFloat(r.requested_amount) || 0), 0)} SAR`} />
        </div>
      )}
      {data && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr><th className="text-left p-3">ID</th><th className="text-left p-3">{t('status')}</th><th className="text-left p-3">{t('amount')}</th><th className="text-left p-3">{t('date')}</th></tr>
            </thead>
            <tbody>
              {data.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 text-xs font-mono">{r.id.slice(0, 8)}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">{r.requested_amount} SAR</td>
                  <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function PartsTab({ filters, t }: { filters: ReportFilters; t: any }) {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <button onClick={async () => { setLoading(true)
        const mod = await import('@/lib/actions/report-actions')
        const r = await mod.getSparePartsReport(filters); setData(r); setLoading(false) }}
        className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 mb-4">
        {loading ? t('loading') : t('load_report')}
      </button>
      {data && data.length > 0 && (
        <div className="border rounded-lg p-4 mb-4 flex gap-4 flex-wrap">
          <StatCard title={t('count')} value={data.length} />
          <StatCard title={t('grand_total')} value={`${data.reduce((s: number, r: any) => s + (parseFloat(r.grand_total) || 0), 0)} SAR`} />
        </div>
      )}
      {data && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr><th className="text-left p-3">ID</th><th className="text-left p-3">{t('status')}</th><th className="text-left p-3">{t('grand_total')}</th><th className="text-left p-3">{t('date')}</th></tr>
            </thead>
            <tbody>
              {data.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 text-xs font-mono">{r.id.slice(0, 8)}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">{r.grand_total} SAR</td>
                  <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function WalletTab({ filters, t }: { filters: ReportFilters; t: any }) {
  const [data, setData] = useState<any[] | null>(null)
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const mod = await import('@/lib/actions/report-actions')
    const [r, s] = await Promise.all([mod.getWalletReport(filters), getWalletSummary(filters)])
    setData(r); setSummary(s); setLoading(false)
  }

  return (
    <div>
      <button onClick={load} disabled={loading}
        className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 mb-4 disabled:opacity-50">
        {loading ? t('loading') : t('load_report')}
      </button>
      {summary && (
        <div className="border rounded-lg p-4 mb-4 flex gap-4 flex-wrap">
          <StatCard title={t('count')} value={data?.length ?? summary.count} />
          <StatCard title={t('deposits')} value={`${summary.total_deposits} SAR`} />
          <StatCard title={t('spent')} value={`${summary.total_spent} SAR`} />
        </div>
      )}
      {data && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr><th className="text-left p-3">{t('type')}</th><th className="text-left p-3">{t('amount')}</th><th className="text-left p-3">{t('status')}</th><th className="text-left p-3">{t('date')}</th></tr>
            </thead>
            <tbody>
              {data.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.type}</td>
                  <td className="p-3">{r.amount} SAR</td>
                  <td className="p-3"><span className="text-xs">{r.status}</span></td>
                  <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function PurchaseRequestsTab({ filters, t }: { filters: ReportFilters; t: any }) {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <button onClick={async () => { setLoading(true)
        const mod = await import('@/lib/actions/report-actions')
        const r = await mod.getPurchaseRequestsReport(filters); setData(r); setLoading(false) }}
        className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 mb-4">
        {loading ? t('loading') : t('load_report')}
      </button>
      {data && data.length > 0 && (
        <div className="border rounded-lg p-4 mb-4 flex gap-4 flex-wrap">
          <StatCard title={t('count')} value={data.length} />
          <StatCard title={t('total_revenue')} value={`${data.reduce((s: number, r: any) => s + (parseFloat(r.proposed_price) || 0), 0)} SAR`} />
        </div>
      )}
      {data && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr><th className="text-left p-3">ID</th><th className="text-left p-3">{t('status')}</th><th className="text-left p-3">{t('amount')}</th><th className="text-left p-3">{t('date')}</th></tr>
            </thead>
            <tbody>
              {data.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 text-xs font-mono">{r.id.slice(0, 8)}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">{r.proposed_price} SAR</td>
                  <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">{t('no_entries')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
