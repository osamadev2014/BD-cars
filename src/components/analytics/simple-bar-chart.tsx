'use client'

import { useTranslations } from 'next-intl'

export function SimpleBarChart({
  data,
  height = 160,
  barColor = 'hsl(var(--primary))',
}: {
  data: { date: string; count: number }[]
  height?: number
  barColor?: string
}) {
  const t = useTranslations('analytics')
  const max = Math.max(...data.map(d => d.count), 1)
  const padding = 2
  const barWidth = Math.max(4, (100 - padding * data.length) / data.length)

  if (data.length === 0) return null

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{t('today')}</span>
        <span>{max > 0 ? `${max}` : ''}</span>
      </div>
      <svg viewBox={`0 0 ${data.length * 12} ${height}`} className="w-full" style={{ height }}>
        {data.map((d, i) => {
          const barH = max > 0 ? (d.count / max) * (height - 16) : 0
          const x = i * 12 + 0.5
          const y = height - 8 - barH
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={y}
                width={8}
                height={barH || 1}
                fill={barColor}
                rx={2}
                opacity={d.count > 0 ? 0.8 : 0.15}
              />
              {i % 5 === 0 && (
                <text
                  x={x + 4}
                  y={height - 1}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize="8"
                >
                  {d.date.slice(5)}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
