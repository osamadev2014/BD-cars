'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { adminGetAllPlacements, adminCreatePlacement, adminUpdatePlacement, adminDeletePlacement } from '@/lib/actions/ad-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function PlacementsManager() {
  const t = useTranslations('ads')
  const ct = useTranslations('common')
  const [placements, setPlacements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ key: '', name: '', name_ar: '', description: '', width: '', height: '' })

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminGetAllPlacements()
      setPlacements(data)
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!form.key || !form.name) return
    try {
      if (editing) {
        await adminUpdatePlacement(editing.id, {
          key: form.key,
          name: form.name,
          name_ar: form.name_ar || undefined,
          description: form.description || undefined,
          width: form.width ? parseInt(form.width) : undefined,
          height: form.height ? parseInt(form.height) : undefined,
        })
      } else {
        await adminCreatePlacement({
          key: form.key,
          name: form.name,
          name_ar: form.name_ar || undefined,
          description: form.description || undefined,
          width: form.width ? parseInt(form.width) : undefined,
          height: form.height ? parseInt(form.height) : undefined,
        })
      }
      setShowForm(false)
      setEditing(null)
      setForm({ key: '', name: '', name_ar: '', description: '', width: '', height: '' })
      load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleEdit = (p: any) => {
    setEditing(p)
    setForm({
      key: p.key,
      name: p.name,
      name_ar: p.name_ar || '',
      description: p.description || '',
      width: p.width?.toString() || '',
      height: p.height?.toString() || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this placement?')) return
    try {
      await adminDeletePlacement(id)
      load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleToggleActive = async (p: any) => {
    try {
      await adminUpdatePlacement(p.id, { is_active: !p.is_active })
      load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) return <div className="h-48 bg-muted rounded-lg animate-pulse" />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setForm({ key: '', name: '', name_ar: '', description: '', width: '', height: '' }); setShowForm(true) }}>
          {ct('create')} Placement
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg bg-card p-6 space-y-4">
          <h3 className="font-semibold">{editing ? 'Edit' : 'New'} Placement</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Key *</label>
              <Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} required placeholder="e.g. homepage_banner" />
            </div>
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium">Name (Arabic)</label>
              <Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Width (px)</label>
              <Input type="number" value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Height (px)</label>
              <Input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!form.key || !form.name}>
              {ct('save')}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null) }}>
              {ct('cancel')}
            </Button>
          </div>
        </div>
      )}

      {placements.length === 0 ? (
        <div className="border rounded-lg bg-card p-12 text-center text-muted-foreground">
          No placements yet
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-start p-3 font-medium">Key</th>
                  <th className="text-start p-3 font-medium">Name</th>
                  <th className="text-start p-3 font-medium">Dimensions</th>
                  <th className="text-start p-3 font-medium">Status</th>
                  <th className="text-start p-3 font-medium">{ct('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs">{p.key}</td>
                    <td className="p-3">{p.name || p.name_ar}</td>
                    <td className="p-3 text-muted-foreground">{p.width && p.height ? `${p.width}x${p.height}` : '-'}</td>
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
