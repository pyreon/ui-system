/**
 * Strip the unit from a CSS value string.
 * Returns [numericValue, unit] or just numericValue.
 */
export function stripUnit(value: string): number
export function stripUnit(value: string, returnUnit: true): [number, string]
export function stripUnit(value: string, returnUnit?: boolean): number | [number, string] {
  const match = value.match(/^(-?\d*\.?\d+)\s*(.*?)$/)
  if (!match) return returnUnit ? [0, ''] : 0
  const num = parseFloat(match[1]!)
  if (returnUnit) return [num, match[2] ?? '']
  return num
}

/**
 * Convert a numeric value to a CSS value string.
 * Numbers > 1 become px, numbers <= 1 become rem (relative to rootSize).
 */
export function value(val: number | string, rootSize = 16): string {
  if (typeof val === 'string') return val
  if (val === 0) return '0'
  // If fractional (0 < val <= 1), treat as rem multiplier
  if (Math.abs(val) <= 1 && val !== 0) return `${val}rem`
  return `${val}px`
}

/**
 * Pick the first defined value from an array and convert it.
 */
export function values(...vals: (number | string | undefined | null)[]): string {
  for (const v of vals) {
    if (v !== undefined && v !== null) return value(v)
  }
  return '0'
}
