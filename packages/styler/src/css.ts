export type Interpolation = string | number | boolean | null | undefined | InterpolationFn | CSSResult
export type InterpolationFn = (props: Record<string, unknown>) => Interpolation

/** Lazy CSS representation from tagged template. */
export class CSSResult {
  constructor(
    public readonly strings: TemplateStringsArray | string[],
    public readonly values: Interpolation[],
  ) {}
}

/** Tagged template for CSS. Returns a lazy CSSResult. */
export function css(strings: TemplateStringsArray, ...values: Interpolation[]): CSSResult {
  return new CSSResult(strings, values)
}

/** Resolve a CSSResult into a CSS string, optionally with props. */
export function resolveCSS(result: CSSResult, props?: Record<string, unknown>): string {
  let out = ''
  for (let i = 0; i < result.strings.length; i++) {
    out += result.strings[i]
    if (i < result.values.length) {
      out += resolveValue(result.values[i]!, props)
    }
  }
  return normalizeCSS(out)
}

function resolveValue(val: Interpolation, props?: Record<string, unknown>): string {
  if (val === null || val === undefined || val === false || val === true) return ''
  if (typeof val === 'number') return String(val)
  if (typeof val === 'string') return val
  if (typeof val === 'function') return resolveValue(val(props ?? {}), props)
  if (val instanceof CSSResult) return resolveCSS(val, props)
  return ''
}

/** Single-pass CSS normalization: strip comments, collapse whitespace. */
function normalizeCSS(raw: string): string {
  let out = ''
  let i = 0
  while (i < raw.length) {
    // Skip block comments
    if (raw[i] === '/' && raw[i + 1] === '*') {
      i = raw.indexOf('*/', i + 2)
      i = i === -1 ? raw.length : i + 2
      continue
    }
    // Skip line comments (but not :// in URLs)
    if (raw[i] === '/' && raw[i + 1] === '/' && raw[i - 1] !== ':') {
      i = raw.indexOf('\n', i + 2)
      i = i === -1 ? raw.length : i + 1
      continue
    }
    // Collapse whitespace
    const c = raw[i]!
    if (c === '\n' || c === '\r' || c === '\t') {
      if (out.length > 0 && out[out.length - 1] !== ' ') out += ' '
      i++
      continue
    }
    // Collapse multiple spaces
    if (c === ' ' && out[out.length - 1] === ' ') {
      i++
      continue
    }
    out += c
    i++
  }
  return out.trim()
}
