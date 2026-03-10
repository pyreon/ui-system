import type { BreakpointMap } from './breakpoints'
import { sortBreakpoints } from './breakpoints'
import { createMediaQueries } from './media-queries'

export type ResponsiveValue<T> = T | Partial<Record<string, T>>

/**
 * Normalize a responsive value into a full breakpoint map.
 * - Scalar: applied to all breakpoints
 * - Object: inherits from previous breakpoint if not specified
 */
export function normalizeResponsive<T>(
  value: ResponsiveValue<T>,
  bps: BreakpointMap,
): Record<string, T> {
  const sorted = sortBreakpoints(bps)
  const result: Record<string, T> = {}

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    // Scalar — apply to all breakpoints
    for (const [name] of sorted) {
      result[name] = value as T
    }
    return result
  }

  // Object — inherit from previous breakpoint
  const obj = value as Record<string, T>
  let prev: T | undefined
  for (const [name] of sorted) {
    if (name in obj) {
      prev = obj[name]
    }
    if (prev !== undefined) {
      result[name] = prev
    }
  }

  return result
}

/**
 * Transform responsive theme values into CSS wrapped in media queries.
 * Takes a theme object where each property may be a ResponsiveValue,
 * and returns CSS strings grouped by breakpoint.
 */
export function makeResponsive(
  theme: Record<string, ResponsiveValue<string | number>>,
  bps: BreakpointMap,
  rootSize = 16,
): string {
  const sorted = sortBreakpoints(bps)
  const queries = createMediaQueries(bps, rootSize)
  const byBreakpoint: Record<string, string[]> = {}

  for (const [name] of sorted) {
    byBreakpoint[name] = []
  }

  for (const [prop, value] of Object.entries(theme)) {
    const normalized = normalizeResponsive(value, bps)
    let prev: string | number | undefined
    for (const [bpName] of sorted) {
      const v = normalized[bpName]
      if (v !== undefined && v !== prev) {
        const cssValue = typeof v === 'number' ? `${v}px` : v
        byBreakpoint[bpName]!.push(`${camelToKebab(prop)}: ${cssValue};`)
        prev = v
      }
    }
  }

  let css = ''
  for (const [name] of sorted) {
    const rules = byBreakpoint[name]
    if (!rules || rules.length === 0) continue
    const block = rules.join(' ')
    const query = queries[name]
    css += query ? `${query} { ${block} } ` : `${block} `
  }

  return css.trim()
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}
