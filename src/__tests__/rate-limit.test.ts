import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit'

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.restoreAllMocks()
  })

  it('allows request within limit', () => {
    const result = checkRateLimit('test-key', { windowMs: 60000, maxRequests: 5 })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('tracks multiple requests', () => {
    const key = 'multi-key'
    const config = { windowMs: 60000, maxRequests: 3 }

    const r1 = checkRateLimit(key, config)
    expect(r1.remaining).toBe(2)

    const r2 = checkRateLimit(key, config)
    expect(r2.remaining).toBe(1)

    const r3 = checkRateLimit(key, config)
    expect(r3.remaining).toBe(0)
    expect(r3.allowed).toBe(true)
  })

  it('blocks when over limit', () => {
    const key = 'limit-key'
    const config = { windowMs: 60000, maxRequests: 2 }

    checkRateLimit(key, config)
    checkRateLimit(key, config)
    const blocked = checkRateLimit(key, config)

    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
  })

  it('resets after window expires', () => {
    const key = 'reset-key'
    const config = { windowMs: 1000, maxRequests: 1 }

    checkRateLimit(key, config)
    const blocked = checkRateLimit(key, config)
    expect(blocked.allowed).toBe(false)

    vi.advanceTimersByTime(1001)

    const afterReset = checkRateLimit(key, config)
    expect(afterReset.allowed).toBe(true)
    expect(afterReset.remaining).toBe(0)
  })

  it('uses default config when none provided', () => {
    const result = checkRateLimit('default-key')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(59)
  })

  it('tracks different keys independently', () => {
    const config = { windowMs: 60000, maxRequests: 1 }

    checkRateLimit('key-a', config)
    const a = checkRateLimit('key-a', config)
    expect(a.allowed).toBe(false)

    const b = checkRateLimit('key-b', config)
    expect(b.allowed).toBe(true)
  })
})

describe('rateLimitHeaders', () => {
  it('returns correct header format', () => {
    const result = { allowed: true, remaining: 55, resetAt: Date.now() + 60000 }
    const headers = rateLimitHeaders(result)

    expect(headers['X-RateLimit-Limit']).toBe('60')
    expect(headers['X-RateLimit-Remaining']).toBe('55')
    expect(headers['X-RateLimit-Reset']).toBeDefined()
    expect(Number(headers['X-RateLimit-Reset'])).toBeGreaterThan(0)
  })

  it('converts resetAt to seconds', () => {
    const resetAtMs = 1700000060000
    const headers = rateLimitHeaders({ allowed: true, remaining: 30, resetAt: resetAtMs })
    expect(headers['X-RateLimit-Reset']).toBe(String(Math.ceil(resetAtMs / 1000)))
  })

  it('handles zero remaining', () => {
    const headers = rateLimitHeaders({ allowed: false, remaining: 0, resetAt: Date.now() })
    expect(headers['X-RateLimit-Remaining']).toBe('0')
  })
})
