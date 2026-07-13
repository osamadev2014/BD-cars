'use client'

import { useState, useEffect, useCallback } from 'react'

export function DevElementPicker() {
  const [active, setActive] = useState(false)

  const getSelector = useCallback((el: Element): string => {
    if (el.id) return `#${el.id}`
    const path: string[] = []
    let target: Element | null = el
    while (target && target.nodeType === 1) {
      let sel = target.tagName.toLowerCase()
      if (target.id) { path.unshift(`#${target.id}`); break }
      if ((target as HTMLElement).className && typeof (target as HTMLElement).className === 'string') {
        const cls = (target as HTMLElement).className.trim().split(/\s+/).filter(c => !c.startsWith('_') && c !== 'undefined').slice(0, 2).join('.')
        if (cls) sel += '.' + cls
      }
      const parent = target.parentElement
      if (parent) {
        const siblings = [...parent.children].filter(c => c.tagName === target!.tagName)
        if (siblings.length > 1) sel += `:nth-child(${[...parent.children].indexOf(target) + 1})`
      }
      path.unshift(sel)
      target = target.parentElement
    }
    return path.join(' > ')
  }, [])

  useEffect(() => {
    if (!active) return

    const highlight = document.createElement('div')
    highlight.style.cssText = 'position:fixed;pointer-events:none;z-index:999999;background:rgba(60,86,212,.2);border:2px solid #3c56d4;transition:all .1s;display:none'
    document.body.appendChild(highlight)

    const tooltip = document.createElement('div')
    tooltip.style.cssText = 'position:fixed;pointer-events:none;z-index:999999;background:#1a1a2e;color:#fff;padding:4px 10px;border-radius:4px;font:12px monospace;display:none;white-space:nowrap;max-width:500px;overflow:hidden;text-overflow:ellipsis'
    document.body.appendChild(tooltip)

    const onMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el || el === document.body || el === document.documentElement) {
        highlight.style.display = 'none'; tooltip.style.display = 'none'; return
      }
      const rect = el.getBoundingClientRect()
      highlight.style.display = 'block'
      highlight.style.left = rect.left + 'px'
      highlight.style.top = rect.top + 'px'
      highlight.style.width = rect.width + 'px'
      highlight.style.height = rect.height + 'px'
      const sel = getSelector(el)
      tooltip.style.display = 'block'
      tooltip.textContent = sel
      tooltip.style.left = Math.min(e.clientX + 12, window.innerWidth - tooltip.offsetWidth - 10) + 'px'
      tooltip.style.top = (e.clientY - 30 > 0 ? e.clientY - 30 : e.clientY + 20) + 'px'
    }

    const onClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el || el === document.body || el === document.documentElement) return
      const sel = getSelector(el)
      navigator.clipboard.writeText(sel).then(() => {
        alert(`✅ نسخ: ${sel}`)
      }).catch(() => {
        alert(`📋 ${sel}`)
      })
      cleanup()
      setActive(false)
      return false
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { cleanup(); setActive(false) }
    }

    const cleanup = () => {
      document.removeEventListener('mousemove', onMove, true)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKey)
      document.body.style.cursor = ''
      highlight.remove()
      tooltip.remove()
    }

    document.addEventListener('mousemove', onMove, true)
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKey)
    document.body.style.cursor = 'crosshair'

    return cleanup
  }, [active, getSelector])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        direction: 'ltr',
      }}
    >
      <span
        style={{
          background: '#fff',
          color: '#1a1a2e',
          padding: '4px 10px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,.15)',
          opacity: active ? 1 : 0.7,
          transition: 'opacity .2s',
          userSelect: 'none',
        }}
      >
        {active ? '🟢 اختر عنصر' : '🎯 تحديد عنصر'}
      </span>
      <button
        onClick={() => setActive(v => !v)}
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: active ? '2px solid #e74c3c' : '2px solid #3c56d4',
          background: active ? '#e74c3c' : '#fff',
          color: active ? '#fff' : '#3c56d4',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,.2)',
          transition: 'all .2s',
          flexShrink: 0,
        }}
        title={active ? 'إلغاء التحديد (Esc)' : 'تحديد عنصر'}
      >
        {active ? '✕' : '🎯'}
      </button>
    </div>
  )
}
