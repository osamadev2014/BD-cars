import { describe, it, expect } from 'vitest'
import { phoneSchema, otpSchema, uuidSchema, paginationSchema } from '@/lib/validation'

describe('phoneSchema', () => {
  it('accepts valid Saudi phone (05xxxxxxxx)', () => {
    expect(phoneSchema.parse('0512345678')).toBe('0512345678')
  })

  it('accepts phone without leading zero', () => {
    expect(phoneSchema.parse('512345678')).toBe('512345678')
  })

  it('rejects phone with letters', () => {
    expect(() => phoneSchema.parse('05123abcde')).toThrow()
  })

  it('rejects too short phone', () => {
    expect(() => phoneSchema.parse('0512345')).toThrow()
  })

  it('rejects too long phone', () => {
    expect(() => phoneSchema.parse('05123456789')).toThrow()
  })

  it('rejects phone not starting with 0 or 5', () => {
    expect(() => phoneSchema.parse('0312345678')).toThrow()
  })

  it('rejects empty string', () => {
    expect(() => phoneSchema.parse('')).toThrow()
  })
})

describe('otpSchema', () => {
  it('accepts valid 4-digit OTP', () => {
    expect(otpSchema.parse('1234')).toBe('1234')
  })

  it('accepts all zeros', () => {
    expect(otpSchema.parse('0000')).toBe('0000')
  })

  it('rejects OTP shorter than 4 digits', () => {
    expect(() => otpSchema.parse('123')).toThrow()
  })

  it('rejects OTP longer than 4 digits', () => {
    expect(() => otpSchema.parse('12345')).toThrow()
  })

  it('rejects OTP with letters', () => {
    expect(() => otpSchema.parse('12ab')).toThrow()
  })

  it('rejects empty string', () => {
    expect(() => otpSchema.parse('')).toThrow()
  })
})

describe('uuidSchema', () => {
  it('accepts valid UUID v4', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    expect(uuidSchema.parse(uuid)).toBe(uuid)
  })

  it('rejects non-UUID strings', () => {
    expect(() => uuidSchema.parse('not-a-uuid')).toThrow()
  })

  it('rejects malformed UUID', () => {
    expect(() => uuidSchema.parse('550e8400-e29b-41d4-a716')).toThrow()
  })

  it('rejects empty string', () => {
    expect(() => uuidSchema.parse('')).toThrow()
  })
})

describe('paginationSchema', () => {
  it('uses defaults when not provided', () => {
    const result = paginationSchema.parse({})
    expect(result).toEqual({ page: 1, limit: 20 })
  })

  it('parses valid page and limit', () => {
    const result = paginationSchema.parse({ page: 3, limit: 50 })
    expect(result).toEqual({ page: 3, limit: 50 })
  })

  it('parses string numbers via coerce', () => {
    const result = paginationSchema.parse({ page: '5', limit: '10' })
    expect(result).toEqual({ page: 5, limit: 10 })
  })

  it('rejects page 0', () => {
    expect(() => paginationSchema.parse({ page: 0 })).toThrow()
  })

  it('rejects negative page', () => {
    expect(() => paginationSchema.parse({ page: -1 })).toThrow()
  })

  it('rejects limit over 100', () => {
    expect(() => paginationSchema.parse({ limit: 101 })).toThrow()
  })

  it('accepts max limit of 100', () => {
    const result = paginationSchema.parse({ limit: 100 })
    expect(result.limit).toBe(100)
  })

  it('rejects non-integer page', () => {
    expect(() => paginationSchema.parse({ page: 1.5 })).toThrow()
  })
})
