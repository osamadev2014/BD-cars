const store = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const DEFAULTS: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 60,
}

export function checkRateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetAt: number } {
  const { windowMs, maxRequests } = { ...DEFAULTS, ...config }
  const now = Date.now()
  const record = store.get(key)

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  record.count++
  const remaining = Math.max(0, maxRequests - record.count)

  if (record.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt }
  }

  return { allowed: true, remaining, resetAt: record.resetAt }
}

export function rateLimitHeaders(result: { allowed: boolean; remaining: number; resetAt: number }) {
  return {
    'X-RateLimit-Limit': '60',
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  }
}
