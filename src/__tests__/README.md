# Ryon Test Infrastructure

## Running Tests

```bash
# Run all unit tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests (requires dev server)
npm run test:e2e

# Open Vitest UI
npm run test:ui
```

## Test Structure

```
src/__tests__/
  setup.ts              # Global test setup (mocks, imports)
  utils.test.ts         # Utility function tests (cn, formatPrice, slugify, etc.)
  api-helpers.test.ts   # API helper tests (parsePagination, corsHeaders, etc.)
  validation.test.ts    # Zod schema validation tests
  rate-limit.test.ts    # Rate limiter tests
  components/
    button.test.tsx     # Button component tests
    badge.test.tsx      # Badge component tests
    dialog.test.tsx     # Dialog component tests

e2e/
  auth.spec.ts          # Auth flow E2E tests
```

## Mocking Approach

### Global Mocks (in `setup.ts`)

- **next-intl**: `useLocale` returns `'ar'`, `useTranslations` returns the key
- **next/navigation**: `useRouter`, `usePathname`, `useSearchParams`, `useParams`
- **Supabase client/server**: Mocked auth and database methods

### Per-Test Mocks

Use `vi.mock()` in individual test files for module-specific mocking.
Use `vi.spyOn()` for spying on method calls.

## Adding New Tests

1. Create a `.test.ts` file alongside the source or in `src/__tests__/`
2. For component tests, use `.test.tsx` and import from `@testing-library/react`
3. Run `npm run test` to verify

### Example

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/my-module'

describe('myFunction', () => {
  it('does something', () => {
    expect(myFunction('input')).toBe('output')
  })
})
```

## E2E vs Unit Test Strategy

| Concern | Tool | Location |
|---------|------|----------|
| Pure logic, utilities, validation | Vitest | `src/__tests__/` |
| React components (render, interaction) | Vitest + Testing Library | `src/__tests__/components/` |
| Full user flows (auth, navigation, forms) | Playwright | `e2e/` |

- **Unit tests**: Fast, isolated, mock external deps. Aim for high coverage on lib/utils.
- **Component tests**: Render components, test user interactions, verify DOM output.
- **E2E tests**: Test real browser flows against running dev server. Use sparingly for critical paths.
