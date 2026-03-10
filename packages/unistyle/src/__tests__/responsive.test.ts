import { describe, it, expect } from 'vitest'
import { normalizeResponsive, makeResponsive } from '../responsive'
import type { ResponsiveValue } from '../responsive'

const bps = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 }

describe('normalizeResponsive', () => {
  it('expands scalar to all breakpoints', () => {
    const result = normalizeResponsive(16, bps)
    expect(result).toEqual({
      xs: 16,
      sm: 16,
      md: 16,
      lg: 16,
      xl: 16,
    })
  })

  it('expands string scalar to all breakpoints', () => {
    const result = normalizeResponsive('red', bps)
    expect(result).toEqual({
      xs: 'red',
      sm: 'red',
      md: 'red',
      lg: 'red',
      xl: 'red',
    })
  })

  it('expands null to all breakpoints', () => {
    const result = normalizeResponsive(null, bps)
    expect(result).toEqual({
      xs: null,
      sm: null,
      md: null,
      lg: null,
      xl: null,
    })
  })

  it('expands array to all breakpoints (treated as scalar)', () => {
    const arr = [1, 2, 3]
    const result = normalizeResponsive(arr, bps)
    expect(result.xs).toBe(arr)
    expect(result.md).toBe(arr)
  })

  it('inherits from previous breakpoint for partial objects', () => {
    const result = normalizeResponsive({ xs: 12, md: 16 }, bps)
    expect(result).toEqual({
      xs: 12,
      sm: 12,
      md: 16,
      lg: 16,
      xl: 16,
    })
  })

  it('handles object with all breakpoints', () => {
    const result = normalizeResponsive(
      { xs: 10, sm: 20, md: 30, lg: 40, xl: 50 },
      bps,
    )
    expect(result).toEqual({
      xs: 10,
      sm: 20,
      md: 30,
      lg: 40,
      xl: 50,
    })
  })

  it('skips breakpoints before first defined key', () => {
    const result = normalizeResponsive({ md: 16 }, bps)
    // xs and sm are not set because md is the first defined key
    expect(result).toEqual({
      md: 16,
      lg: 16,
      xl: 16,
    })
  })

  it('handles zero values correctly', () => {
    const result = normalizeResponsive({ xs: 0, md: 16 }, bps)
    expect(result).toEqual({
      xs: 0,
      sm: 0,
      md: 16,
      lg: 16,
      xl: 16,
    })
  })

  it('handles empty object', () => {
    const result = normalizeResponsive({}, bps)
    expect(result).toEqual({})
  })

  it('handles single breakpoint map', () => {
    const result = normalizeResponsive(42, { only: 0 })
    expect(result).toEqual({ only: 42 })
  })

  it('handles empty breakpoint map', () => {
    const result = normalizeResponsive(42, {})
    expect(result).toEqual({})
  })

  it('ignores keys not in breakpoint map', () => {
    const result = normalizeResponsive({ xs: 10, nonexistent: 99 } as any, bps)
    // nonexistent is ignored since it's not in sorted breakpoints
    expect(result).not.toHaveProperty('nonexistent')
    expect(result.xs).toBe(10)
  })
})

describe('makeResponsive', () => {
  it('generates plain CSS for scalar values', () => {
    const result = makeResponsive({ fontSize: 16, color: 'red' }, bps)
    expect(result).toContain('font-size: 16px')
    expect(result).toContain('color: red')
  })

  it('does not wrap smallest breakpoint in media query', () => {
    const result = makeResponsive({ fontSize: 16 }, bps)
    expect(result).not.toContain('@media')
    expect(result).toContain('font-size: 16px')
  })

  it('wraps non-zero breakpoint values in media queries', () => {
    const result = makeResponsive(
      { fontSize: { xs: 14, md: 18 } },
      bps,
    )
    expect(result).toContain('font-size: 14px')
    expect(result).toContain('@media (min-width: 48em)')
    expect(result).toContain('font-size: 18px')
  })

  it('deduplicates identical values across breakpoints', () => {
    // Same value for xs through xl - should only appear once
    const result = makeResponsive({ color: 'red' }, bps)
    const occurrences = result.split('color: red').length - 1
    expect(occurrences).toBe(1)
  })

  it('converts camelCase to kebab-case', () => {
    const result = makeResponsive({ backgroundColor: 'blue' }, bps)
    expect(result).toContain('background-color: blue')
    expect(result).not.toContain('backgroundColor')
  })

  it('converts number values to px', () => {
    const result = makeResponsive({ fontSize: 16 }, bps)
    expect(result).toContain('font-size: 16px')
  })

  it('passes string values through', () => {
    const result = makeResponsive({ display: 'flex' }, bps)
    expect(result).toContain('display: flex')
  })

  it('handles responsive object values', () => {
    const result = makeResponsive(
      { color: { xs: 'red', md: 'blue', xl: 'green' } },
      bps,
    )
    expect(result).toContain('color: red')
    expect(result).toContain('color: blue')
    expect(result).toContain('color: green')
  })

  it('handles multiple responsive properties', () => {
    const result = makeResponsive(
      {
        fontSize: { xs: 14, md: 18 },
        color: { xs: 'red', lg: 'blue' },
      },
      bps,
    )
    expect(result).toContain('font-size: 14px')
    expect(result).toContain('font-size: 18px')
    expect(result).toContain('color: red')
    expect(result).toContain('color: blue')
  })

  it('respects custom rootSize for media queries', () => {
    const result = makeResponsive({ color: { xs: 'red', md: 'blue' } }, bps, 10)
    // 768 / 10 = 76.8em
    expect(result).toContain('76.8em')
  })

  it('handles empty theme', () => {
    const result = makeResponsive({}, bps)
    expect(result).toBe('')
  })

  it('handles empty breakpoints', () => {
    const result = makeResponsive({ fontSize: 16 }, {})
    expect(result).toBe('')
  })

  it('groups multiple rules in same breakpoint', () => {
    const result = makeResponsive(
      {
        fontSize: { xs: 14, md: 18 },
        color: { xs: 'red', md: 'blue' },
      },
      bps,
    )
    // The md media query block should contain both properties
    const mdBlock = result.match(/@media.*?48em.*?\{([^}]+)\}/)
    expect(mdBlock).toBeTruthy()
    expect(mdBlock![1]).toContain('font-size: 18px')
    expect(mdBlock![1]).toContain('color: blue')
  })

  it('skips breakpoints with no rules', () => {
    const result = makeResponsive(
      { color: { xs: 'red', xl: 'blue' } },
      bps,
    )
    // Should not have media queries for sm, md, lg since color stays 'red'
    expect(result).not.toContain('36em')  // sm
    expect(result).not.toContain('48em')  // md
    expect(result).not.toContain('62em')  // lg
    expect(result).toContain('75em')      // xl
  })

  it('only emits a value when it changes from previous breakpoint', () => {
    // color is 'red' at xs, stays 'red' through sm/md, changes at lg
    const result = makeResponsive(
      { color: { xs: 'red', lg: 'blue' } },
      bps,
    )
    // count how many times 'color: red' appears
    const redCount = result.split('color: red').length - 1
    expect(redCount).toBe(1) // only once at xs
  })
})
