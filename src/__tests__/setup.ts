import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('next-intl', () => ({
  useLocale: () => 'ar',
  useTranslations: () => (key: string) => key,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/ar',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ locale: 'ar' }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createBrowserSupabaseClient: () => ({
    auth: {
      getUser: vi.fn(),
      signInWithOtp: vi.fn(),
      verifyOtp: vi.fn(),
      signOut: vi.fn(),
    },
  }),
}))

/**
 * Creates a thenable query builder that returns this._resolveValue when awaited.
 * All query methods return the builder for chaining.
 * Set _resolveValue to control what data the query returns.
 */
function createQueryBuilder(resolveValue: any = { data: null, error: null }) {
  const methods: Record<string, any> = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    neq: vi.fn(),
    in: vi.fn(),
    not: vi.fn(),
    limit: vi.fn(),
    order: vi.fn(),
    maybeSingle: vi.fn(),
    single: vi.fn(),
  }

  const builder = new Proxy(methods, {
    get(target, prop) {
      if (prop === 'then') {
        // When awaited, resolve with _resolveValue
        return (resolve: any, reject: any) =>
          Promise.resolve(builder._resolveValue).then(resolve, reject)
      }
      if (prop === '_resolveValue') return resolveValue
      const val = (target as any)[prop]
      if (typeof val === 'function') {
        return (...args: any[]) => {
          val(...args)
          return builder
        }
      }
      return val
    },
  })

  return builder
}

vi.mock('@/lib/supabase/server', () => {
  // Singleton mock — all callers share the same instance
  const mockClient = {
    auth: {
      getUser: vi.fn(),
      admin: { getUserById: vi.fn() },
    },
    from: vi.fn(() => createQueryBuilder()),
  }

  return {
    createServerSupabaseClient: () => mockClient,
    /** Test helper to reset from() return queue */
    __resetFromMock: () => {
      mockClient.from.mockReset()
      mockClient.from.mockImplementation(() => createQueryBuilder())
    },
  }
})
