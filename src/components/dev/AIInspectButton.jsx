'use client'

import { useState, useEffect, useCallback } from 'react'

export default function AIInspectButton() {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const getElementInfo = useCallback((el) => {
    const tag = el.tagName.toLowerCase()
    const id = el.id ? `#${el.id}` : ''
    const classes = el.className && typeof el.className === 'string'
      ? el.className.trim().split(/\s+/).filter(Boolean)
      : []
    const classStr = classes.length > 0 ? `.${classes.join('.')}` : ''

    let selector = tag + id + classStr
    let target = el
    const path = []
    while (target && target.nodeType === 1) {
      let sel = target.tagName.toLowerCase()
      if (target.id) { path.unshift(`#${target.id}`); break }
      const cls = target.className && typeof target.className === 'string'
        ? target.className.trim().split(/\s+/).filter(c => !c.startsWith('_')).slice(0, 2).join('.')
        : ''
      if (cls) sel += '.' + cls
      const parent = target.parentElement
      if (parent) {
        const siblings = [...parent.children].filter(c => c.tagName === target.tagName)
        if (siblings.length > 1) sel += `:nth-child(${[...parent.children].indexOf(target) + 1})`
      }
      path.unshift(sel)
      target = target.parentElement
    }
    const fullSelector = path.join(' > ')

    const rect = el.getBoundingClientRect()
    const text = (el.textContent || '').trim().slice(0, 120)
    const href = el.getAttribute('href') || ''
    const src = el.getAttribute('src') || ''
    const dataAttrs = {}
    for (const attr of el.attributes) {
      if (attr.name.startsWith('data-')) dataAttrs[attr.name] = attr.value
    }

    const info = {
      selector: fullSelector,
      tag,
      id: el.id || null,
      classes,
      text,
      href,
      src,
      data: Object.keys(dataAttrs).length > 0 ? dataAttrs : null,
      size: { width: Math.round(rect.width), height: Math.round(rect.height) },
      position: { x: Math.round(rect.left), y: Math.round(rect.top) },
      isVisible: rect.width > 0 && rect.height > 0,
      isClickable: !!(
        el.tagName === 'A' || el.tagName === 'BUTTON' ||
        el.getAttribute('role') === 'button' ||
        el.onclick ||
        el.closest('a') ||
        el.closest('button')
      ),
    }

    return info
  }, [])

  useEffect(() => {
    if (!active) return

    const highlight = document.createElement('div')
    highlight.style.cssText = 'position:fixed;pointer-events:none;z-index:999999;background:rgba(59,130,246,.15);border:2px solid #3b82f6;transition:all .08s ease;display:none'
    document.body.appendChild(highlight)

    const tooltip = document.createElement('div')
    tooltip.style.cssText = 'position:fixed;pointer-events:none;z-index:999999;background:#1e293b;color:#e2e8f0;padding:6px 12px;border-radius:6px;font:12px/1.5 monospace;display:none;white-space:nowrap;max-width:520px;overflow:hidden;text-overflow:ellipsis;box-shadow:0 4px 12px rgba(0,0,0,.25)'
    document.body.appendChild(tooltip)

    const onMove = (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el || el === document.body || el === document.documentElement || el === highlight || el === tooltip) {
        highlight.style.display = 'none'
        tooltip.style.display = 'none'
        return
      }
      const rect = el.getBoundingClientRect()
      highlight.style.display = 'block'
      highlight.style.left = rect.left + 'px'
      highlight.style.top = rect.top + 'px'
      highlight.style.width = rect.width + 'px'
      highlight.style.height = rect.height + 'px'
      const info = getElementInfo(el)
      const label = `${info.tag}${info.classes.length ? '.' + info.classes.join('.') : ''}`
      tooltip.style.display = 'block'
      tooltip.textContent = `AI Inspect: ${label}`
      tooltip.style.left = Math.min(e.clientX + 14, window.innerWidth - tooltip.offsetWidth - 12) + 'px'
      tooltip.style.top = (e.clientY - 34 > 0 ? e.clientY - 34 : e.clientY + 22) + 'px'
    }

    const onClick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el || el === document.body || el === document.documentElement) return
      const info = getElementInfo(el)
      const output = JSON.stringify(info, null, 2)
      navigator.clipboard.writeText(output).then(() => {
        alert(`✅ AI Inspect — نسخ المعلومات:\n\n${output}`)
      }).catch(() => {
        alert(`📋 AI Inspect:\n\n${output}`)
      })
      cleanup()
      setActive(false)
      return false
    }

    const onKey = (e) => {
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
  }, [active, getElementInfo])

  if (!mounted) return null
  if (process.env.NODE_ENV !== 'development') return null

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
      {active && (
        <span
          style={{
            background: '#fff',
            color: '#1e293b',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,.15)',
            userSelect: 'none',
          }}
        >
          Click any element to inspect
        </span>
      )}
      <button
        onClick={() => setActive(v => !v)}
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: active ? '2px solid #ef4444' : '2px solid #3b82f6',
          background: active ? '#ef4444' : '#fff',
          color: active ? '#fff' : '#3b82f6',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 700,
          boxShadow: '0 2px 12px rgba(0,0,0,.2)',
          transition: 'all .2s',
          flexShrink: 0,
        }}
        title={active ? 'Cancel (Esc)' : 'AI Inspect'}
      >
        {active ? '✕' : 'AI'}
      </button>
    </div>
  )
}
