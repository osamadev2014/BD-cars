'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { formatPrice } from '@/lib/utils'
import { saveComparison } from '@/lib/actions/compare-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const SPECS = [
  { key: 'year', labelKey: 'year', better: 'higher' as const },
  { key: 'mileage', labelKey: 'mileage', better: 'lower' as const, format: (v: any, l: any) => l?.mileage_text || `${v?.toLocaleString()} km` },
  { key: 'body_type', labelKey: 'body_type', accessor: (v: any) => v?.name },
  { key: 'transmission', labelKey: 'transmission', accessor: (v: any) => v?.name },
  { key: 'fuel_type', labelKey: 'fuel_type', accessor: (v: any) => v?.name },
  { key: 'cylinders', labelKey: 'cylinders', accessor: (v: any) => v?.name },
  { key: 'color', labelKey: 'color', accessor: (v: any) => v?.name },
  { key: 'doors', labelKey: 'doors', better: 'higher' as const },
  { key: 'engine_capacity', labelKey: 'engine', better: 'higher' as const },
]

function getSpecValue(vehicle: any, spec: typeof SPECS[number]): string | number | null {
  let value: any = vehicle?.[spec.key]
  if (spec.accessor) value = spec.accessor(value)
  if (spec.format) value = spec.format(value, vehicle)
  return value != null ? value : null
}

function findBestIndex(listings: any[], spec: typeof SPECS[number]): number | null {
  if (!spec.better) return null
  const values = listings.map((l) => {
    const v = l.vehicle?.[spec.key]
    return v != null ? Number(v) : null
  })
  const numericValues = values.filter((v): v is number => v !== null && !isNaN(v))
  if (numericValues.length < 2) return null
  if (spec.better === 'higher') {
    return values.indexOf(Math.max(...numericValues))
  }
  return values.indexOf(Math.min(...numericValues))
}

export function ComparePageClient({ listings }: { listings: any[] }) {
  const t = useTranslations('compare')
  const [saving, setSaving] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)
  const [saved, setSaved] = useState(false)

  if (listings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground">{t('no_vehicles')}</p>
      </div>
    )
  }

  const bestPriceIndex = listings.length > 1
    ? listings.indexOf(listings.reduce((min, l) => l.price < min.price ? l : min))
    : null

  const handleSave = async () => {
    if (!saveName.trim()) return
    setSaving(true)
    try {
      await saveComparison(saveName.trim(), listings.map((l: any) => l.id))
      setSaved(true)
      setShowSaveInput(false)
    } catch {} finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        {!saved && (
          <div className="flex items-center gap-2">
            {showSaveInput ? (
              <div className="flex gap-2">
                <Input
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder={t('save_name_placeholder')}
                  className="w-48"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
                />
                <Button size="sm" onClick={handleSave} disabled={saving || !saveName.trim()}>{t('save_comparison')}</Button>
                <Button size="sm" variant="outline" onClick={() => setShowSaveInput(false)}>{t('cancel')}</Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowSaveInput(true)}>{t('save_comparison')}</Button>
            )}
          </div>
        )}
        {saved && <p className="text-sm text-green-600">{t('comparison_saved')}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left font-medium text-muted-foreground w-[150px] border-b"></th>
              {listings.map((l: any) => {
                const vehicle = l.vehicle
                const primaryImage = vehicle?.images?.find((img: any) => img.is_primary) || vehicle?.images?.[0]
                return (
                  <th key={l.id} className="p-3 text-center border-b">
                    <a href={`/listings/${l.slug}`} className="block hover:opacity-80">
                      <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden mb-2">
                        {primaryImage ? (
                          <img src={primaryImage.url} alt={vehicle?.make?.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">{t('no_image')}</div>
                        )}
                      </div>
                      <p className="font-semibold">{vehicle?.make?.name} {vehicle?.model?.name}</p>
                      <p className="text-lg font-bold text-primary">{formatPrice(l.price)}</p>
                      {bestPriceIndex !== null && listings.indexOf(l) === bestPriceIndex && listings.length > 1 && (
                        <span className="text-xs text-green-600 font-medium">{t('best_price')}</span>
                      )}
                    </a>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 text-muted-foreground font-medium">{t('city')}</td>
              {listings.map((l: any) => (
                <td key={l.id} className="p-3 text-center">{l.city?.name || '-'}</td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-3 text-muted-foreground font-medium">{t('seller')}</td>
              {listings.map((l: any) => (
                <td key={l.id} className="p-3 text-center">{l.seller?.full_name || t('anonymous')}</td>
              ))}
            </tr>
            {SPECS.map((spec) => {
              const bestIndex = findBestIndex(listings, spec)
              return (
                <tr key={spec.key} className="border-b hover:bg-muted/30">
                  <td className="p-3 text-muted-foreground font-medium">{t(spec.labelKey)}</td>
                  {listings.map((l: any, idx: number) => {
                    const value = getSpecValue(l.vehicle, spec)
                    const isBest = bestIndex !== null && idx === bestIndex
                    return (
                      <td
                        key={l.id}
                        className={`p-3 text-center ${isBest ? 'bg-green-50 text-green-700 font-medium' : ''}`}
                      >
                        {value != null ? String(value) : '-'}
                        {isBest && <span className="block text-xs text-green-600">{t('best')}</span>}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            <tr className="border-b">
              <td className="p-3 text-muted-foreground font-medium">{t('description')}</td>
              {listings.map((l: any) => (
                <td key={l.id} className="p-3 text-center text-xs max-w-xs">
                  <p className="line-clamp-4">{l.description || '-'}</p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
