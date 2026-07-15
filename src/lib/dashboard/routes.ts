import type { OrgTypeSlug } from '@/config/dashboard'

export function dashboardRoute(locale: string, orgSlug: OrgTypeSlug, page: string = 'overview'): string {
  return `/${locale}/dashboard/${orgSlug}/${page}`
}

export function overviewRoute(locale: string, orgSlug: OrgTypeSlug): string {
  return dashboardRoute(locale, orgSlug, 'overview')
}

export function orgSelectRoute(locale: string): string {
  return `/${locale}/business/select`
}

export function loginRoute(locale: string, redirect?: string): string {
  const base = `/${locale}/login`
  return redirect ? `${base}?redirect=${encodeURIComponent(redirect)}` : base
}

export function isDashboardPath(path: string): boolean {
  return path.startsWith('/dashboard/')
}
