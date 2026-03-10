import { describe, it, expect } from 'vitest'
import { createMediaQueries, createBetweenQuery } from '../media-queries'

describe('createMediaQueries', () => {
  it('creates media query strings for each breakpoint', () => {
    const result = createMediaQueries({ xs: 0, md: 768, lg: 1024 })
    expect(result.xs).toBeDefined()
    expect(result.md).toBeDefined()
    expect(result.lg).toBeDefined()
  })

  it('returns empty string for smallest breakpoint (0)', () => {
    const result = createMediaQueries({ xs: 0 })
    expect(result.xs).toBe('')
  })

  it('creates min-width media query for non-zero breakpoint', () => {
    const result = createMediaQueries({ md: 768 })
    expect(result.md).toContain('@media')
    expect(result.md).toContain('min-width')
    // 768 / 16 = 48em
    expect(result.md).toContain('48em')
  })

  it('calculates em values correctly', () => {
    const result = createMediaQueries({ lg: 1024 })
    // 1024 / 16 = 64em
    expect(result.lg).toContain('64em')
  })

  it('respects custom rootSize', () => {
    const result = createMediaQueries({ md: 768 }, 10)
    // 768 / 10 = 76.8em
    expect(result.md).toContain('76.8em')
  })

  it('handles multiple breakpoints', () => {
    const result = createMediaQueries({
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    })
    expect(result.xs).toBe('')
    expect(result.sm).toBe('@media (min-width: 36em)')
    expect(result.md).toBe('@media (min-width: 48em)')
    expect(result.lg).toBe('@media (min-width: 62em)')
    expect(result.xl).toBe('@media (min-width: 75em)')
  })

  it('handles empty breakpoints', () => {
    const result = createMediaQueries({})
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('uses default rootSize of 16', () => {
    const withDefault = createMediaQueries({ md: 768 })
    const withExplicit = createMediaQueries({ md: 768 }, 16)
    expect(withDefault.md).toBe(withExplicit.md)
  })
})

describe('createBetweenQuery', () => {
  it('creates a between media query', () => {
    const result = createBetweenQuery(768, 1024)
    expect(result).toContain('@media')
    expect(result).toContain('min-width')
    expect(result).toContain('max-width')
  })

  it('calculates min em correctly', () => {
    const result = createBetweenQuery(768, 1024)
    // 768 / 16 = 48em
    expect(result).toContain('48em')
  })

  it('subtracts 0.02px from max for non-overlap', () => {
    const result = createBetweenQuery(768, 1024)
    // (1024 - 0.02) / 16 = 63.99875em
    expect(result).toContain('63.99875em')
  })

  it('respects custom rootSize', () => {
    const result = createBetweenQuery(768, 1024, 10)
    // 768 / 10 = 76.8em
    expect(result).toContain('76.8em')
    // (1024 - 0.02) / 10 = 102.398em
    expect(result).toContain('102.398em')
  })

  it('handles zero min', () => {
    const result = createBetweenQuery(0, 576)
    expect(result).toContain('min-width: 0em')
    // (576 - 0.02) / 16 = 35.99875em
    expect(result).toContain('35.99875em')
  })

  it('uses default rootSize of 16', () => {
    const withDefault = createBetweenQuery(768, 1024)
    const withExplicit = createBetweenQuery(768, 1024, 16)
    expect(withDefault).toBe(withExplicit)
  })
})
