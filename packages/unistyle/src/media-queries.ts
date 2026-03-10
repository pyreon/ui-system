import type { BreakpointMap } from './breakpoints'
import { sortBreakpoints } from './breakpoints'

export type MediaQueryMap = Record<string, string>

/**
 * Create CSS media query strings from breakpoints.
 * Uses em units for accessibility (respects user font-size).
 * Returns mobile-first min-width queries.
 */
export function createMediaQueries(bps: BreakpointMap, rootSize = 16): MediaQueryMap {
  const sorted = sortBreakpoints(bps)
  const queries: MediaQueryMap = {}

  for (const [name, px] of sorted) {
    if (px === 0) {
      queries[name] = '' // No media query needed for smallest breakpoint
    } else {
      const em = px / rootSize
      queries[name] = `@media (min-width: ${em}em)`
    }
  }

  return queries
}

/**
 * Create a "between" media query for a specific breakpoint range.
 */
export function createBetweenQuery(
  minPx: number,
  maxPx: number,
  rootSize = 16,
): string {
  const minEm = minPx / rootSize
  const maxEm = (maxPx - 0.02) / rootSize
  return `@media (min-width: ${minEm}em) and (max-width: ${maxEm}em)`
}
