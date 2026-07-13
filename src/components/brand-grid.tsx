'use client'

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import Link from 'next/link'

interface Brand {
  name: string
  img: string
}

interface BrandGridProps {
  brands: Brand[]
  locale: string
}

export function BrandGrid({ brands, locale }: BrandGridProps) {
  const [expanded, setExpanded] = useState(false)
  const [colsPerRow, setColsPerRow] = useState(0)
  const measureRef = useRef<HTMLDivElement>(null)

  const measureColumns = useCallback(() => {
    const container = measureRef.current
    if (!container || container.children.length === 0) return

    const firstTop = (container.children[0] as HTMLElement).offsetTop
    let count = 0
    for (let i = 0; i < container.children.length; i++) {
      if ((container.children[i] as HTMLElement).offsetTop === firstTop) {
        count++
      } else {
        break
      }
    }
    setColsPerRow(count)
  }, [])

  useLayoutEffect(() => {
    measureColumns()
  }, [measureColumns])

  useEffect(() => {
    const container = measureRef.current
    if (!container) return

    const ro = new ResizeObserver(measureColumns)
    ro.observe(container)
    return () => ro.disconnect()
  }, [measureColumns])

  const visibleBrands = colsPerRow === 0
    ? []
    : expanded
      ? brands
      : brands.slice(0, colsPerRow)

  return (
    <section className="mt-8 sm:mt-12 px-4">
      <div className="max-w-[1320px] mx-auto relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#154F9C] text-lg sm:text-xl font-bold">
            تصفح السيارات حسب الماركة
          </h2>
        </div>

        <div
          ref={measureRef}
          aria-hidden="true"
          className="flex flex-wrap gap-[12px]"
          style={{
            position: 'absolute',
            visibility: 'hidden',
            pointerEvents: 'none',
            width: '100%',
          }}
        >
          {brands.map((brand) => (
            <div key={brand.name} style={{ width: '88px', height: '80px', flexShrink: 0 }} />
          ))}
        </div>

        <div className="flex flex-wrap gap-[12px]">
          {visibleBrands.map((brand) => (
            <Link
              key={brand.name}
              href={`/${locale}/listings`}
              className="flex flex-col items-center gap-1 p-2 sm:p-3 rounded-2xl border border-gray-100 bg-white hover:border-[#f1cd31]/50 hover:shadow-md transition-all duration-200 flex-shrink-0"
              style={{ width: '88px' }}
            >
              <div className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center">
                <img src={brand.img} alt={brand.name} className="h-full w-full object-contain" loading="lazy" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        {colsPerRow > 0 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-sm text-[#154F9C] font-medium underline underline-offset-2 hover:text-[#0d3a7a] transition-colors"
            >
              {expanded ? 'إخفاء الماركات' : 'شاهد جميع الماركات'}
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/${locale}/listings`} className="text-xs text-gray-500 hover:text-[#154F9C] px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#154F9C]/30 transition-colors">
            جميع السيارات المستعملة
          </Link>
          <Link href={`/${locale}/listings`} className="text-xs text-gray-500 hover:text-[#154F9C] px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#154F9C]/30 transition-colors">
            جميع السيارات الجديدة
          </Link>
          <Link href={`/${locale}/listings`} className="text-xs text-gray-500 hover:text-[#154F9C] px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#154F9C]/30 transition-colors">
            جميع السيارات
          </Link>
        </div>
      </div>
    </section>
  )
}
