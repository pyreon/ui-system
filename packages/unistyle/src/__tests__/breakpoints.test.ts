import { describe, it, expect } from 'vitest'
import { defaultBreakpoints, sortBreakpoints, getBreakpoint } from '../breakpoints'
import type { BreakpointMap, BreakpointKey } from '../breakpoints'

describe('defaultBreakpoints', () => {
  it('has expected keys', () => {
    expect(defaultBreakpoints).toHaveProperty('xs')
    expect(defaultBreakpoints).toHaveProperty('sm')
    expect(defaultBreakpoints).toHaveProperty('md')
    expect(defaultBreakpoints).toHaveProperty('lg')
    expect(defaultBreakpoints).toHaveProperty('xl')
    expect(defaultBreakpoints).toHaveProperty('xxl')
  })

  it('has correct pixel values', () => {
    expect(defaultBreakpoints.xs).toBe(0)
    expect(defaultBreakpoints.sm).toBe(576)
    expect(defaultBreakpoints.md).toBe(768)
    expect(defaultBreakpoints.lg).toBe(992)
    expect(defaultBreakpoints.xl).toBe(1200)
    expect(defaultBreakpoints.xxl).toBe(1400)
  })

  it('values are in ascending order', () => {
    const values = Object.values(defaultBreakpoints)
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]!)
    }
  })
})

describe('sortBreakpoints', () => {
  it('sorts breakpoints by value ascending', () => {
    const bps: BreakpointMap = { md: 768, xs: 0, xl: 1200, sm: 576 }
    const sorted = sortBreakpoints(bps)
    expect(sorted).toEqual([
      ['xs', 0],
      ['sm', 576],
      ['md', 768],
      ['xl', 1200],
    ])
  })

  it('handles already sorted breakpoints', () => {
    const bps: BreakpointMap = { xs: 0, sm: 576, md: 768 }
    const sorted = sortBreakpoints(bps)
    expect(sorted).toEqual([
      ['xs', 0],
      ['sm', 576],
      ['md', 768],
    ])
  })

  it('handles single breakpoint', () => {
    expect(sortBreakpoints({ xs: 0 })).toEqual([['xs', 0]])
  })

  it('handles empty object', () => {
    expect(sortBreakpoints({})).toEqual([])
  })

  it('sorts full default breakpoint set', () => {
    const sorted = sortBreakpoints(defaultBreakpoints)
    expect(sorted.map(([name]) => name)).toEqual([
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      'xxl',
    ])
  })

  it('returns [name, px] tuples', () => {
    const sorted = sortBreakpoints({ md: 768 })
    expect(sorted[0]).toEqual(['md', 768])
    expect(sorted[0]![0]).toBe('md')
    expect(sorted[0]![1]).toBe(768)
  })
})

describe('getBreakpoint', () => {
  it('returns the smallest breakpoint for width 0', () => {
    expect(getBreakpoint(0)).toBe('xs')
  })

  it('returns xs for small widths', () => {
    expect(getBreakpoint(100)).toBe('xs')
    expect(getBreakpoint(575)).toBe('xs')
  })

  it('returns sm for widths at sm threshold', () => {
    expect(getBreakpoint(576)).toBe('sm')
    expect(getBreakpoint(767)).toBe('sm')
  })

  it('returns md for widths at md threshold', () => {
    expect(getBreakpoint(768)).toBe('md')
    expect(getBreakpoint(991)).toBe('md')
  })

  it('returns lg for widths at lg threshold', () => {
    expect(getBreakpoint(992)).toBe('lg')
    expect(getBreakpoint(1199)).toBe('lg')
  })

  it('returns xl for widths at xl threshold', () => {
    expect(getBreakpoint(1200)).toBe('xl')
    expect(getBreakpoint(1399)).toBe('xl')
  })

  it('returns xxl for widths at xxl threshold', () => {
    expect(getBreakpoint(1400)).toBe('xxl')
    expect(getBreakpoint(2000)).toBe('xxl')
  })

  it('uses default breakpoints when none provided', () => {
    expect(getBreakpoint(800)).toBe('md')
  })

  it('uses custom breakpoints when provided', () => {
    const custom: BreakpointMap = { small: 0, large: 1000 }
    expect(getBreakpoint(500, custom)).toBe('small')
    expect(getBreakpoint(1000, custom)).toBe('large')
    expect(getBreakpoint(1500, custom)).toBe('large')
  })

  it('handles custom breakpoints without a 0 value', () => {
    const custom: BreakpointMap = { tablet: 768, desktop: 1024 }
    // width < smallest breakpoint => still returns first sorted name
    expect(getBreakpoint(500, custom)).toBe('tablet')
  })

  it('handles single breakpoint', () => {
    expect(getBreakpoint(500, { only: 0 })).toBe('only')
  })
})
