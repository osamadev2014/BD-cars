import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parsePagination, parseSort, badRequest, notFound, corsHeaders } from '@/lib/api-helpers'

describe('parsePagination', () => {
  it('returns defaults when no params', () => {
    const params = new URLSearchParams()
    const result = parsePagination(params)
    expect(result).toEqual({ page: 1, perPage: 20, offset: 0 })
  })

  it('parses custom page and per_page', () => {
    const params = new URLSearchParams({ page: '3', per_page: '10' })
    const result = parsePagination(params)
    expect(result).toEqual({ page: 3, perPage: 10, offset: 20 })
  })

  it('clamps page to minimum 1', () => {
    const params = new URLSearchParams({ page: '0' })
    expect(parsePagination(params).page).toBe(1)
  })

  it('clamps negative page to 1', () => {
    const params = new URLSearchParams({ page: '-5' })
    expect(parsePagination(params).page).toBe(1)
  })

  it('clamps perPage to max 100', () => {
    const params = new URLSearchParams({ per_page: '200' })
    expect(parsePagination(params).perPage).toBe(100)
  })

  it('clamps perPage to min 1', () => {
    const params = new URLSearchParams({ per_page: '0' })
    expect(parsePagination(params).perPage).toBe(1)
  })

  it('handles non-numeric values', () => {
    const params = new URLSearchParams({ page: 'abc', per_page: 'xyz' })
    const result = parsePagination(params)
    expect(result).toEqual({ page: 1, perPage: 20, offset: 0 })
  })

  it('calculates offset correctly for page 5 with limit 25', () => {
    const params = new URLSearchParams({ page: '5', per_page: '25' })
    expect(parsePagination(params).offset).toBe(100)
  })
})

describe('parseSort', () => {
  it('uses defaults when no params', () => {
    const params = new URLSearchParams()
    const result = parseSort(params, ['name', 'created_at'])
    expect(result).toEqual({ field: 'created_at', dir: 'desc' })
  })

  it('parses sort_by param', () => {
    const params = new URLSearchParams({ sort_by: 'name_asc' })
    const result = parseSort(params, ['name', 'created_at'])
    expect(result).toEqual({ field: 'name', dir: 'asc' })
  })

  it('defaults to desc when not asc', () => {
    const params = new URLSearchParams({ sort_by: 'name_desc' })
    const result = parseSort(params, ['name', 'created_at'])
    expect(result).toEqual({ field: 'name', dir: 'desc' })
  })

  it('falls back to default field if field not allowed', () => {
    const params = new URLSearchParams({ sort_by: 'nonexistent_asc' })
    const result = parseSort(params, ['name', 'created_at'])
    expect(result.field).toBe('created_at')
  })

  it('handles single word sort (no direction)', () => {
    const params = new URLSearchParams({ sort_by: 'price' })
    const result = parseSort(params, ['price', 'name'], 'name')
    expect(result.field).toBe('price')
    expect(result.dir).toBe('desc')
  })

  it('uses custom default field and direction', () => {
    const params = new URLSearchParams()
    const result = parseSort(params, ['price'], 'price', 'asc')
    expect(result).toEqual({ field: 'price', dir: 'asc' })
  })
})

describe('badRequest', () => {
  it('returns 400 status', () => {
    const res = badRequest('Invalid input')
    expect(res.status).toBe(400)
  })

  it('returns JSON with error message', async () => {
    const res = badRequest('Something wrong')
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.error).toBe('Something wrong')
  })
})

describe('notFound', () => {
  it('returns 404 status', () => {
    const res = notFound()
    expect(res.status).toBe(404)
  })

  it('returns default message', async () => {
    const res = notFound()
    const body = await res.json()
    expect(body.error).toBe('Not found')
  })

  it('accepts custom message', async () => {
    const res = notFound('Vehicle not found')
    const body = await res.json()
    expect(body.error).toBe('Vehicle not found')
  })
})

describe('corsHeaders', () => {
  it('returns wildcard for null origin', () => {
    const headers = corsHeaders(null)
    expect(headers['Access-Control-Allow-Origin']).toBe('*')
  })

  it('returns wildcard for unknown origin', () => {
    const headers = corsHeaders('https://evil.com')
    expect(headers['Access-Control-Allow-Origin']).toBe('*')
  })

  it('allows bd.evico.sa origin', () => {
    const headers = corsHeaders('https://bd.evico.sa')
    expect(headers['Access-Control-Allow-Origin']).toBe('https://bd.evico.sa')
  })

  it('allows localhost origin', () => {
    const headers = corsHeaders('http://localhost:3000')
    expect(headers['Access-Control-Allow-Origin']).toBe('http://localhost:3000')
  })

  it('includes required CORS headers', () => {
    const headers = corsHeaders()
    expect(headers['Access-Control-Allow-Methods']).toContain('GET')
    expect(headers['Access-Control-Allow-Methods']).toContain('POST')
    expect(headers['Access-Control-Allow-Headers']).toContain('Content-Type')
    expect(headers['Access-Control-Allow-Headers']).toContain('x-api-key')
    expect(headers['Access-Control-Max-Age']).toBe('86400')
  })
})
