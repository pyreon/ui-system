export type BreakpointMap = Record<string, number>

export const defaultBreakpoints: BreakpointMap = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
}

export type BreakpointKey = keyof typeof defaultBreakpoints

/** Sort breakpoints ascending by pixel value. Returns [name, px] tuples. */
export function sortBreakpoints(bps: BreakpointMap): [string, number][] {
  return Object.entries(bps).sort(([, a], [, b]) => a - b)
}

/** Get the active breakpoint name for a given width. */
export function getBreakpoint(width: number, bps: BreakpointMap = defaultBreakpoints): string {
  const sorted = sortBreakpoints(bps)
  let active = sorted[0]![0]
  for (const [name, min] of sorted) {
    if (width >= min) active = name
    else break
  }
  return active
}
