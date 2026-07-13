import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { routing } from '@/i18n/config'
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit'
import type { Database } from '@/types/database'

const intlMiddleware = createIntlMiddleware(routing)

const PROTECTED_PATHS = [
  '/dashboard',
  '/admin',
  '/business/register',
]

function stripLocale(pathname: string): string {
  // Remove leading /ar or /en for path matching
  const match = pathname.match(/^\/(ar|en)(\/.*)?$/)
  return match ? (match[2] || '/') : pathname
}

const API_PATHS = [
  '/api/',
]

function isPathMatch(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname.startsWith(p))
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || '127.0.0.1'
}

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API routes must bypass intlMiddleware entirely — it redirects
  // /api/auth/dev-verify → /ar/api/auth/dev-verify (404)
  if (isPathMatch(pathname, API_PATHS) && !pathname.startsWith('/api/webhooks/')) {
    const ip = getClientIp(request)
    const rateKey = `${ip}:${pathname}`
    const rateResult = checkRateLimit(rateKey)

    if (!rateResult.allowed) {
      const headers = rateLimitHeaders(rateResult)
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { ...headers, ...securityHeaders } }
      )
    }

    const response = NextResponse.next()

    for (const [key, value] of Object.entries(securityHeaders)) {
      response.headers.set(key, value)
    }

    const rateHeaders = rateLimitHeaders(rateResult)
    for (const [key, value] of Object.entries(rateHeaders)) {
      response.headers.set(key, value)
    }

    return response
  }

  const response = intlMiddleware(request)

  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }

  response.headers.set(
    'Cache-Control',
    pathname.startsWith('/_next/static')
      ? 'public, max-age=31536000, immutable'
      : 'no-store, no-cache, must-revalidate, proxy-revalidate'
  )

  if (pathname === '/') {
    return response
  }

  const pathWithoutLocale = stripLocale(pathname)

  if (isPathMatch(pathWithoutLocale, PROTECTED_PATHS)) {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookies) {
            for (const { name, value, options } of cookies) {
              response.cookies.set(name, value, options)
            }
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const devSession = request.cookies.get('roin_dev_session')?.value

    if (!user && !devSession) {
      const locale = pathname.startsWith('/en') ? 'en' : 'ar'
      const loginUrl = new URL(`/${locale}/login`, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (pathWithoutLocale.startsWith('/admin')) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role:roles(name)')

      const isAdmin = (roles || []).some((r: any) =>
        ['admin', 'super_admin', 'system_owner'].includes(r.role?.name)
      )

      if (!isAdmin && !devSession) {
        const locale = pathname.startsWith('/en') ? 'en' : 'ar'
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
}
