import { sheet } from './sheet'
import type { Interpolation } from './css'
import { CSSResult, resolveCSS } from './css'

/** Define @keyframes animation. Returns the animation name. */
export function keyframes(strings: TemplateStringsArray, ...values: Interpolation[]): string {
  const result = new CSSResult(strings, values)
  const css = resolveCSS(result)
  return sheet.insertKeyframes('', css)
}
