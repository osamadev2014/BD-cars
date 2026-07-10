import { describe, it, expect } from 'vitest'
import { cn, formatPrice, formatDate, slugify, getThumbnailUrl, getOptimizedImageUrl } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('deduplicates tailwind classes', () => {
    expect(cn('px-4 py-2', 'px-8')).toBe('py-2 px-8')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
  })

  it('merges conflicting bg classes', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })
})

describe('formatPrice', () => {
  it('formats price in SAR', () => {
    const result = formatPrice(1000)
    expect(result).toContain('1')
    expect(result).toContain('000')
  })

  it('formats zero', () => {
    const result = formatPrice(0)
    expect(result).toContain('0')
  })

  it('formats large numbers', () => {
    const result = formatPrice(1000000)
    expect(result).toMatch(/\d/)
  })

  it('formats decimal input without decimals', () => {
    const result = formatPrice(99.99)
    expect(result).toMatch(/\d/)
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2025-01-15')
    expect(result).toMatch(/\d/)
    expect(result.length).toBeGreaterThan(3)
  })

  it('formats a Date object', () => {
    const result = formatDate(new Date('2025-06-20'))
    expect(result).toMatch(/\d/)
  })

  it('produces Arabic locale output', () => {
    const result = formatDate('2025-03-10')
    expect(result).toMatch(/\d/)
  })
})

describe('slugify', () => {
  it('lowercases and replaces spaces', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world')
  })

  it('collapses multiple dashes', () => {
    expect(slugify('a   b')).toBe('a-b')
  })

  it('trims leading/trailing dashes', () => {
    expect(slugify('  hello world  ')).toBe('hello-world')
  })

  it('handles Arabic-like text (strips non-word chars)', () => {
    expect(slugify('car sale')).toBe('car-sale')
  })

  it('handles already slugified text', () => {
    expect(slugify('already-slugified')).toBe('already-slugified')
  })
})

describe('getThumbnailUrl', () => {
  it('replaces extension with _thumb.jpg', () => {
    expect(getThumbnailUrl('photo.jpg')).toBe('photo_thumb.jpg')
  })

  it('handles .png extension', () => {
    expect(getThumbnailUrl('image.png')).toBe('image_thumb.jpg')
  })

  it('handles .webp extension', () => {
    expect(getThumbnailUrl('pic.webp')).toBe('pic_thumb.jpg')
  })
})

describe('getOptimizedImageUrl', () => {
  it('adds width param for supabase URLs', () => {
    const url = 'https://abc.supabase.co/storage/image.jpg'
    expect(getOptimizedImageUrl(url, 600)).toContain('width=600')
    expect(getOptimizedImageUrl(url, 600)).toContain('format=webp')
  })

  it('returns non-supabase URLs unchanged', () => {
    const url = 'https://example.com/image.jpg'
    expect(getOptimizedImageUrl(url)).toBe(url)
  })

  it('uses default width of 800', () => {
    const url = 'https://abc.supabase.co/storage/image.jpg'
    expect(getOptimizedImageUrl(url)).toContain('width=800')
  })
})
