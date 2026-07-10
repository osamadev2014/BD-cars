'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { adminGetAllPackages, adminCreatePackage, adminUpdatePackage, adminDeletePackage, adminGetAllPlacements } from '@/lib/actions/ad-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function PackagesManager() {
  const t = useTranslations('ads')
  const ct = useTranslations('common')
  const [packages, setPackages] = useState<any[]>([])
  const [placements, setPlacements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({
    name: '', name_ar: '', description: '', price: '', duration_days: '30', placement_id: '',
  })

  const load = async () => {
    setLoading(true)
    try {
      const [pkgs, pl] = await Promise.all([
        adminGetAllPackages(),
        adminGetAllPlacements(),
      ])
      setPackages(pkgs)
      setPlacements(pl)
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!form.name || !form.price) return
    try {
      if (editing) {
        await adminUpdatePackage(editing.id, {
          name: form.name,
          name_ar: form.name_ar || undefined,
          description: form.description || undefined,
          price: parseFloat(form.price),
          duration_days: parseInt(form.duration_days),
          placement_id: form.placement_id || undefined,
        })
      } else {
        await adminCreatePackage({
          name: form.name,
          name_ar: form.name_ar || undefined,
          description: form.description || undefined,
          price: parseFloat(form.price),
          duration_days: parseInt(form.duration_days),
          placement_id: form.placement_id || undefined,
        })
      }
      setShowForm(false)
      setEditing(null)
      setForm({ name: '', name_ar: '', description: '', price: '', duration_days: '30', placement_id: '' })
      load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleEdit = (p: any) => {
    setEditing(p)
    setForm({
      name: p.name,
      name_ar: p.name_ar || '',
      description: p.description || '',
      price: p.price.toString(),
      duration_days: p.duration_days.toString(),
      placement_id: p.placement_id || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this package?')) return
    try {
      await adminDeletePackage(id)
      load()
    } catch (err: any) { alert(err.message) }
  }

  const handleToggleActive = async (p: any) => {
    try {
      await adminUpdatePackage(p.id, { is_active: !p.is_active })
      load()
    } catch (err: any) { alert(err.message) }
  }

  if (loading) return <div className="h-48 bg-muted rounded-lg animate-pulse" />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setForm({ name: '', name_ar: '', description: '', price: '', duration_days: '30', placement_id: '' }); setShowForm(true) }}>
          {ct('create')} Package
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg bg-card p-6 space-y-4">
          <h3 className="font-semibold">{editing ? 'Edit' : 'New'} Package</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium">Name (Arabic)</label>
              <Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Price (SAR) *</label>
              <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium">Duration (days) *</label>
              <Input type="number" min="1" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium">Placement</label>
              <select
                value={form.placement_id}
                onChange={(e) => setForm({ ...form, placement_id: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">None</option>
                {placements.map((p) => (
                  <option key={p.id} value={p.id}>{p.name || p.name_ar}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!form.name || !form.price}>
              {ct('save')}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null) }}>
              {ct('cancel')}
            </Button>
          </div>
        </div>
      )}

      {packages.length === 0 ? (
        <div className="border rounded-lg bg-card p-12 text-center text-muted-foreground">
          No packages yet
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-start p-3 font-medium">Name</th>
                  <th className="text-start p-3 font-medium">Price</th>
                  <th className="text-start p-3 font-medium">Duration</th>
                  <th className="text-start p-3 font-medium">Placement</th>
                  <th className="text-start p-3 font-medium">Status</th>
                  <th className="text-start p-3 font-medium">{ct('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-medium">{p.name || p.name_ar}</td>
                    <td className="p-3">{p.price.toLocaleString()} SAR</td>
                    <td className="p-3">{p.duration_days} days</td>
                    <td className="p-3 text-muted-foreground">{p.placement?.name || p.placement?.name_ar || '-'}</td>
                    <td className="p-3">
                      <Badge variant={p.is_active ? 'success' : 'secondary'}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(p)}>{ct('edit')}</Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggleActive(p)}>
                          {p.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>{ct('delete')}</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
