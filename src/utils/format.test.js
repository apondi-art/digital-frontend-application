import { describe, it, expect } from 'vitest'
import { formatNaira, formatDate, statusMeta } from './format'

describe('formatNaira', () => {
  it('formats zero as ₦0.00', () => {
    const result = formatNaira(0)
    expect(result).toContain('0')
    expect(result).toContain('₦')
  })

  it('formats a large number with commas', () => {
    const result = formatNaira(1000000)
    expect(result).toContain('1,000,000')
  })

  it('formats a typical transfer amount', () => {
    const result = formatNaira(5000)
    expect(result).toContain('5,000')
  })

  it('handles null without throwing', () => {
    expect(() => formatNaira(null)).not.toThrow()
  })

  it('handles undefined without throwing', () => {
    expect(() => formatNaira(undefined)).not.toThrow()
  })
})

describe('formatDate', () => {
  it('returns — for null', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('returns — for undefined', () => {
    expect(formatDate(undefined)).toBe('—')
  })

  it('formats a valid ISO date string', () => {
    const result = formatDate('2024-06-15T10:30:00Z')
    expect(result).toBeTruthy()
    expect(result).not.toBe('—')
    // Should contain the year
    expect(result).toContain('2024')
  })

  it('returns the original string for an invalid date', () => {
    const bad = 'not-a-date'
    const result = formatDate(bad)
    // Should not throw and should return something
    expect(result).toBeTruthy()
  })
})

describe('statusMeta', () => {
  it('returns SUCCESSFUL meta with a label', () => {
    const meta = statusMeta('SUCCESSFUL')
    expect(meta.label).toBeTruthy()
    expect(meta.colour).toBeTruthy()
    expect(meta.label.toLowerCase()).toContain('success')
  })

  it('returns PENDING meta', () => {
    const meta = statusMeta('PENDING')
    expect(meta.label.toLowerCase()).toContain('pending')
  })

  it('returns DECLINED meta', () => {
    const meta = statusMeta('DECLINED')
    expect(meta.label.toLowerCase()).toContain('declined')
  })

  it('returns a fallback for unknown status without throwing', () => {
    const meta = statusMeta('UNKNOWN_STATUS_XYZ')
    expect(meta).toBeTruthy()
    expect(meta.label).toBeTruthy()
    expect(meta.colour).toBeTruthy()
  })

  it('handles null without throwing', () => {
    expect(() => statusMeta(null)).not.toThrow()
  })
})
