import { describe, it, expect } from 'vitest'
import { stripUnit, value, values } from '../units'

describe('stripUnit', () => {
  it('strips px unit and returns number', () => {
    expect(stripUnit('16px')).toBe(16)
  })

  it('strips rem unit and returns number', () => {
    expect(stripUnit('1.5rem')).toBe(1.5)
  })

  it('strips em unit and returns number', () => {
    expect(stripUnit('2em')).toBe(2)
  })

  it('strips % and returns number', () => {
    expect(stripUnit('50%')).toBe(50)
  })

  it('strips vh unit and returns number', () => {
    expect(stripUnit('100vh')).toBe(100)
  })

  it('returns 0 for "0"', () => {
    expect(stripUnit('0')).toBe(0)
  })

  it('handles negative values', () => {
    expect(stripUnit('-10px')).toBe(-10)
  })

  it('handles decimal values', () => {
    expect(stripUnit('1.5em')).toBe(1.5)
  })

  it('returns 0 for non-numeric strings', () => {
    expect(stripUnit('auto')).toBe(0)
  })

  it('returns 0 for empty string', () => {
    expect(stripUnit('')).toBe(0)
  })

  describe('with returnUnit=true', () => {
    it('returns [value, unit] tuple for px', () => {
      expect(stripUnit('16px', true)).toEqual([16, 'px'])
    })

    it('returns [value, unit] tuple for rem', () => {
      expect(stripUnit('2rem', true)).toEqual([2, 'rem'])
    })

    it('returns [value, unit] tuple for %', () => {
      expect(stripUnit('100%', true)).toEqual([100, '%'])
    })

    it('returns [value, unit] tuple for em', () => {
      expect(stripUnit('1.5em', true)).toEqual([1.5, 'em'])
    })

    it('returns [value, empty string] for unitless number', () => {
      expect(stripUnit('42', true)).toEqual([42, ''])
    })

    it('handles decimal values with unit', () => {
      expect(stripUnit('0.5rem', true)).toEqual([0.5, 'rem'])
    })

    it('handles negative values with unit', () => {
      expect(stripUnit('-10px', true)).toEqual([-10, 'px'])
    })

    it('returns [0, ""] for non-numeric strings', () => {
      expect(stripUnit('auto', true)).toEqual([0, ''])
    })
  })
})

describe('value', () => {
  it('returns string values as-is', () => {
    expect(value('50%')).toBe('50%')
    expect(value('2em')).toBe('2em')
    expect(value('100vh')).toBe('100vh')
    expect(value('auto')).toBe('auto')
  })

  it('returns "0" for zero', () => {
    expect(value(0)).toBe('0')
  })

  it('converts numbers > 1 to px', () => {
    expect(value(16)).toBe('16px')
    expect(value(32)).toBe('32px')
    expect(value(100)).toBe('100px')
  })

  it('converts fractional numbers (0 < n <= 1) to rem', () => {
    expect(value(0.5)).toBe('0.5rem')
    expect(value(1)).toBe('1rem')
    expect(value(0.25)).toBe('0.25rem')
  })

  it('handles negative numbers > 1 as px', () => {
    expect(value(-10)).toBe('-10px')
  })

  it('handles negative fractional numbers as rem', () => {
    expect(value(-0.5)).toBe('-0.5rem')
    expect(value(-1)).toBe('-1rem')
  })

  it('rootSize parameter does not affect output', () => {
    // Current implementation doesn't use rootSize for conversion
    expect(value(16, 10)).toBe('16px')
    expect(value(0.5, 10)).toBe('0.5rem')
  })
})

describe('values', () => {
  it('returns the first defined value converted', () => {
    expect(values(undefined, null, 16)).toBe('16px')
  })

  it('returns the first value if defined', () => {
    expect(values(32, 16)).toBe('32px')
  })

  it('passes through string values', () => {
    expect(values('50%')).toBe('50%')
  })

  it('returns "0" when all values are null/undefined', () => {
    expect(values(undefined, null)).toBe('0')
  })

  it('returns "0" for zero value', () => {
    expect(values(0)).toBe('0')
  })

  it('skips undefined and null to find first valid value', () => {
    expect(values(undefined, undefined, null, 42)).toBe('42px')
  })

  it('treats 0 as a valid value', () => {
    expect(values(0, 16)).toBe('0')
  })

  it('returns "0" with no arguments', () => {
    expect(values()).toBe('0')
  })

  it('handles string as first argument', () => {
    expect(values('auto')).toBe('auto')
  })

  it('handles mixed types', () => {
    expect(values(undefined, '50%', 16)).toBe('50%')
  })
})
